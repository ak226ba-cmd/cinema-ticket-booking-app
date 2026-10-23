
const movieSelect = document.getElementById('movie')
const customerInput = document.getElementById('customer')
const ageInput = document.getElementById('age')
const seatSelect = document.getElementById('seat')
const cartItems = document.getElementById('cart-items')
const totalElement = document.getElementById('total')
const messageElement = document.getElementById('message')

const addButton = document.getElementById('add-ticket')
const checkoutButton = document.getElementById('checkout')

let cart = []

function showMessage(message) {
  messageElement.textContent = message
}

function calculatePrice(age) {
  if (age < 12) {
    return 60
  }

  if (age >= 65) {
    return 84
  }

  return 120
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.textContent = 'Your cart is empty.'
    totalElement.textContent = '0 SEK'
    return
  }

  cartItems.innerHTML = ''

  for (const ticket of cart) {
    const item = document.createElement('p')
    item.textContent = `${ticket.movie} - ${ticket.seat}: ${ticket.price} SEK`
    cartItems.appendChild(item)
  }

  const total = cart.reduce((sum, ticket) => sum + ticket.price, 0)
  totalElement.textContent = `${total} SEK`
}

addButton.addEventListener('click', () => {
  const movie = movieSelect.value
  const customer = customerInput.value.trim()
  const age = Number(ageInput.value)
  const seat = seatSelect.value

  if (
    !customer ||
    !ageInput.value ||
    !Number.isInteger(age) ||
    age < 1 ||
    age > 120
  ) {
    showMessage('Please enter a valid name and age.')
    return
  }

  if (cart.some(ticket => ticket.movie === movie && ticket.seat === seat)) {
    showMessage('This seat is already in your cart.')
    return
  }

  const price = calculatePrice(age)

  cart.push({ movie, customer, age, seat, price })

  renderCart()
  showMessage('Ticket added to cart.')
})

checkoutButton.addEventListener('click', async () => {
  if (cart.length === 0) {
    showMessage('Your cart is empty.')
    return
  }

  checkoutButton.disabled = true
  showMessage('Confirming your booking...')

  const confirmed = []
  const failed = []

  try {
    for (const ticket of cart) {
      try {
        const response = await fetch('/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            movie: ticket.movie,
            customer: ticket.customer,
            age: ticket.age,
            seat: ticket.seat
          })
        })

        const result = await response.json()

        if (!response.ok) {
          failed.push({
            ticket,
            error: result.error || 'Booking failed'
          })
          continue
        }

        confirmed.push(result)
      } catch {
        failed.push({
          ticket,
          error: 'Could not connect to the server'
        })
      }
    }

    cart = failed.map(item => item.ticket)
    renderCart()

    if (confirmed.length > 0 && failed.length === 0) {
      const total = confirmed.reduce((sum, booking) => sum + booking.total, 0)
      showMessage(`Booking confirmed! Total: ${total} SEK`)
    } else if (confirmed.length > 0) {
      showMessage(
        `${confirmed.length} booking(s) confirmed. ` +
        `${failed.length} failed: ${failed.map(item => item.error).join(', ')}`
      )
    } else {
      showMessage(
        `Booking failed: ${failed.map(item => item.error).join(', ')}`
      )
    }
  } finally {
    checkoutButton.disabled = false
  }
})

renderCart()
