import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { parseContacts, senderPayload } from './whatsapp-roster.mjs'

const cookieName = '__Host-whatsapp-session'
const sessionSeconds = 8 * 60 * 60
const assets = new Map([
  ['whatsapp.css', ['text/css; charset=utf-8', new URL('./whatsapp.css', import.meta.url)]],
  ['whatsapp-page.mjs', ['text/javascript; charset=utf-8', new URL('./whatsapp-page.mjs', import.meta.url)]],
  ['whatsapp-links.mjs', ['text/javascript; charset=utf-8', new URL('./whatsapp-links.mjs', import.meta.url)]],
  ['login.mjs', ['text/javascript; charset=utf-8', new URL('./whatsapp-login.mjs', import.meta.url)]],
])

function equalSecret(left, right) {
  const digest = value => createHash('sha256').update(value).digest()
  return timingSafeEqual(digest(left), digest(right))
}

function signature(payload, env) {
  return createHmac('sha256', env.WHATSAPP_SESSION_SECRET)
    .update(`${env.WHATSAPP_PASSWORD}\0${payload}`).digest('base64url')
}

function sessionValid(cookie, env, now) {
  if (typeof cookie !== 'string' || cookie.length > 4096) return false
  const token = cookie.split(';').map(value => value.trim())
    .find(value => value.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1)
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 2 || !equalSecret(parts[1], signature(parts[0], env))) return false
  let payload
  try {
    payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'))
  } catch {
    return false
  }
  return Number.isInteger(payload.expires) && payload.expires > now
    && payload.expires <= now + sessionSeconds
}

function sessionCookie(token, maxAge = sessionSeconds) {
  return `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
}

function reply(response, status, body, type = 'application/json; charset=utf-8') {
  response.writeHead(status, { 'Content-Type': type })
  response.end(type.startsWith('application/json') ? JSON.stringify(body) : body)
}

function sameOrigin(request) {
  if (request.headers['sec-fetch-site'] && request.headers['sec-fetch-site'] !== 'same-origin') return false
  try {
    const origin = new URL(request.headers.origin)
    return origin.protocol === 'https:' && origin.host === request.headers.host
  } catch {
    return false
  }
}

async function loginBody(request) {
  if (request.headers['content-type']?.split(';')[0].trim() !== 'application/json') return null
  if (request.body !== undefined) {
    const text = typeof request.body === 'string' ? request.body : JSON.stringify(request.body)
    if (Buffer.byteLength(text) > 1024) return null
    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  }
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += Buffer.byteLength(chunk)
    if (size > 1024) return null
    chunks.push(Buffer.from(chunk))
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return null
  }
}

export function createProductionHandler({ environment = () => process.env, now = () => Math.floor(Date.now() / 1000) } = {}) {
  return async (request, response) => {
    response.setHeader('Cache-Control', 'private, no-store, max-age=0')
    response.setHeader('CDN-Cache-Control', 'no-store')
    response.setHeader('Vercel-CDN-Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader('X-Robots-Tag', 'noindex, nofollow')
    response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'self'")
    try {
      const env = environment()
      if (!env.WHATSAPP_PASSWORD || !env.WHATSAPP_SESSION_SECRET || env.WHATSAPP_SESSION_SECRET.length < 32) {
        console.error('WhatsApp dashboard requires WHATSAPP_PASSWORD and a WHATSAPP_SESSION_SECRET of at least 32 characters.')
        return reply(response, 503, { error: 'The private dashboard is not configured. Contact the site owner.' })
      }
      const url = new URL(request.url, 'https://dashboard.invalid')
      const route = url.searchParams.get('path') ?? url.pathname.replace(/^\/whatsapp\/?/, '')
      if (request.method === 'POST' && ['login', 'logout'].includes(route)) {
        if (!sameOrigin(request)) return reply(response, 403, { error: 'Use this website to sign in or sign out.' })
        if (route === 'logout') {
          response.setHeader('Set-Cookie', sessionCookie('', 0))
          return reply(response, 200, { ok: true })
        }
        const body = await loginBody(request)
        if (!body || typeof body.password !== 'string' || body.password.length > 256) {
          return reply(response, 400, { error: 'Enter a valid password.' })
        }
        if (!equalSecret(body.password, env.WHATSAPP_PASSWORD)) {
          return reply(response, 401, { error: 'Incorrect password.' })
        }
        const payload = Buffer.from(JSON.stringify({
          expires: now() + sessionSeconds,
          nonce: randomBytes(16).toString('hex'),
        })).toString('base64url')
        response.setHeader('Set-Cookie', sessionCookie(`${payload}.${signature(payload, env)}`))
        return reply(response, 200, { ok: true })
      }
      if (request.method !== 'GET' || ['login', 'logout'].includes(route)) {
        response.setHeader('Allow', ['login', 'logout'].includes(route) ? 'POST' : 'GET')
        return reply(response, 405, { error: 'Method not allowed.' })
      }
      const authenticated = sessionValid(request.headers.cookie, env, now())
      if (route === '') {
        const file = authenticated ? './whatsapp.html' : './whatsapp-login.html'
        const html = await readFile(new URL(file, import.meta.url), 'utf8')
        return reply(response, 200, html.replaceAll('="./', '="/whatsapp/'), 'text/html; charset=utf-8')
      }
      if (route === 'whatsapp.css' || route === 'login.mjs') {
        const [type, file] = assets.get(route)
        return reply(response, 200, await readFile(file, 'utf8'), type)
      }
      if (!authenticated) return reply(response, 401, { error: 'Sign in to access the private dashboard.' })
      if (route === 'api/guests') {
        if (!env.WHATSAPP_CONTACTS_JSON) {
          console.error('WhatsApp dashboard requires WHATSAPP_CONTACTS_JSON.')
          return reply(response, 503, { error: 'Private contacts are not configured. Contact the site owner.' })
        }
        const payload = senderPayload(parseContacts(env.WHATSAPP_CONTACTS_JSON), true)
        return reply(response, 200, { ...payload, authenticated: true })
      }
      if (assets.has(route)) {
        const [type, file] = assets.get(route)
        return reply(response, 200, await readFile(file, 'utf8'), type)
      }
      return reply(response, 404, { error: 'Not found.' })
    } catch (error) {
      // Never log request bodies or contact-validation messages containing private data.
      console.error('WhatsApp dashboard request failed:', error instanceof Error ? error.name : 'UnknownError')
      return reply(response, 500, { error: 'Unable to load the private dashboard. Check the server configuration and try again.' })
    }
  }
}
