
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

  if (!customer || !ageInput.value || !Number.isInteger(age) || age < 1) {
    showMessage('Please enter a valid name and age.')
    return
  }

  if (cart.some(ticket => ticket.movie === movie && ticket.seat === seat)) {
    showMessage('This seat is already in your cart.')
    return
  }

  cart.push({ movie, customer, age, seat, price: 120 })
  renderCart()
  showMessage('Ticket added to cart.')
})

checkoutButton.addEventListener('click', () => {
  if (cart.length === 0) {
    showMessage('Your cart is empty.')
    return
  }

  showMessage('Checkout is not connected yet.')
})

renderCart()
