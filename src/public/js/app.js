const loginBtn = document.querySelector('#loginBtn')
const loginForm = document.querySelector('#loginForm')

loginBtn.addEventListener('click', () => {
    loginForm.classList.remove('d-none')
    loginBtn.classList.add('d-none')
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    location.href = '/dashboard'
})