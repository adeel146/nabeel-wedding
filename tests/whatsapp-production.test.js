import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer, request } from 'node:http'
import { once } from 'node:events'
import { readFile } from 'node:fs/promises'
import { createProductionHandler } from '../tools/whatsapp-production.mjs'
import { guests, weddingConfig } from '../src/config.js'
import { personalizedMessage } from '../tools/whatsapp-links.mjs'

const syntheticEnv = {
  WHATSAPP_PASSWORD: 'synthetic-test-password',
  WHATSAPP_SESSION_SECRET: 'synthetic-session-secret-with-at-least-32-characters',
  WHATSAPP_CONTACTS_JSON: JSON.stringify({ '2909': '03001234567' }),
}

async function fixture(t, env = { ...syntheticEnv }) {
  let time = 100000
  const handler = createProductionHandler({ environment: () => env, now: () => time })
  const server = createServer(handler)
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())))
  const port = server.address().port
  async function send(path, { method = 'GET', cookie, body, headers = {} } = {}) {
    return new Promise((resolve, reject) => {
      const req = request({
        host: '127.0.0.1', port, path, method, agent: false,
        headers: {
          Host: 'invitation.example',
          ...(method === 'POST' ? { Origin: 'https://invitation.example', 'Content-Type': 'application/json' } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
          ...headers,
        },
      }, res => {
        const chunks = []
        res.on('data', chunk => chunks.push(chunk))
        res.on('error', reject)
        res.on('end', () => resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf8'),
        }))
      })
      req.on('error', reject)
      req.end(body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body))
    })
  }
  async function login() {
    const response = await send('/whatsapp/login', { method: 'POST', body: { password: env.WHATSAPP_PASSWORD } })
    assert.equal(response.status, 200)
    const cookie = response.headers['set-cookie'][0]
    assert.match(cookie, /; Path=\/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800$/)
    return cookie.split(';')[0]
  }
  return { send, login, advance: seconds => { time += seconds }, env }
}

function assertPrivate(response) {
  assert.match(response.headers['cache-control'], /private, no-store/)
  assert.equal(response.headers['vercel-cdn-cache-control'], 'no-store')
  assert.equal(response.headers['cdn-cache-control'], 'no-store')
  assert.equal(response.headers['x-robots-tag'], 'noindex, nofollow')
  assert.match(response.headers['content-security-policy'], /frame-ancestors 'none'/)
  assert.equal(response.headers['access-control-allow-origin'], undefined)
  assert.ok(!response.body.includes(syntheticEnv.WHATSAPP_PASSWORD))
  assert.ok(!response.body.includes(syntheticEnv.WHATSAPP_SESSION_SECRET))
}

test('unauthenticated dashboard serves only login, and private routes reject direct access', async t => {
  const { send } = await fixture(t)
  for (const path of ['/whatsapp', '/whatsapp/']) {
    const response = await send(path)
    assert.equal(response.status, 200)
    assert.match(response.body, /type="password"/)
    assert.match(response.body, /src="\/whatsapp\/login.mjs"/)
    assert.ok(!response.body.includes('03001234567'))
    assertPrivate(response)
  }
  for (const path of [
    '/whatsapp/api/guests', '/whatsapp/whatsapp-page.mjs',
    '/api/whatsapp?path=api/guests', '/whatsapp/whatsapp-contacts.local.json',
  ]) {
    const response = await send(path)
    assert.equal(response.status, 401)
    assert.ok(!response.body.includes('03001234567'))
    assertPrivate(response)
  }
  for (const path of ['/whatsapp/login.mjs', '/whatsapp/whatsapp.css']) {
    const response = await send(path)
    assert.equal(response.status, 200)
    assertPrivate(response)
  }
})

