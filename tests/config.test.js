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
    assert.equal(url.origin, 'https://www.google.com')
    assert.equal(url.searchParams.get('query'), `${event.venue}, ${event.address}`)
    assert.ok(event.date.endsWith('+05:00'))
    assert.ok(Number.isFinite(new Date(event.date).getTime()))
  }
})
