import test from 'node:test'
import assert from 'node:assert/strict'
import { formatPartySize, getGuest, getGuestEvents, guests, mapUrl, weddingConfig } from '../src/config.js'

const baratOnlyGuest = {
  name: 'Test Guest',
  events: ['barat'],
  partySize: { barat: 2 },
  message: 'Test invitation.',
}

test('couple and venues match the wedding details', () => {
  assert.equal(weddingConfig.groom, 'Nabeel Akram')
  assert.equal(weddingConfig.bride, 'Zainab')
  assert.equal(weddingConfig.events.mehandi.venue, 'Paragon City Lahore')
  assert.equal(weddingConfig.events.barat.address, 'House # 428, Imperial Garden, Paragon City, Lahore, Pakistan')
  assert.equal(weddingConfig.events.walima.venue, 'Marabele Hall')
  assert.equal(weddingConfig.events.walima.address, 'Garrison, Lahore, Pakistan')
})

test('all-event guest receives exactly three chronological events', () => {
  const events = getGuestEvents(getGuest('guest-001'))
  assert.deepEqual(events.map(event => event.id), ['mehandi', 'barat', 'walima'])
  assert.ok(events.every((event, i) => !i || new Date(event.date) > new Date(events[i - 1].date)))
})
test('Walima-only guest does not receive other events', () => {
  assert.deepEqual(getGuestEvents({ ...baratOnlyGuest, events: ['walima'], partySize: { walima: 'family' } })
    .map(event => event.id), ['walima'])
})
test('Barat-only guest does not receive other events', () => {
  assert.deepEqual(getGuestEvents(baratOnlyGuest).map(event => event.id), ['barat'])
})
test('celebrations take place on the confirmed November dates', () => {
  assert.equal(weddingConfig.events.mehandi.date, '2026-11-13T19:00:00+05:00')
  assert.equal(weddingConfig.events.barat.date, '2026-11-14T17:00:00+05:00')
  assert.equal(weddingConfig.events.walima.date, '2026-11-15T19:00:00+05:00')
})
test('Barat schedule includes Sehra Bandi and departure with countdown at Sehra Bandi', () => {
  const [barat] = getGuestEvents(baratOnlyGuest)
  assert.equal(barat.time, 'Sehra Bandi: 5:00 PM; Barat departure: 6:00 PM')
  assert.equal(barat.date, '2026-11-14T17:00:00+05:00')
})
test('two-event guest receives only Barat and Walima', () => {
  assert.deepEqual(getGuestEvents(getGuest('3232')).map(event => event.id), ['barat', 'walima'])
})
test('missing and unrecognized IDs including inherited object keys are rejected', () => {
  for (const id of [undefined, null, '', ' ', 'unknown', 'toString', '__proto__', 'constructor']) assert.equal(getGuest(id), null)
})
test('readable guest alias resolves to the correct canonical ID', () => {
  for (const id of ['guest-001', 'muhammad-arslan', 'temp-muhammad-arslan']) {
    assert.equal(getGuest(id).id, 'temp-muhammad-arslan')
    assert.equal(getGuest(id).name, 'Muhammad Arslan')
  }
})
test('every venue has a safe correctly encoded Maps link and timezone-aware date', () => {
  for (const event of Object.values(weddingConfig.events)) {
    const url = new URL(mapUrl(event))
    if (event.id === 'walima') {
      assert.equal(url.href, 'https://maps.app.goo.gl/g8eirmLg1vf3ecKm8')
    } else {
      assert.equal(url.origin, 'https://www.google.com')
      assert.equal(url.searchParams.get('query'), `${event.venue}, ${event.address}`)
    }
    assert.ok(event.date.endsWith('+05:00'))
    assert.ok(Number.isFinite(new Date(event.date).getTime()))
  }
})

test('each event can have a different invitation size for the same guest', () => {
  const events = getGuestEvents(getGuest('9561'))
  assert.deepEqual(events.map(event => [event.id, event.invitationSize]), [
    ['mehandi', 'With family'],
    ['barat', '2 persons'],
    ['walima', 'With family'],
  ])
})

test('invitation size follows event assignments and is optional for existing guests', () => {
  const guest = baratOnlyGuest
  assert.deepEqual(getGuestEvents(guest).map(event => event.invitationSize), ['2 persons'])
  assert.deepEqual(getGuestEvents({ ...guest, partySize: undefined }).map(event => event.invitationSize), [null])
  assert.deepEqual(getGuestEvents({ ...guest, partySize: { barat: 1, walima: 'family' } })
    .map(event => [event.id, event.invitationSize]), [['barat', '1 person']])
})

test('guest-specific sizes do not mutate shared events or another invitation', () => {
  const guest = baratOnlyGuest
  assert.equal(getGuestEvents({ ...guest, partySize: { barat: 3 } })[0].invitationSize, '3 persons')
  assert.equal(getGuestEvents(guest)[0].invitationSize, '2 persons')
  assert.equal(Object.hasOwn(weddingConfig.events.barat, 'invitationSize'), false)
})

test('invitation size accepts positive whole counts or family and rejects invalid values', () => {
  assert.equal(formatPartySize(1), '1 person')
  assert.equal(formatPartySize(2), '2 persons')
  assert.equal(formatPartySize('family'), 'With family')
  assert.equal(formatPartySize(undefined), null)
  for (const size of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, '', '2', 'friends', null]) {
    assert.throws(() => formatPartySize(size), RangeError)
  }
})

