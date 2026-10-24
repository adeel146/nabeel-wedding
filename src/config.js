export const weddingConfig = {
  groom: 'Nabeel Akram',
  bride: 'Zainab',
  family: 'The Akram Family',
  events: {
    mehandi: {
      id: 'mehandi',
      title: 'Mehandi',
      urdu: 'مہندی',
      subtitle: 'A little colour. A lot of joy.',
      description: 'An evening of henna, laughter, and melodies under the stars. Let the celebrations begin.',
      date: '2026-11-13T19:00:00+05:00',
      time: '6:00 PM - 10:00 PM',
      venue: 'Paragon City Lahore',
      address: 'House No 361 Street # 11, Imperial Garden Paragon City Lahore',
      dress: 'Festive hues & traditional attire',
      label: 'THE COLOUR OF CELEBRATION',
    },
    barat: {
      id: 'barat',
      title: 'Barat',
      urdu: 'بارات',
      subtitle: 'The beginning of forever.',
      description: 'With hearts full of love, we gather to witness a beautiful new chapter, surrounded by our favourite people.',
      date: '2026-11-14T17:00:00+05:00',
      time: 'Sehra Bandi: 5:00 PM; Barat departure: 6:00 PM',
      venue: 'House # 428, Imperial Garden',
      address: 'House # 428, Imperial Garden, Paragon City, Lahore, Pakistan',
      dress: 'Traditional elegance',
      label: 'A ROYAL CELEBRATION',
    },
    walima: {
      id: 'walima',
      title: 'Walima',
      urdu: 'ولیمہ',
      subtitle: 'Love, laughter & happily ever after.',
      description: 'Join us for a beautiful evening of togetherness as we celebrate a lifetime of love and new beginnings.',
      date: '2026-11-15T19:00:00+05:00',
      time: '6:00 PM - 10:00 PM',
      venue: 'Marabelle by Zafar Group',
      address: 'Hall Number 3, Garrison Golf & Country Club, near the Army Museum, Lahore Cantt',
      mapLink: 'https://maps.app.goo.gl/g8eirmLg1vf3ecKm8',
      dress: 'Formal & timeless',
      label: 'AN EVENING OF GRATITUDE',
    },
  },
}

/**
 * @typedef {keyof typeof weddingConfig.events} EventId
 * @typedef {{ name: string, events: EventId[], message: string, partySize?: Partial<Record<EventId, number | 'family'>> }} GuestConfig
 */

