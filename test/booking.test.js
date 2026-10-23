
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  Screening,
  Booking,
  PriceCalculator
} from 'cinema-booking-library'

import { ShoppingCart } from '1dv610-laboration-2'

test('A screening creates seats', () => {
  const screening = new Screening('Interstellar', '18:00', 3, 5)

  assert.equal(screening.seats.length, 15)
})

test('A seat can be booked', () => {
  const screening = new Screening('Interstellar', '18:00', 3, 5)
  const seat = screening.getSeat('A', 1)
  const booking = new Booking('Ahmed', screening, seat)

  assert.equal(booking.confirm(), true)
  assert.equal(seat.isAvailable(), false)
})

test('A booked seat cannot be booked twice', () => {
  const screening = new Screening('Interstellar', '18:00', 3, 5)
  const seat = screening.getSeat('A', 1)

  const firstBooking = new Booking('Ahmed', screening, seat)
  const secondBooking = new Booking('Ali', screening, seat)

  assert.equal(firstBooking.confirm(), true)
  assert.equal(secondBooking.confirm(), false)
})
