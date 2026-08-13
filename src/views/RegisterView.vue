<script setup>
import { ref } from 'vue'

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

function handleRegister() {
  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    alert('Please complete all fields.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  alert(`Registration submitted for: ${fullName.value}`)
}
</script>

<template>
  <main class="register-page">
    <section class="register-card">
      <div class="brand">
        <img src="../assets/ims-logo.png" alt="IMS logo" class="ims-logo" />
        <h1>Create Account</h1>
        <p>Create an account to access the Inventory Management System.</p>
      </div>

      <form class="register-form" @submit.prevent="handleRegister">
        <label for="full-name">Full name</label>
        <input
          id="full-name"
          v-model="fullName"
          type="text"
          placeholder="Enter your full name"
        />

        <label for="register-email">Email address</label>
        <input
          id="register-email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
        />

        <label for="register-password">Password</label>
        <input
          id="register-password"
          v-model="password"
          type="password"
          placeholder="Create a password"
        />

        <label for="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm your password"
        />

        <button type="submit">Create Account</button>

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
  max-width: 430px;
  padding: 32px 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.brand {
  text-align: center;
  margin-bottom: 22px;
}

.ims-logo {
  display: block;
  width: 120px;
  height: auto;
  margin: 0 auto 14px;
}

.brand h1 {
  margin: 0 0 10px;
  color: #1f3b64;
  font-size: 26px;
}

.brand p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.register-form {
  display: flex;
  flex-direction: column;
}

label {
  margin: 12px 0 6px;
  color: #374151;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
}

input:focus {
  outline: none;
  border-color: #1f3b64;
  box-shadow: 0 0 0 3px rgba(31, 59, 100, 0.15);
}

button {
  margin-top: 24px;
  padding: 13px;
  border: 0;
  border-radius: 8px;
  background: #1f3b64;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: #162d4d;
}

.login-text {
  margin: 20px 0 0;
  text-align: center;
  color: #6b7280;
}

a {
  color: #1f3b64;
  font-weight: 700;
  text-decoration: none;
}
</style>