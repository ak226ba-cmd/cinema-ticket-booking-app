import {
  Screening,
  Booking,
  PriceCalculator
} from 'cinema-booking-library'

import { ShoppingCart } from '1dv610-laboration-2'

// Create a screening and a shopping cart
const screening = new Screening('Interstellar', '18:00', 3, 5)
const cart = new ShoppingCart()
const priceCalculator = new PriceCalculator()

// Customer information
const customerName = 'Ahmed'
const customerAge = 25

// Choose a seat
const seat = screening.getSeat('A', 1)

if (!seat || !seat.isAvailable()) {
  console.log('Seat is not available')
} else {
  // Calculate the ticket price
  const price = priceCalculator.calculatePrice(
    120,
    customerAge,
    'standard'
  )
}
