import { test, expect } from '@playwright/test'

const validEmail = 'test2@example.com'
const validPassword = 'password123'

test.describe('Inventory Management System - Authentication', () => {

  test('1. Login page loads', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: 'Inventory Management System',
      })
    ).toBeVisible()

    await expect(
      page.getByTestId('login-email')
    ).toBeVisible()

    await expect(
      page.getByTestId('login-password')
    ).toBeVisible()

    await expect(
      page.getByTestId('login-submit')
    ).toBeVisible()
  })

  test('2. Registration page loads', async ({ page }) => {
    await page.goto('/register')

    await expect(
      page.getByRole('heading', {
        name: 'Create Account',
      })
    ).toBeVisible()

    await expect(
      page.getByTestId('register-name')
    ).toBeVisible()

    await expect(
      page.getByTestId('register-email')
    ).toBeVisible()

    await expect(
      page.getByTestId('register-password')
    ).toBeVisible()

    await expect(
      page.getByTestId('register-confirm-password')
    ).toBeVisible()

    await expect(
      page.getByTestId('register-submit')
    ).toBeVisible()
  })

  test('3. Login validation appears when fields are empty', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-submit').click()

    await expect(
      page.getByTestId('login-error')
    ).toHaveText('Please enter your email and password.')
  })

  test('4. Invalid login credentials are rejected', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-email').fill('wrong@example.com')
    await page.getByTestId('login-password').fill('wrongpassword')
    await page.getByTestId('login-submit').click()

    await expect(
      page.getByTestId('login-error')
    ).toHaveText('Invalid email or password.', {
      timeout: 15000,
    })
  })

  test('5. Successful login works', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-email').fill(validEmail)
    await page.getByTestId('login-password').fill(validPassword)
    await page.getByTestId('login-submit').click()

    await expect(page).toHaveURL(/.*\/dashboard$/, {
      timeout: 15000,
    })
  })

  test('6. Successful login redirects to Dashboard', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-email').fill(validEmail)
    await page.getByTestId('login-password').fill(validPassword)
    await page.getByTestId('login-submit').click()

    await expect(page).toHaveURL(/.*\/dashboard$/, {
      timeout: 15000,
    })

    await expect(
      page.getByRole('heading', {
        name: 'Dashboard',
      })
    ).toBeVisible()

    await expect(
      page.getByText(
        'Welcome to the dashboard. Replace this with real content.'
      )
    ).toBeVisible()
  })

  test('7. Registration validation appears when fields are empty', async ({ page }) => {
    await page.goto('/register')

    await page.getByTestId('register-submit').click()

    await expect(
      page.getByTestId('register-error')
    ).toHaveText('Please complete all fields.')
  })

  test('8. Registration rejects mismatched passwords', async ({ page }) => {
    await page.goto('/register')

    await page.getByTestId('register-name').fill('Playwright Test User')

    await page.getByTestId('register-email').fill(
      `mismatch-${Date.now()}@example.com`
    )

    await page.getByTestId('register-password').fill('password123')
    await page.getByTestId('register-confirm-password').fill('different123')

    await page.getByTestId('register-submit').click()

    await expect(
      page.getByTestId('register-error')
    ).toHaveText('Passwords do not match.')
  })

  test('9. Successful registration works', async ({ page }) => {
    const uniqueEmail = `playwright-${Date.now()}@example.com`

    await page.goto('/register')

    await page.getByTestId('register-name').fill('Playwright Test User')
    await page.getByTestId('register-email').fill(uniqueEmail)
    await page.getByTestId('register-password').fill(validPassword)
    await page.getByTestId('register-confirm-password').fill(validPassword)

    const responsePromise = page.waitForResponse((response) =>
      response.url().endsWith('/api/register') &&
      response.request().method() === 'POST'
    )

    await page.getByTestId('register-submit').click()

    const response = await responsePromise

    expect(response.status()).toBe(201)

    await expect(page).toHaveURL(/.*\/dashboard$/, {
      timeout: 15000,
    })
  })

  test('10. Successful registration displays the Dashboard', async ({ page }) => {
    const uniqueEmail = `dashboard-${Date.now()}@example.com`

    await page.goto('/register')

    await page.getByTestId('register-name').fill('Dashboard Test User')
    await page.getByTestId('register-email').fill(uniqueEmail)
    await page.getByTestId('register-password').fill(validPassword)
    await page.getByTestId('register-confirm-password').fill(validPassword)

    const responsePromise = page.waitForResponse((response) =>
      response.url().endsWith('/api/register') &&
      response.request().method() === 'POST'
    )

    await page.getByTestId('register-submit').click()

    const response = await responsePromise

    expect(response.status()).toBe(201)

    await expect(page).toHaveURL(/.*\/dashboard$/, {
      timeout: 15000,
    })

    await expect(
      page.getByRole('heading', {
        name: 'Dashboard',
      })
    ).toBeVisible()

    await expect(
      page.getByText(
        'Welcome to the dashboard. Replace this with real content.'
      )
    ).toBeVisible()
  })

})