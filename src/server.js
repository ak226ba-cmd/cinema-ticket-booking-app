
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

import {
  Screening,
  Booking,
  PriceCalculator
} from 'cinema-booking-library'

import { ShoppingCart } from '1dv610-laboration-2'

const PORT = process.env.PORT || 3000

const screenings = new Map([
  ['Interstellar', new Screening('Interstellar', '18:00', 3, 5)],
  ['Inception', new Screening('Inception', '19:00', 3, 5)],
  ['The Dark Knight', new Screening('The Dark Knight', '20:00', 3, 5)]
])

const calculator = new PriceCalculator()

const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript'
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(data))
}

async function readJson(req) {
  let body = ''

  for await (const chunk of req) {
    body += chunk
    if (body.length > 10000) {
      throw new Error('Request too large')
    }
  }

  return JSON.parse(body)
}

async function confirmBooking(req, res) {
  let data

  try {
    data = await readJson(req)
  } catch {
    sendJson(res, 400, { error: 'Invalid request body' })
    return
  }

  const { movie, customer, age, seat: seatLabel } = data

  if (
    typeof movie !== 'string' ||
    typeof customer !== 'string' ||
    !customer.trim() ||
    !Number.isInteger(age) ||
    age < 1 ||
    age > 120 ||
    typeof seatLabel !== 'string'
  ) {
    sendJson(res, 400, { error: 'Invalid booking information' })
    return
  }

  const screening = screenings.get(movie)

  if (!screening) {
    sendJson(res, 404, { error: 'Movie not found' })
    return
  }

  const match = /^([A-C])([1-5])$/.exec(seatLabel)

  if (!match) {
    sendJson(res, 400, { error: 'Invalid seat' })
    return
  }

  const seat = screening.getSeat(match[1], Number(match[2]))

  if (!seat || !seat.isAvailable()) {
    sendJson(res, 409, { error: 'Seat is already booked' })
    return
  }

  const price = calculator.calculatePrice(120, age, seat.type)

  // Use the second student's module to calculate the cart total.
  const cart = new ShoppingCart()
  const ticketName = `${movie} - ${seatLabel}`

  if (!cart.addItem(ticketName, price, 1)) {
    sendJson(res, 400, { error: 'Could not add ticket' })
    return
  }

  const booking = new Booking(customer.trim(), screening, seat)

  if (!booking.confirm()) {
    sendJson(res, 409, { error: 'Booking failed' })
    return
  }

  sendJson(res, 201, {
    message: 'Booking confirmed',
    summary: booking.getSummary(),
    total: cart.getTotalPrice()
  })
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname

    if (pathname === '/api/book' && req.method === 'POST') {
      await confirmBooking(req, res)
      return
    }

    const files = {
      '/': 'index.html',
      '/style.css': 'style.css',
      '/script.js': 'script.js'
    }

    const filename = files[pathname]

    if (!filename || req.method !== 'GET') {
      res.writeHead(404)
      res.end('Page not found')
      return
    }

    const content = await readFile(join(process.cwd(), 'public', filename))

    res.writeHead(200, {
      'Content-Type': contentTypes[extname(filename)]
    })

    res.end(content)
  } catch (error) {
    console.error(error)
    sendJson(res, 500, { error: 'Internal server error' })
  }
})

server.listen(PORT, () => {
  console.log(`Cinema app running at http://localhost:${PORT}`)
})
