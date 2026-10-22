
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

const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname

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

    const content = await readFile(
      join(process.cwd(), 'public', filename)
    )

    res.writeHead(200, {
      'Content-Type': contentTypes[extname(filename)]
    })

    res.end(content)
  } catch (error) {
    console.error(error)
    res.writeHead(500)
    res.end('Internal server error')
  }
})

server.listen(PORT, () => {
  console.log(`Cinema app running at http://localhost:${PORT}`)
})