/** @type {Record<string, GuestConfig>} */
export const guests = {
  'temp-muhammad-arslan': {
    name: 'Muhammad Arslan',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'From shared memories to new beginnings, this celebration would not be complete without you.',
  },
  'temp-muhammad-ashfaq': {
    name: 'Muhammad Ashfaq',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '2909': {
    name: 'Muhammad Sarfraz',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '7400': {
    name: 'Sumbal',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '2915': {
    name: 'Samina',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '4250': {
    name: 'Hafiz Naveed',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '4226': {
    name: 'Muhammad Shafique',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-muhammad-idrees': {
    name: 'Muhammad Idrees',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '3313': {
    name: 'Kiran',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '1601': {
    name: 'Ghulam Haider',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '3113': {
    name: 'Muhammad Majeed',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '1275': {
    name: 'Muhammad Javaid',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '8499': {
    name: 'Muhammad Parvaiz',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '1040': {
    name: 'Muhammad Yaseen',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-rabia-basri': {
    name: 'Rabia Basri',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-haji-younas': {
    name: 'Haji Younas',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-muhammad-javaid-younas': {
    name: 'Muhammad Javaid Younas',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '9664': {
    name: 'Muhammad Shahid Younas',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '2663': {
    name: 'Zafar Iqbal Younas',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '6871': {
    name: 'Fozia',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-muqaddas-bibi': {
    name: 'Muqaddas Bibi',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-hassan-javaid': {
    name: 'Hassan Javaid',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '2254': {
    name: 'Naveed Javaid',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '2215': {
    name: 'Ali Javaid',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '7517': {
    name: 'Abdul Rauf',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '2192': {
    name: 'Iftikhar',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '3572': {
    name: 'Amjad Ali',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-riffat': {
    name: 'Riffat',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-khurshid': {
    name: 'Khurshid',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '3232': {
    name: 'Bashir',
    events: ['barat', 'walima'],
    partySize: { barat: 1, walima: 1 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '8870': {
    name: 'Haji Shaqeel',
    events: ['barat', 'walima'],
    partySize: { barat: 1, walima: 1 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '4109': {
    name: 'Manzoor Ahmed',
    events: ['barat', 'walima'],
    partySize: { barat: 1, walima: 1 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '6683': {
    name: 'Muhammad Yousaf',
    events: ['barat', 'walima'],
    partySize: { barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '6152': {
    name: 'Arif',
    events: ['barat', 'walima'],
    partySize: { barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '2682': {
    name: 'Ameen',
    events: ['barat', 'walima'],
    partySize: { barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '9254': {
    name: 'Sharafat',
    events: ['barat', 'walima'],
    partySize: { barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '7814': {
    name: 'Rahman Ali',
    events: ['barat', 'walima'],
    partySize: { barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '7025': {
    name: 'Zulifqar Ali',
    events: ['barat', 'walima'],
    partySize: { barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '4407': {
    name: 'Khaliq',
    events: ['barat', 'walima'],
    partySize: { barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '6664': {
    name: 'Muhammad shafique',
    events: ['barat', 'walima'],
    partySize: { barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-bushra': {
    name: 'Bushra',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-tallat': {
    name: 'Tallat',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-sakina': {
    name: 'Sakina',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-samina': {
    name: 'Samina',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-rahat': {
    name: 'Rahat',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-shafqat': {
    name: 'Shafqat',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-liaqat-ali': {
    name: 'Liaqat Ali',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-mehmood-ahmed': {
    name: 'Mehmood Ahmed',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-nagina': {
    name: 'Nagina',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-abdul-shakoor': {
    name: 'Abdul Shakoor',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-ali-raza': {
    name: 'Ali Raza',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-fayaz': {
    name: 'Fayaz',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-ijaz': {
    name: 'Ijaz',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 2, barat: 2, walima: 2 },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '5697': {
    name: 'Lyba Riaz',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '7159': {
    name: 'Muhammad Uzair naeem',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '1686': {
    name: 'Syed Wasay Kashif',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '8389': {
    name: 'Muhammad Arslan Battery',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '9561': {
    name: 'Palwasha Asim Sethi',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 2, walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  '3336': {
    name: 'Hafiz Umer Farooq',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 2, walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
  'temp-rauf': {
    name: 'Rauf',
    events: ['mehandi', 'barat', 'walima'],
    partySize: { mehandi: 'family', barat: 'family', walima: 'family' },
    message: 'We look forward to celebrating these special moments with you.',
  },
}

export function getGuest(id) {
  const key = id === 'guest-001' || id === 'muhammad-arslan' ? 'temp-muhammad-arslan' : id
  return Object.hasOwn(guests, key) ? { ...guests[key], id: key } : null
}

/** @param {number | 'family' | undefined} size */
export function formatPartySize(size) {
  if (size === undefined) return null
  if (size === 'family') return 'With family'
  if (!Number.isSafeInteger(size) || size < 1) {
    throw new RangeError('Invitation size must be "family" or a positive whole number.')
  }
  return `${size} ${size === 1 ? 'person' : 'persons'}`
}

/** @param {GuestConfig} guest */
export function getGuestEvents(guest) {
  return guest.events.map(id => {
    const event = weddingConfig.events[id]
    return event && { ...event, invitationSize: formatPartySize(guest.partySize?.[id]) }
  }).filter(Boolean)
}

export function mapUrl(event) {
  return event.mapLink ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.address}`)}`
}
