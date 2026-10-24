import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdtemp, readFile, rmdir, unlink, writeFile } from 'node:fs/promises'
import { request } from 'node:http'
import { join } from 'node:path'
import { guests, getGuestEvents } from '../src/config.js'
import {
  invitationUrl,
  normalizePhone,
  normalizeSiteUrl,
  personalizedMessage,
  whatsappUrl,
} from '../tools/whatsapp-links.mjs'
import { createWhatsappServer } from '../tools/whatsapp-server.mjs'

const siteUrl = 'https://invitation.example'

async function contactsFixture(t, contents) {
  // Stay inside the project and never open the real private contacts file.
  const directory = await mkdtemp(join(process.cwd(), '.whatsapp-test-'))
  const path = join(directory, 'synthetic-contacts.json')
  t.after(async () => {
    try {
      await unlink(path)
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    await rmdir(directory)
  })
  if (contents !== undefined) await writeFile(path, contents, 'utf8')
  return path
}

async function localServer(t, contents) {
  const privateContactsPath = await contactsFixture(t, contents)
  const server = await createWhatsappServer({ privateContactsPath })
  assert.equal(server.listening, false)
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve())
  }))
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port, address } = server.address()
  assert.equal(address, '127.0.0.1')
  return { port }
}

function httpRequest(port, path, { method = 'GET', headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const req = request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: { Host: `127.0.0.1:${port}`, ...headers },
      agent: false,
    }, response => {
      const chunks = []
      response.on('data', chunk => chunks.push(chunk))
      response.on('error', reject)
      response.on('end', () => resolve({
        status: response.statusCode,
        headers: response.headers,
        body: Buffer.concat(chunks).toString('utf8'),
      }))
    })
    req.on('error', reject)
    req.end()
  })
}

function assertPrivacyHeaders(headers) {
  assert.equal(headers['cache-control'], 'no-store')
  assert.equal(headers['x-content-type-options'], 'nosniff')
  assert.equal(headers['referrer-policy'], 'no-referrer')
  const directives = headers['content-security-policy'].split(';').map(value => value.trim())
  for (const directive of [
    "default-src 'none'", "script-src 'self'", "style-src 'self'", "connect-src 'self'",
    "base-uri 'none'", "frame-ancestors 'none'", "form-action 'none'",
  ]) assert.ok(directives.includes(directive), directive)
  assert.equal(headers['access-control-allow-origin'], undefined)
}

test('phone normalization converts Pakistan mobile and international formats', () => {
  for (const phone of ['03001234567', ' 0300 123-4567 ', '(0300) 123.4567']) {
    assert.equal(normalizePhone(phone), '923001234567')
  }
  for (const phone of ['+92 300 1234567', '0092 300 1234567', '923001234567']) {
    assert.equal(normalizePhone(phone), '923001234567')
  }
  for (const phone of ['+1 (202) 555-0123', '001 202 555 0123', '12025550123']) {
    assert.equal(normalizePhone(phone), '12025550123')
  }
})

test('phone normalization rejects empty, invalid and partial phone numbers', () => {
  for (const phone of [
    undefined, null, 3001234567, '', '  ', '0300', '0300123456', '1234567',
    '+', '00', '00000000000', '+0123456789', '1234567890123456',
    '03001234567 ext 2', '0300/1234567', '++923001234567', '92+3001234567',
  ]) assert.throws(() => normalizePhone(phone), /phone number|digits|international/i)
})

test('site URL normalization accepts only published HTTP home URLs', () => {
  assert.equal(normalizeSiteUrl(' HTTPS://Invitation.Example/ '), siteUrl)
  assert.equal(normalizeSiteUrl('http://invitation.example/'), 'http://invitation.example')
  assert.equal(normalizeSiteUrl('https://invitation.example:8443/'), `${siteUrl}:8443`)
  for (const url of [
    '', 'invitation.example', 'not a URL', 'https://localhost/', 'http://127.0.0.1:5180/',
    'http://[::1]/', `${siteUrl}/invite/2909`, `${siteUrl}?guest=2909`,
    `${siteUrl}#guest`, 'https://user:password@invitation.example/',
    'javascript:alert(1)', 'file:///invitation.html', 'ftp://invitation.example/',
  ]) assert.throws(() => normalizeSiteUrl(url), /URL|website|localhost|http/i)
})

