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
      date: '2026-12-04T19:00:00+05:00',
      time: '7:00 PM onwards',
      venue: 'Paragon City Lahore',
      address: 'Paragon City, Lahore, Pakistan',
      dress: 'Festive hues & traditional attire',
      label: 'THE COLOUR OF CELEBRATION',
    },
    barat: {
      id: 'barat',
      title: 'Barat',
      urdu: 'بارات',
      subtitle: 'The beginning of forever.',
      description: 'With hearts full of love, we gather to witness a beautiful new chapter, surrounded by our favourite people.',
      date: '2026-12-05T19:30:00+05:00',
      time: '7:30 PM onwards',
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
      date: '2026-12-06T19:00:00+05:00',
      time: '7:00 PM onwards',
      venue: 'Marabele Hall',
      address: 'Garrison, Lahore, Pakistan',
      dress: 'Formal & timeless',
      label: 'AN EVENING OF GRATITUDE',
    },
  },
}

export const guests = {
  'guest-001': {
    name: 'Muhammad Arslan',
    events: ['mehandi', 'barat', 'walima'],
    message: 'From shared memories to new beginnings, this celebration would not be complete without you.',
  },
  'guest-002': {
    name: 'Ahmed Khan',
    events: ['walima'],
    message: 'It would mean the world to us to share this special evening with you and your family.',
  },
  'guest-003': {
    name: 'Ayesha & Family',
    events: ['barat', 'walima'],
    message: 'Some moments are made more beautiful by the people we share them with. We cannot wait to celebrate with you.',
  },
}

export function getGuest(id) {
  const key = id === 'muhammad-arslan' ? 'guest-001' : id
  return Object.hasOwn(guests, key) ? { ...guests[key], id: key } : null
}

export function getGuestEvents(guest) {
  return guest.events.map(id => weddingConfig.events[id]).filter(Boolean)
}

export function mapUrl(event) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.address}`)}`
}
