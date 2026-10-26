import { invitationUrl, normalizePhone, normalizeSiteUrl, personalizedMessage, whatsappUrl } from './whatsapp-links.mjs'

const storageKey = 'wedding-whatsapp-sender-v1'
const senderBase = location.pathname.startsWith('/whatsapp') ? '/whatsapp/' : '/'
const defaultSiteUrl = 'https://nabeel-wedding.vercel.app'
const siteInput = document.getElementById('site-url')
const messageInput = document.getElementById('message')
const searchInput = document.getElementById('search')
const filterInput = document.getElementById('filter')
const container = document.getElementById('guests')
const errorBox = document.getElementById('error')
const views = new Map()
let roster = []
let state = { siteUrl: defaultSiteUrl, message: '', phones: {}, sent: {}, opened: {} }

function showError(message) {
  errorBox.textContent = message
  errorBox.hidden = false
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state))
  } catch (error) {
    showError(`Your changes could not be saved in this browser: ${error.message}. Keep this page open; progress will be lost on reload.`)
  }
}

function restore() {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return
  const saved = JSON.parse(raw)
  if (!saved || typeof saved.siteUrl !== 'string' || typeof saved.message !== 'string') {
    throw new Error('Saved sending settings are invalid.')
  }
  for (const key of ['phones', 'sent', 'opened']) {
    if (!saved[key] || typeof saved[key] !== 'object' || Array.isArray(saved[key])) {
      throw new Error('Saved guest progress is invalid.')
    }
  }
  if (Object.values(saved.phones).some(phone => typeof phone !== 'string')
    || Object.values(saved.sent).some(sent => typeof sent !== 'boolean')
    || Object.values(saved.opened).some(opened => typeof opened !== 'string')) {
    throw new Error('Saved guest progress contains invalid values.')
  }
  state = saved
}

function element(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function phoneFor(guest) {
  return Object.hasOwn(state.phones, guest.id) ? state.phones[guest.id] : guest.phone
}

function phoneStatus(guest) {
  try {
    return { phone: normalizePhone(phoneFor(guest)), error: '' }
  } catch (error) {
    return { phone: null, error: error.message }
  }
}

function settingsError() {
  try {
    normalizeSiteUrl(state.siteUrl)
    personalizedMessage(state.message, roster[0], state.siteUrl)
    return ''
  } catch (error) {
    return error.message
  }
}

function refreshActions() {
  const configurationError = settingsError()
  document.getElementById('settings-error').textContent = configurationError
  const normalized = new Map(roster.map(guest => [guest.id, phoneStatus(guest)]))
  const shared = new Map()
  for (const guest of roster) {
    const phone = normalized.get(guest.id).phone
    if (phone) shared.set(phone, [...(shared.get(phone) ?? []), guest.name])
  }
  for (const [id, view] of views) {
    const guest = roster.find(guest => guest.id === id)
    const { phone, error } = normalized.get(id)
    view.phoneError.textContent = error
    view.phone.setAttribute('aria-invalid', String(Boolean(error)))
    const recipients = shared.get(phone) ?? []
    view.shared.textContent = recipients.length > 1
      ? `Shared number: ${recipients.join(', ')}. Check the recipient before sending this separate invitation.` : ''
    const disabled = Boolean(configurationError || error)
    view.send.setAttribute('aria-disabled', String(disabled))
    view.send.tabIndex = disabled ? -1 : 0
    if (disabled) view.send.removeAttribute('href')
    else view.send.href = whatsappUrl(phone, personalizedMessage(state.message, guest, state.siteUrl))
    view.copy.disabled = Boolean(configurationError)
    view.preview.textContent = configurationError || personalizedMessage(state.message, guest, state.siteUrl)
    view.card.classList.toggle('sent', Boolean(state.sent[id]))
    view.status.textContent = state.sent[id] ? 'Manually marked sent.'
      : state.opened[id] ? 'Chat opened. Not confirmed sent; mark it after pressing Send in WhatsApp.' : 'Not opened yet.'
  }
  const missing = [...normalized.values()].filter(result => !result.phone).length
  const sent = roster.filter(guest => state.sent[guest.id]).length
  document.getElementById('counts').textContent =
    `${roster.length} guests | ${roster.length - missing} valid numbers | ${missing} missing or invalid | ${sent} marked sent | ${views.size} shown`
}

function render() {
  views.clear()
  container.replaceChildren()
  const search = searchInput.value.trim().toLowerCase()
  for (const guest of roster) {
    if (!`${guest.name} ${guest.id} ${phoneFor(guest)}`.toLowerCase().includes(search)) continue
    if (filterInput.value === 'sent' && !state.sent[guest.id]) continue
    if (filterInput.value === 'unsent' && state.sent[guest.id]) continue
    if (filterInput.value === 'missing' && phoneStatus(guest).phone) continue
    const card = element('article', 'guest')
    card.dataset.guestId = guest.id
    const head = element('div', 'guest-head')
    const title = element('div')
    title.append(element('h3', '', guest.name), element('p', 'guest-id', `Invitation ID: ${guest.id}`))
    const sentLabel = element('label', 'mark-sent')
    const sent = element('input')
    sent.type = 'checkbox'
    sent.checked = Boolean(state.sent[guest.id])
    sent.setAttribute('aria-label', `Mark invitation sent for ${guest.name} (${guest.id})`)
    sent.addEventListener('change', () => {
      state.sent[guest.id] = sent.checked
      save()
      if (filterInput.value === 'sent' || filterInput.value === 'unsent') render()
      else refreshActions()
    })
    sentLabel.append(sent, document.createTextNode('I have sent this'))
    head.append(title, sentLabel)
    const label = element('label', '', 'WhatsApp phone number')
    const phone = element('input')
    phone.type = 'tel'
    phone.id = `phone-${guest.id}`
    phone.autocomplete = 'off'
    phone.placeholder = '03... or +country code...'
    phone.value = phoneFor(guest)
    label.htmlFor = phone.id
    const phoneError = element('p', 'phone-error')
    phoneError.id = `error-${guest.id}`
    phone.setAttribute('aria-describedby', `phone-help ${phoneError.id}`)
    phone.addEventListener('input', () => {
      state.phones[guest.id] = phone.value
      save()
      refreshActions()
    })
    const shared = element('p', 'warning')
    const actions = element('div', 'actions')
    const send = element('a', 'send', 'Send on WhatsApp')
    send.target = '_blank'
    send.rel = 'noopener noreferrer'
    send.referrerPolicy = 'no-referrer'
    send.setAttribute('aria-label', `Send on WhatsApp to ${guest.name} (${guest.id})`)
    send.addEventListener('click', event => {
      if (send.getAttribute('aria-disabled') === 'true') {
        event.preventDefault()
        return
      }
      if (state.sent[guest.id] && !confirm('This invitation is already marked sent. Open the chat again?')) {
        event.preventDefault()
        return
      }
      state.opened[guest.id] = new Date().toISOString()
      save()
      refreshActions()
    })
    const copy = element('button', '', 'Copy invitation link')
    copy.type = 'button'
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(invitationUrl(state.siteUrl, guest.id))
        document.getElementById('notice').textContent = `Copied the personal invitation link for ${guest.name}.`
      } catch (error) {
        showError(`Could not copy the invitation link: ${error.message}. The link is also in the message preview.`)
      }
    })
    actions.append(send, copy)
    const status = element('p', 'status')
    status.setAttribute('aria-live', 'polite')
    const details = element('details')
    const preview = element('pre')
    details.append(element('summary', '', 'Preview personalized message'), preview)
    card.append(head, element('p', 'events', guest.events.join(' | ')), label, phone, phoneError, shared, actions, status, details)
    views.set(guest.id, { card, phone, phoneError, shared, send, copy, preview, status })
    container.append(card)
  }
  document.getElementById('empty').hidden = views.size !== 0
  refreshActions()
}

