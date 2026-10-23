
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

test('Adult ticket costs 120 SEK', () => {
  const calculator = new PriceCalculator()

  assert.equal(calculator.calculatePrice(120, 25, 'standard'), 120)
})

test('Child ticket costs 60 SEK', () => {
  const calculator = new PriceCalculator()

  assert.equal(calculator.calculatePrice(120, 10, 'standard'), 60)
})

test('Senior ticket costs 84 SEK', () => {
  const calculator = new PriceCalculator()

  assert.equal(calculator.calculatePrice(120, 70, 'standard'), 84)
})

test('A ticket can be added to the shopping cart', () => {
  const cart = new ShoppingCart()

  assert.equal(cart.addItem('Interstellar - A1', 120, 1), true)
  assert.equal(cart.getTotalPrice(), 120)
})

test('Shopping cart calculates multiple tickets', () => {
  const cart = new ShoppingCart()

  cart.addItem('Interstellar - A1', 120, 1)
  cart.addItem('Inception - B2', 60, 1)

  assert.equal(cart.getTotalPrice(), 180)
})
