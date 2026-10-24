import test from 'node:test'
import assert from 'node:assert/strict'
import { getGuest, getGuestEvents, mapUrl, weddingConfig } from '../src/config.js'

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
  assert.deepEqual(getGuestEvents(getGuest('guest-002')).map(event => event.id), ['walima'])
})
test('Barat-only guest does not receive other events', () => {
  assert.deepEqual(getGuestEvents(getGuest('guest-004')).map(event => event.id), ['barat'])
})
test('celebrations take place on the confirmed November dates', () => {
  assert.equal(weddingConfig.events.mehandi.date, '2026-11-13T19:00:00+05:00')
  assert.equal(weddingConfig.events.barat.date, '2026-11-14T17:00:00+05:00')
  assert.equal(weddingConfig.events.walima.date, '2026-11-15T19:00:00+05:00')
})
test('Barat schedule includes Sehra Bandi and departure with countdown at Sehra Bandi', () => {
  const [barat] = getGuestEvents(getGuest('guest-004'))
  assert.equal(barat.time, 'Sehra Bandi: 5:00 PM; Barat departure: 6:00 PM')
  assert.equal(barat.date, '2026-11-14T17:00:00+05:00')
})
test('two-event guest receives only Barat and Walima', () => {
  assert.deepEqual(getGuestEvents(getGuest('guest-003')).map(event => event.id), ['barat', 'walima'])
})
test('unrecognized IDs including inherited object keys are rejected', () => {
  for (const id of ['unknown', 'toString', '__proto__', 'constructor']) assert.equal(getGuest(id), null)
})
test('readable guest alias resolves to the correct canonical ID', () => {
  assert.equal(getGuest('muhammad-arslan').id, 'guest-001')
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