async function init() {
  const response = await fetch(`${senderBase}api/guests`)
  if (response.status === 401) {
    location.replace('/whatsapp')
    return
  }
  if (!response.ok) {
    const type = response.headers.get('content-type') ?? ''
    const details = type.includes('application/json') ? await response.json() : null
    throw new Error(details?.error || `Guest list could not be loaded (HTTP ${response.status})`)
  }
  const data = await response.json()
  if (data.authenticated) {
    const logout = document.getElementById('logout')
    logout.hidden = false
    logout.addEventListener('click', async () => {
      logout.disabled = true
      try {
        const response = await fetch(`${senderBase}logout`, { method: 'POST' })
        if (!response.ok) throw new Error(`Sign-out failed (HTTP ${response.status}).`)
        container.replaceChildren()
        messageInput.value = ''
        roster = []
        views.clear()
        state = { siteUrl: defaultSiteUrl, message: '', phones: {}, sent: {}, opened: {} }
        localStorage.removeItem(storageKey)
        location.replace('/whatsapp')
      } catch (error) {
        showError(`Could not finish signing out: ${error.message}. Close this tab if you are on a shared device.`)
        logout.disabled = false
      }
    })
    window.addEventListener('pageshow', event => {
      if (event.persisted) location.reload()
    })
  }
  roster = data.guests
  if (!Array.isArray(roster) || !roster.length) throw new Error('No guests are configured.')
  state.message = data.defaultMessage
  try {
    restore()
  } catch (error) {
    showError(`Saved browser settings could not be restored: ${error.message} No saved values were applied; check the settings before sending.`)
  }
  if (!state.siteUrl.trim() || state.siteUrl.trim().replace(/\/+$/, '') === 'https://nabeel-wedding.netlify.app') {
    state.siteUrl = defaultSiteUrl
  }
  siteInput.value = state.siteUrl
  messageInput.value = state.message
  for (const input of [siteInput, messageInput]) {
    input.addEventListener('input', () => {
      state.siteUrl = siteInput.value
      state.message = messageInput.value
      save()
      refreshActions()
    })
  }
  searchInput.addEventListener('input', render)
  filterInput.addEventListener('change', render)
  document.getElementById('notice').textContent = data.contactsWarning || (data.contactsFileFound
    ? 'Private contacts loaded. Check phone numbers and the website URL before sending.'
    : 'No private contacts file found. Enter phone numbers below; edits stay in this browser only.')
  const help = element('p', 'hint', 'Pakistan numbers starting 03 are converted to country code 92. For other countries, include the country code.')
  help.id = 'phone-help'
  document.getElementById('guests-heading').after(help)
  render()
}

init().catch(error => {
  document.getElementById('notice').textContent = 'Sending page is unavailable.'
  showError(`Unable to start the sending page: ${error.message}. Reload or ask the site owner to check the server configuration.`)
})
