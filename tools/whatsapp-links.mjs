export function normalizePhone(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Enter a phone number before sending.')
  }
  if (!/^[+\d\s().-]+$/.test(value)) {
    throw new Error('Use digits and an optional international + prefix.')
  }
  let phone = value.replace(/[\s().-]/g, '')
  if (/^03\d{9}$/.test(phone)) phone = `92${phone.slice(1)}`
  else if (phone.startsWith('+')) phone = phone.slice(1)
  else if (phone.startsWith('00')) phone = phone.slice(2)
  if (!/^[1-9]\d{7,14}$/.test(phone)) {
    throw new Error('Use a full Pakistan mobile number (03...) or an international number with country code.')
  }
  return phone
}

export function normalizeSiteUrl(value) {
  let url
  try {
    url = new URL(value.trim())
  } catch {
    throw new Error('Enter your published website URL, starting with https://.')
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('The invitation website must use http:// or https://.')
  }
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('Use the website home URL, without an invitation path, login, query, or fragment.')
  }
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    throw new Error('Use the published website, not localhost: guests cannot open your local preview.')
  }
  return url.origin
}

export function invitationUrl(siteUrl, id) {
  if (typeof id !== 'string' || !id) throw new Error('The guest invitation ID is missing.')
  return `${normalizeSiteUrl(siteUrl)}/invite/${encodeURIComponent(id)}`
}

export function personalizedMessage(template, guest, siteUrl) {
  if (typeof template !== 'string' || !template.includes('{name}') || !template.includes('{link}')) {
    throw new Error('The message must include both {name} and {link}.')
  }
  const link = invitationUrl(siteUrl, guest.id)
  return template.replace(/\{(name|link)\}/g, (_, field) => field === 'name' ? guest.name : link).trim()
}

export function whatsappUrl(phone, message) {
  const url = new URL(`https://wa.me/${normalizePhone(phone)}`)
  if (typeof message !== 'string' || !message.trim()) throw new Error('The message cannot be empty.')
  url.searchParams.set('text', message)
  return url.href
}