test('numeric and temporary IDs produce distinct personal invitation URLs', () => {
  const ids = ['2909', '7400', 'temp-muhammad-arslan', 'temp-muhammad-ashfaq']
  const links = ids.map(id => invitationUrl(siteUrl, id))
  assert.equal(new Set(links).size, ids.length)
  for (const [index, id] of ids.entries()) {
    assert.ok(Object.hasOwn(guests, id))
    assert.equal(links[index], `${siteUrl}/invite/${id}`)
  }
  assert.equal(invitationUrl(siteUrl, 'test /?#&'), `${siteUrl}/invite/test%20%2F%3F%23%26`)
  for (const id of ['', undefined, null, 2909]) {
    assert.throws(() => invitationUrl(siteUrl, id), /invitation ID/)
  }
})

test('personalization replaces every placeholder literally, including special characters', () => {
  const guest = { id: 'test /?#&', name: "Test $& $` $' {link} & مہمان 🌸" }
  const link = invitationUrl(siteUrl, guest.id)
  assert.equal(
    personalizedMessage('  Hello {name}!\n{link}\n{name}: {link} {other}  ', guest, siteUrl),
    `Hello ${guest.name}!\n${link}\n${guest.name}: ${link} {other}`,
  )
  for (const template of [undefined, null, '', 'Hello {name}', '{link}', '{Name} {link}']) {
    assert.throws(() => personalizedMessage(template, guest, siteUrl), /both \{name\} and \{link\}/)
  }
})

test('WhatsApp links use wa.me and round-trip the exact message in one text parameter', () => {
  const message = `Assalamualaikum مہمان 🌸!\n$& + ? # % & text=other\n${siteUrl}/invite/2909`
  const url = new URL(whatsappUrl('+1 (202) 555-0123', message))
  assert.equal(url.protocol, 'https:')
  assert.equal(url.host, 'wa.me')
  assert.equal(url.pathname, '/12025550123')
  assert.equal(url.hash, '')
  assert.deepEqual([...url.searchParams], [['text', message]])
  for (const text of ['', ' \n ', null, undefined, 123]) {
    assert.throws(() => whatsappUrl('12025550123', text), /message cannot be empty/)
  }
  assert.throws(() => whatsappUrl('bad-phone', message), /digits/)
})

test('local HTTP server serves only its public local assets with privacy headers', async t => {
  const { port } = await localServer(t)
  for (const [path, file, type] of [
    ['/', 'whatsapp.html', 'text/html'],
    ['/whatsapp.css', 'whatsapp.css', 'text/css'],
    ['/whatsapp-page.mjs', 'whatsapp-page.mjs', 'text/javascript'],
    ['/whatsapp-links.mjs', 'whatsapp-links.mjs', 'text/javascript'],
  ]) {
    const response = await httpRequest(port, path)
    assert.equal(response.status, 200, path)
    assert.ok(response.headers['content-type'].startsWith(`${type};`))
    assert.equal(response.body, await readFile(new URL(`../tools/${file}`, import.meta.url), 'utf8'))
    assertPrivacyHeaders(response.headers)
  }
})

test('missing private file yields the complete 60-entry roster with empty numbers', async t => {
  const { port } = await localServer(t)
  const response = await httpRequest(port, '/api/guests')
  assert.equal(response.status, 200)
  assert.match(response.headers['content-type'], /^application\/json;/)
  assertPrivacyHeaders(response.headers)
  const payload = JSON.parse(response.body)
  assert.equal(payload.contactsFileFound, false)
  assert.equal(payload.guests.length, 60)
  assert.equal(new Set(payload.guests.map(guest => guest.id)).size, 60)
  assert.deepEqual(payload.guests.map(guest => guest.id).sort(), Object.keys(guests).sort())
  assert.match(payload.defaultMessage, /\{name\}/)
  assert.match(payload.defaultMessage, /\{link\}/)
  for (const guest of payload.guests) {
    assert.equal(guest.name, guests[guest.id].name)
    assert.equal(guest.phone, '')
    assert.deepEqual(guest.events, getGuestEvents(guests[guest.id])
      .map(event => `${event.title}: ${event.invitationSize}`))
  }
  const sorted = [...payload.guests].sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id))
  assert.deepEqual(payload.guests, sorted)
})

