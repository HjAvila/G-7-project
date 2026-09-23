<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.message || 'Invalid email or password.'
      return
    }

    // Save authentication data
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Go to dashboard
    await router.push('/dashboard')
  } catch (error) {
    console.error(error)
    errorMessage.value =
      'Unable to connect to the server. Make sure Laravel is running.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <div class="brand">
        <img
          src="../assets/ims-logo.png"
          alt="IMS logo"
          class="ims-logo"
        />

        <h1>Inventory Management System</h1>

        <p>Welcome back! Please log in to continue.</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <label for="login-email-input">Email address</label>

        <input
          id="login-email-input"
          data-testid="login-email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          autocomplete="email"
        />

        <label for="login-password-input">Password</label>

        <input
          id="login-password-input"
          data-testid="login-password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          autocomplete="current-password"
        />

        <p
          v-if="errorMessage"
          data-testid="login-error"
          class="error-message"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          data-testid="login-submit"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </button>

        <p class="register-text">
          Don't have an account?
          <RouterLink to="/register">Register here</RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f3f6fb;
  font-family: Arial, sans-serif;
}

.login-card {
  width: 100%;
  max-width: 600px;
  padding: 40px 56px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.brand {
  text-align: center;
  margin-bottom: 30px;
}

.ims-logo {
  display: block;
  width: 140px;
  height: auto;
  margin: 0 auto 18px;
}

.brand h1 {
  margin: 0 0 10px;
  color: #1f3b64;
  font-size: 30px;
}

.brand p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
  font-size: 17px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

label {
  margin: 14px 0 7px;
  color: #374151;
  font-size: 17px;
  font-weight: 700;
}

input {
  width: 100%;
  padding: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #1f3b64;
  box-shadow: 0 0 0 3px rgba(31, 59, 100, 0.15);
}

.error-message {
  margin: 14px 0 0;
  color: #dc2626;
  font-size: 14px;
}

button {
  margin-top: 24px;
  padding: 15px;
  border: 0;
  border-radius: 10px;
  background: #1f3b64;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: #162d4d;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-text {
  margin: 22px 0 0;
  text-align: center;
  color: #6b7280;
  font-size: 16px;
}

a {
  color: #1f3b64;
  font-weight: 700;
  text-decoration: none;
}
</style>