const familyGuests = [
  ['temp-muhammad-arslan', 'Muhammad Arslan'],
  ['temp-muhammad-ashfaq', 'Muhammad Ashfaq'],
  ['2909', 'Muhammad Sarfraz'],
  ['7400', 'Sumbal'],
  ['2915', 'Samina'],
  ['4250', 'Hafiz Naveed'],
  ['4226', 'Muhammad Shafique'],
  ['temp-muhammad-idrees', 'Muhammad Idrees'],
  ['3313', 'Kiran'],
  ['1601', 'Ghulam Haider'],
  ['3113', 'Muhammad Majeed'],
  ['1275', 'Muhammad Javaid'],
  ['8499', 'Muhammad Parvaiz'],
  ['1040', 'Muhammad Yaseen'],
  ['temp-rabia-basri', 'Rabia Basri'],
  ['temp-haji-younas', 'Haji Younas'],
  ['temp-muhammad-javaid-younas', 'Muhammad Javaid Younas'],
  ['9664', 'Muhammad Shahid Younas'],
  ['2663', 'Zafar Iqbal Younas'],
  ['6871', 'Fozia'],
  ['temp-muqaddas-bibi', 'Muqaddas Bibi'],
  ['temp-hassan-javaid', 'Hassan Javaid'],
  ['2254', 'Naveed Javaid'],
  ['2215', 'Ali Javaid'],
  ['7517', 'Abdul Rauf'],
  ['2192', 'Iftikhar'],
  ['3572', 'Amjad Ali'],
  ['temp-riffat', 'Riffat'],
  ['temp-khurshid', 'Khurshid'],
  ['temp-ali-raza', 'Ali Raza'],
  ['5697', 'Lyba Riaz'],
  ['7159', 'Muhammad Uzair naeem'],
  ['1686', 'Syed Wasay Kashif'],
  ['8389', 'Muhammad Arslan Battery'],
  ['temp-rauf', 'Rauf'],
]
const twoPersonGuests = [
  ['temp-bushra', 'Bushra'],
  ['temp-tallat', 'Tallat'],
  ['temp-sakina', 'Sakina'],
  ['temp-samina', 'Samina'],
  ['temp-rahat', 'Rahat'],
  ['temp-shafqat', 'Shafqat'],
  ['temp-liaqat-ali', 'Liaqat Ali'],
  ['temp-mehmood-ahmed', 'Mehmood Ahmed'],
  ['temp-nagina', 'Nagina'],
  ['temp-abdul-shakoor', 'Abdul Shakoor'],
  ['temp-fayaz', 'Fayaz'],
  ['temp-ijaz', 'Ijaz'],
]
const onePersonWithoutMehandi = [
  ['3232', 'Bashir'],
  ['8870', 'Haji Shaqeel'],
  ['4109', 'Manzoor Ahmed'],
]
const twoPersonsWithoutMehandi = [
  ['6683', 'Muhammad Yousaf'],
  ['6152', 'Arif'],
  ['2682', 'Ameen'],
  ['9254', 'Sharafat'],
  ['7814', 'Rahman Ali'],
  ['7025', 'Zulifqar Ali'],
  ['4407', 'Khaliq'],
  ['6664', 'Muhammad shafique'],
]
const mixedFamilyGuests = [
  ['9561', 'Palwasha Asim Sethi'],
  ['3336', 'Hafiz Umer Farooq'],
]
const expectedRoster = [
  ...familyGuests.map(([id, name]) => ({ id, name, sizes: ['family', 'family', 'family'] })),
  ...twoPersonGuests.map(([id, name]) => ({ id, name, sizes: [2, 2, 2] })),
  ...onePersonWithoutMehandi.map(([id, name]) => ({ id, name, sizes: [null, 1, 1] })),
  ...twoPersonsWithoutMehandi.map(([id, name]) => ({ id, name, sizes: [null, 2, 2] })),
  ...mixedFamilyGuests.map(([id, name]) => ({ id, name, sizes: ['family', 2, 'family'] })),
]

test('all 60 supplied members have their exact name, unique ID, assigned events, and party sizes', () => {
  assert.equal(expectedRoster.length, 60)
  assert.deepEqual(Object.keys(guests).sort(), expectedRoster.map(guest => guest.id).sort())
  for (const { id, name, sizes } of expectedRoster) {
    const guest = getGuest(id)
    assert.equal(guest.name, name, id)
    const assigned = ['mehandi', 'barat', 'walima']
      .flatMap((event, i) => sizes[i] === null ? [] : [[event, sizes[i]]])
    assert.deepEqual(guest.events, assigned.map(([event]) => event), id)
    assert.deepEqual(guest.partySize, Object.fromEntries(assigned), id)
    assert.deepEqual(getGuestEvents(guest).map(event => [event.id, event.invitationSize]),
      assigned.map(([event, size]) => [event, formatPartySize(size)]), id)
  }
})

test('unique phone endings use four digits while missing and shared endings use temporary IDs', () => {
  const ids = Object.keys(guests)
  assert.equal(ids.filter(id => /^\d{4}$/.test(id)).length, 36)
  assert.equal(ids.filter(id => /^temp-[a-z]+(?:-[a-z]+)*$/.test(id)).length, 24)
  for (const unresolved of ['8135', '2256', '1325']) assert.equal(getGuest(unresolved), null)
  assert.equal(getGuest('2915').name, 'Samina')
  assert.equal(getGuest('temp-samina').name, 'Samina')
  assert.notEqual(getGuest('2915').id, getGuest('temp-samina').id)
})

test('guest configuration stores no full phone numbers', () => {
  assert.doesNotMatch(JSON.stringify(guests), /\b03\d{9}\b/)
  for (const guest of Object.values(guests)) assert.equal(Object.hasOwn(guest, 'phone'), false)
})
