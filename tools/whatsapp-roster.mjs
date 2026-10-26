import { guests, getGuestEvents, weddingConfig } from '../src/config.js'
import { normalizePhone } from './whatsapp-links.mjs'

export function parseContacts(text) {
  let contacts
  try {
    contacts = JSON.parse(text)
  } catch {
    throw new Error('The private contacts file is not valid JSON. Correct the private contacts configuration and restart.')
  }
  if (!contacts || typeof contacts !== 'object' || Array.isArray(contacts)) {
    throw new Error('The private contacts file must be an object mapping invitation IDs to phone numbers.')
  }
  for (const [id, phone] of Object.entries(contacts)) {
    if (!Object.hasOwn(guests, id)) throw new Error(`Unknown invitation ID in private contacts: ${id}`)
    try {
      normalizePhone(phone)
    } catch (error) {
      throw new Error(`Invalid phone for invitation ${id}: ${error.message}`)
    }
  }
  return contacts
}

export function senderPayload(contacts, contactsFileFound) {
  return {
    guests: Object.entries(guests).map(([id, guest]) => ({
      id,
      name: guest.name,
      phone: contacts[id] ?? '',
      events: getGuestEvents(guest).map(event => event.invitationSize ? `${event.title}: ${event.invitationSize}` : event.title),
    })).sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id)),
    contactsFileFound,
    defaultMessage: `Assalamualaikum {name}!\n\nYou are warmly invited to celebrate the wedding of ${weddingConfig.groom} and ${weddingConfig.bride}.\n\nYour personal invitation:\n{link}\n\nWe look forward to celebrating with you!`,
  }
}