test('wrong passwords, malformed bodies, oversized inputs and foreign origins do not create sessions', async t => {
  const { send } = await fixture(t)
  for (const [body, status] of [
    [{ password: 'wrong-password' }, 401], ['{', 400], [null, 400],
    [{ password: 42 }, 400], [{ password: 'x'.repeat(257) }, 400],
    [{ password: 'x'.repeat(2000) }, 400],
  ]) {
    const response = await send('/whatsapp/login', { method: 'POST', body })
    assert.equal(response.status, status)
    assert.equal(response.headers['set-cookie'], undefined)
    assertPrivate(response)
  }
  for (const headers of [
    { Origin: 'https://foreign.example' }, { Origin: 'null' },
    { Origin: 'http://invitation.example' }, { Origin: '' },
    { 'Sec-Fetch-Site': 'cross-site' },
  ]) {
    const response = await send('/whatsapp/login', {
      method: 'POST', body: { password: syntheticEnv.WHATSAPP_PASSWORD }, headers,
    })
    assert.equal(response.status, 403)
    assert.equal(response.headers['set-cookie'], undefined)
  }
  const form = await send('/whatsapp/login', {
    method: 'POST', body: 'password=wrong', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  assert.equal(form.status, 400)
})

test('successful login unlocks dashboard and exact mapped contacts through rewritten and direct routes', async t => {
  const { send, login } = await fixture(t)
  const cookie = await login()
  for (const path of ['/whatsapp', '/api/whatsapp?path=']) {
    const page = await send(path, { cookie })
    assert.equal(page.status, 200)
    assert.match(page.body, /id="logout"/)
    assert.match(page.body, /src="\/whatsapp\/whatsapp-page.mjs"/)
    assertPrivate(page)
  }
  for (const path of ['/whatsapp/api/guests', '/api/whatsapp?path=api/guests']) {
    const response = await send(path, { cookie })
    assert.equal(response.status, 200)
    assertPrivate(response)
    const data = JSON.parse(response.body)
    assert.equal(data.authenticated, true)
    assert.equal(data.contactsFileFound, true)
    assert.equal(data.defaultMessage,
      `Assalamualaikum {name}!\n\nYou are warmly invited to celebrate the wedding of ${weddingConfig.groom} and ${weddingConfig.bride}.\n\nYour personal invitation:\n{link}\n\nWe look forward to celebrating with you!`)
    const recipient = data.guests.find(guest => guest.id === '2909')
    const message = personalizedMessage(data.defaultMessage, recipient, 'https://nabeel-wedding.vercel.app')
    assert.ok(message.includes(`Assalamualaikum ${recipient.name}!`))
    assert.ok(message.includes('https://nabeel-wedding.vercel.app/invite/2909'))
    assert.ok(!message.includes('{name}') && !message.includes('{link}'))
    assert.equal(data.guests.length, Object.keys(guests).length)
    assert.equal(data.guests.find(guest => guest.id === '2909').phone, '03001234567')
    assert.ok(data.guests.filter(guest => guest.id !== '2909').every(guest => guest.phone === ''))
  }
  for (const path of ['/whatsapp/whatsapp-page.mjs', '/whatsapp/whatsapp-links.mjs']) {
    assert.equal((await send(path, { cookie })).status, 200)
  }
  for (const path of [
    '/whatsapp/../whatsapp-contacts.local.json', '/whatsapp/whatsapp-production.mjs',
    '/whatsapp/whatsapp-roster.mjs', '/api/whatsapp?path=../whatsapp-contacts.local.json',
  ]) assert.equal((await send(path, { cookie })).status, 404)
})

test('production includes every configured guest without numbers and picks up future guests and matching contacts', async t => {
  const { send, login, env } = await fixture(t, { ...syntheticEnv, WHATSAPP_CONTACTS_JSON: '{}' })
  const cookie = await login()
  const initial = await send('/whatsapp/api/guests', { cookie })
  assert.equal(initial.status, 200)
  const initialGuests = JSON.parse(initial.body).guests
  assert.deepEqual(initialGuests.map(guest => guest.id).sort(), Object.keys(guests).sort())
  assert.ok(initialGuests.every(guest => guest.phone === ''))

  const id = 'test-future-guest'
  assert.equal(Object.hasOwn(guests, id), false)
  guests[id] = {
    name: 'Synthetic future guest',
    events: ['barat'],
    partySize: { barat: 2 },
    message: 'Synthetic invitation for a future guest.',
  }
  t.after(() => { delete guests[id] })

  const withoutPhone = await send('/whatsapp/api/guests', { cookie })
  assert.equal(withoutPhone.status, 200)
  const newGuest = JSON.parse(withoutPhone.body).guests.find(guest => guest.id === id)
  assert.equal(newGuest.name, guests[id].name)
  assert.equal(newGuest.phone, '')
  assert.equal(newGuest.events.length, 1)
  assert.match(newGuest.events[0], /2 persons/)

  env.WHATSAPP_CONTACTS_JSON = JSON.stringify({ [id]: '+1 (202) 555-0123' })
  const withPhone = await send('/api/whatsapp?path=api/guests', { cookie })
  assert.equal(withPhone.status, 200)
  const updatedGuests = JSON.parse(withPhone.body).guests
  assert.equal(updatedGuests.length, initialGuests.length + 1)
  assert.equal(updatedGuests.find(guest => guest.id === id).phone, '+1 (202) 555-0123')
})

test('tampered, expired and password/secret-rotated cookies cannot fetch contacts', async t => {
  const { send, login, advance, env } = await fixture(t)
  const cookie = await login()
  for (const invalid of ['__Host-whatsapp-session=garbage', `${cookie}x`, cookie.replace('=', '=x')]) {
    assert.equal((await send('/whatsapp/api/guests', { cookie: invalid })).status, 401)
  }
  env.WHATSAPP_PASSWORD = 'rotated-test-password'
  assert.equal((await send('/whatsapp/api/guests', { cookie })).status, 401)
  env.WHATSAPP_PASSWORD = syntheticEnv.WHATSAPP_PASSWORD
  env.WHATSAPP_SESSION_SECRET = 'rotated-session-secret-with-at-least-32-characters'
  assert.equal((await send('/whatsapp/api/guests', { cookie })).status, 401)
  env.WHATSAPP_SESSION_SECRET = syntheticEnv.WHATSAPP_SESSION_SECRET
  advance(8 * 60 * 60)
  assert.equal((await send('/whatsapp/api/guests', { cookie })).status, 401)
})

test('logout expires the cookie and protected endpoints reject an unauthenticated follow-up', async t => {
  const { send, login } = await fixture(t)
  const cookie = await login()
  const response = await send('/whatsapp/logout', { method: 'POST', cookie })
  assert.equal(response.status, 200)
  assert.match(response.headers['set-cookie'][0], /Max-Age=0$/)
  const clearedCookie = response.headers['set-cookie'][0].split(';')[0]
  assert.equal((await send('/whatsapp/api/guests', { cookie: clearedCookie })).status, 401)
  assert.equal((await send('/whatsapp/logout', {
    method: 'POST', cookie, headers: { Origin: 'https://foreign.example' },
  })).status, 403)
})

test('missing server secrets fail closed and invalid contacts never leak configuration', async t => {
  for (const env of [
    {}, { ...syntheticEnv, WHATSAPP_PASSWORD: '' },
    { ...syntheticEnv, WHATSAPP_SESSION_SECRET: 'too-short' },
  ]) {
    const { send } = await fixture(t, env)
    for (const path of ['/whatsapp', '/whatsapp/api/guests']) {
      const response = await send(path)
      assert.equal(response.status, 503)
      assertPrivate(response)
    }
  }
  for (const [contacts, status] of [
    [undefined, 503], ['{', 500], ['[]', 500],
    ['{"unknown-private-name":"03001234567"}', 500], ['{"2909":"bad-phone"}', 500],
  ]) {
    const { send, login } = await fixture(t, { ...syntheticEnv, WHATSAPP_CONTACTS_JSON: contacts })
    const cookie = await login()
    const response = await send('/whatsapp/api/guests', { cookie })
    assert.equal(response.status, status)
    assert.ok(!response.body.includes('unknown-private-name'))
    assert.ok(!response.body.includes('bad-phone'))
    assertPrivate(response)
  }
})

test('only supported methods are accepted, including direct Vercel function routes', async t => {
  const { send, login } = await fixture(t)
  const cookie = await login()
  for (const [path, method, allow] of [
    ['/whatsapp/login', 'GET', 'POST'], ['/whatsapp/logout', 'GET', 'POST'],
    ['/whatsapp/api/guests', 'POST', 'GET'], ['/api/whatsapp?path=api/guests', 'PUT', 'GET'],
    ['/whatsapp', 'HEAD', 'GET'],
  ]) {
    const response = await send(path, { method, cookie })
    assert.equal(response.status, 405)
    assert.equal(response.headers.allow, allow)
  }
})

test('Vercel routes dashboard and function before SPA, and bundles only explicit sender assets', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
  assert.equal(config.rewrites[0].source, '/whatsapp')
  assert.equal(config.rewrites[1].source, '/whatsapp/:path*')
  assert.equal(config.rewrites.at(-1).destination, '/index.html')
  const files = config.functions['api/whatsapp.js'].includeFiles
  assert.ok(files.includes('whatsapp-login.html'))
  assert.ok(!files.includes('contacts') && !files.includes('*'))
})
