<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (
    !fullName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Please complete all fields.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: fullName.value,
        email: email.value,
        password: password.value,
        password_confirmation: confirmPassword.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.errors) {
        const firstError = Object.values(data.errors).flat()[0]
        errorMessage.value = firstError || 'Registration failed.'
      } else {
        errorMessage.value = data.message || 'Registration failed.'
      }

      return
    }

    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    successMessage.value = 'Account created successfully.'

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
  <main class="register-page">
    <section class="register-card">
      <div class="brand">
        <img
          src="../assets/ims-logo.png"
          alt="IMS logo"
          class="ims-logo"
        />

        <h1>Create Account</h1>

        <p>
          Create an account to access the Inventory Management System.
        </p>
      </div>

      <form class="register-form" @submit.prevent="handleRegister">
        <label for="full-name">Full name</label>

        <input
          id="full-name"
          data-testid="register-name"
          v-model="fullName"
          type="text"
          placeholder="Enter your full name"
          autocomplete="name"
        />

        <label for="register-email">Email address</label>

        <input
          id="register-email"
          data-testid="register-email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          autocomplete="email"
        />

        <label for="register-password">Password</label>

        <input
          id="register-password"
          data-testid="register-password"
          v-model="password"
          type="password"
          placeholder="Create a password"
          autocomplete="new-password"
        />

        <label for="confirm-password">Confirm password</label>

        <input
          id="confirm-password"
          data-testid="register-confirm-password"
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          autocomplete="new-password"
        />

        <p
          v-if="errorMessage"
          data-testid="register-error"
          class="error-message"
        >
          {{ errorMessage }}
        </p>

        <p
          v-if="successMessage"
          data-testid="register-success"
          class="success-message"
        >
          {{ successMessage }}
        </p>

        <button
          type="submit"
          data-testid="register-submit"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <p class="login-text">
          Already have an account?
          <RouterLink to="/">Log in here</RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f3f6fb;
  font-family: Arial, sans-serif;
}

.register-card {
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

.register-form {
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

.success-message {
  margin: 14px 0 0;
  color: #16a34a;
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

.login-text {
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
