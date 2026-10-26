const form = document.getElementById('login')
const password = document.getElementById('password')
const errorBox = document.getElementById('error')
const button = form.querySelector('button')

form.addEventListener('submit', async event => {
  event.preventDefault()
  button.disabled = true
  errorBox.hidden = true
  try {
    const response = await fetch('/whatsapp/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || `Sign-in failed (HTTP ${response.status}).`)
    password.value = ''
    location.replace('/whatsapp')
  } catch (error) {
    errorBox.textContent = error.message
    errorBox.hidden = false
  } finally {
    button.disabled = false
  }
})