test('synthetic private contacts map by exact invitation ID, not roster position', async t => {
  const contacts = { '2909': '03001234567', 'temp-muhammad-arslan': '+1 (202) 555-0123' }
  const { port } = await localServer(t, JSON.stringify(contacts))
  const response = await httpRequest(port, '/api/guests')
  assert.equal(response.status, 200)
  const payload = JSON.parse(response.body)
  assert.equal(payload.contactsFileFound, true)
  assert.equal(payload.guests.length, 60)
  for (const guest of payload.guests) assert.equal(guest.phone, contacts[guest.id] ?? '')
})

test('unknown routes and private files cannot be fetched', async t => {
  const { port } = await localServer(t, JSON.stringify({ '2909': '03001234567' }))
  for (const path of [
    '/unknown', '/api/contacts', '/api/guests/2909', '/api/guests?all=true',
    '/whatsapp-contacts.local.json', '/synthetic-contacts.json',
    '/tools/whatsapp-server.mjs', '/src/config.js', '/package.json',
    '/../whatsapp-contacts.local.json', '/%2e%2e/whatsapp-contacts.local.json',
  ]) {
    const response = await httpRequest(port, path)
    assert.equal(response.status, 404, path)
    assert.equal(response.body, 'Not found.')
    assertPrivacyHeaders(response.headers)
  }
})

test('HTTP server accepts only GET requests', async t => {
  const { port } = await localServer(t)
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']) {
    const response = await httpRequest(port, '/api/guests', { method })
    assert.equal(response.status, 405, method)
    assert.equal(response.headers.allow, 'GET')
    assertPrivacyHeaders(response.headers)
  }
})

test('foreign Host, Origin and fetch-site headers are independently blocked', async t => {
  const { port } = await localServer(t)
  for (const headers of [
    { Host: `foreign.example:${port}` },
    { Host: '127.0.0.1:1' },
    { Host: `127.0.0.1:${port}.foreign.example` },
    { Origin: 'https://foreign.example' },
    { Origin: 'null' },
    { Origin: `http://127.0.0.1:${port + 1}` },
    { Origin: `https://localhost:${port}` },
    { 'Sec-Fetch-Site': 'cross-site' },
    { 'Sec-Fetch-Site': 'same-site' },
  ]) {
    const response = await httpRequest(port, '/api/guests', { headers })
    assert.equal(response.status, 403, JSON.stringify(headers))
    assertPrivacyHeaders(response.headers)
    assert.match(response.body, /only from its local address/)
  }
  for (const host of ['localhost', '127.0.0.1']) {
    for (const site of ['same-origin', 'none']) {
      const response = await httpRequest(port, '/api/guests', {
        headers: { Host: `${host}:${port}`, Origin: `http://${host}:${port}`, 'Sec-Fetch-Site': site },
      })
      assert.equal(response.status, 200)
    }
  }
})

test('malformed JSON and non-object private files reject explicitly', async t => {
  for (const contents of ['{', 'null', '[]', '"contacts"', '42', 'true']) {
    const privateContactsPath = await contactsFixture(t, contents)
    await assert.rejects(createWhatsappServer({ privateContactsPath }),
      contents === '{' ? /private contacts file is not valid JSON/ : /must be an object mapping invitation IDs/)
  }
})

test('unknown, alias and inherited private contact IDs reject explicitly', async t => {
  for (const id of ['not-a-guest', 'guest-001', 'muhammad-arslan', 'toString', '__proto__', 'constructor']) {
    const privateContactsPath = await contactsFixture(t, JSON.stringify({ [id]: '12025550123' }))
    await assert.rejects(createWhatsappServer({ privateContactsPath }),
      error => error.message === `Unknown invitation ID in private contacts: ${id}`)
  }
})

test('invalid synthetic private numbers reject with their invitation ID', async t => {
  for (const phone of ['', '0300', 'not-a-phone', 12025550123, null]) {
    const privateContactsPath = await contactsFixture(t, JSON.stringify({ '2909': phone }))
    await assert.rejects(createWhatsappServer({ privateContactsPath }), /Invalid phone for invitation 2909:/)
  }
})
