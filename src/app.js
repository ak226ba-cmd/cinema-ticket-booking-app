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

    // Add ticket to shopping cart
  const ticketName = `${screening.movieTitle} - ${seat.getSeatLabel()}`
  const added = cart.addItem(ticketName, price, 1)

  if (!added) {
    console.log('Could not add ticket to cart')
  } else {
    console.log('Ticket added to cart:', ticketName)
    console.log('Total price:', cart.getTotalPrice(), 'SEK')

    // Confirm the booking
    const booking = new Booking(customerName, screening, seat)

    if (booking.confirm()) {
      console.log('Booking confirmed!')
      console.log(booking.getSummary())
    } else {
      console.log('Booking could not be confirmed')
    }
  }
}
