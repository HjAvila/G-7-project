<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')

const router = useRouter()

function handleLogin() {
  if (!email.value || !password.value) {
    alert('Please enter your email and password.')
    return
  }

  // TODO: perform real authentication here. On success, navigate to dashboard.
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <div class="brand">
        <img src="../assets/ims-logo.png" alt="IMS logo" class="ims-logo" />
        <h1>Inventory Management System</h1>
        <p>Welcome back! Please log in to continue.</p>
      </div>

    <form class="login-form" @submit.prevent="handleLogin">
        <label for="email">Email address</label>
<input
  id="email"
  v-model="email"
  type="email"
  placeholder="Enter your email"
/>

        <label for="password">Password</label>
<input
  id="password"
  v-model="password"
  type="password"
  placeholder="Enter your password"
/>

<button type="submit">Log In</button>

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
  max-width: 430px;
  padding: 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}
.ims-logo {
  display: block;
  width: 150px;
  height: auto;
  margin: 0 auto 18px;
}

.brand {
  text-align: center;
  margin-bottom: 28px;
}

.brand h1 {
  margin: 0 0 10px;
  color: #1f3b64;
  font-size: 26px;
}

.brand p {
  margin: 0;
  color: #6b7280;
}

.login-form {
  display: flex;
  flex-direction: column;
}

label {
  margin: 14px 0 7px;
  color: #374151;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 13px;
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
  margin-top: 25px;
  padding: 13px;
  border: 0;
  border-radius: 8px;
  background: #1f3b64;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: #162d4d;
}

.register-text {
  margin: 22px 0 0;
  text-align: center;
  color: #6b7280;
}

a {
  color: #1f3b64;
  font-weight: 700;
  text-decoration: none;
}
</style>
