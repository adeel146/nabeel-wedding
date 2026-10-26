import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseContacts, senderPayload } from './whatsapp-roster.mjs'

export const contactsPath = new URL('../whatsapp-contacts.local.json', import.meta.url)

async function readContacts(path) {
  let text
  try {
    text = await readFile(path, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return { contacts: {}, contactsFileFound: false }
    throw error
  }
  return { contacts: parseContacts(text), contactsFileFound: true }
}

export async function createWhatsappServer({ privateContactsPath = contactsPath } = {}) {
  const { contacts, contactsFileFound } = await readContacts(privateContactsPath)
  const payload = JSON.stringify(senderPayload(contacts, contactsFileFound))
  const assets = new Map([
    ['/', ['text/html; charset=utf-8', new URL('./whatsapp.html', import.meta.url)]],
    ['/whatsapp.css', ['text/css; charset=utf-8', new URL('./whatsapp.css', import.meta.url)]],
    ['/whatsapp-page.mjs', ['text/javascript; charset=utf-8', new URL('./whatsapp-page.mjs', import.meta.url)]],
    ['/whatsapp-links.mjs', ['text/javascript; charset=utf-8', new URL('./whatsapp-links.mjs', import.meta.url)]],
  ])
  return createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'none'")
    const port = response.socket.localPort
    if (![`127.0.0.1:${port}`, `localhost:${port}`].includes(request.headers.host)
      || (request.headers['sec-fetch-site'] && !['same-origin', 'none'].includes(request.headers['sec-fetch-site']))
      || (request.headers.origin && ![`http://127.0.0.1:${port}`, `http://localhost:${port}`].includes(request.headers.origin))) {
      response.writeHead(403).end('This page is available only from its local address.')
      return
    }
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET')
      response.writeHead(405).end('Only GET requests are supported.')
      return
    }
    if (request.url === '/api/guests') {
      response.setHeader('Content-Type', 'application/json; charset=utf-8')
      response.end(payload)
      return
    }
    const asset = assets.get(request.url)
    if (!asset) {
      response.writeHead(404).end('Not found.')
      return
    }
    try {
      const body = await readFile(asset[1])
      response.setHeader('Content-Type', asset[0])
      response.end(body)
    } catch (error) {
      console.error(`Unable to serve local WhatsApp page: ${error.message}`)
      response.writeHead(500).end('Unable to load the local sending page. Check the terminal for details.')
    }
  })
}

async function main() {
  const port = Number(process.env.WHATSAPP_PORT ?? 5180)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('WHATSAPP_PORT must be a port from 1 to 65535.')
  const server = await createWhatsappServer()
  server.on('error', error => {
    console.error(`Cannot start the local WhatsApp page: ${error.message}`)
    process.exitCode = 1
  })
  server.listen(port, '127.0.0.1', () => {
    console.log(`Private WhatsApp sending page: http://127.0.0.1:${port}`)
    console.log(`Optional private contacts: ${fileURLToPath(contactsPath)}`)
    console.log('No messages are sent automatically. Press Send inside WhatsApp for each guest.')
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(`Cannot start the local WhatsApp page: ${error.message}`)
    process.exitCode = 1
  })
}
