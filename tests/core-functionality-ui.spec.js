import { test, expect } from '@playwright/test'

const validEmail = 'test2@example.com'
const validPassword = 'password123'

test.describe('Inventory Management System - Core Functionality and UI Validation', () => {


  test('1. Login page navigates to Registration page', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: 'Inventory Management System',
      })
    ).toBeVisible()

    await page.getByRole('link', { name: 'Register here' }).click()

    await expect(page).toHaveURL(/\/register$/)
    await expect(
      page.getByRole('heading', { name: 'Create Account' })
    ).toBeVisible()
  })

  test('2. Empty login form shows validation message', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-submit').click()

    await expect(page.getByTestId('login-error')).toHaveText(
      'Please enter your email and password.'
    )
  })

  test('3. Invalid login credentials are rejected', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-email').fill('wrong@example.com')
    await page.getByTestId('login-password').fill('wrongpassword')
    await page.getByTestId('login-submit').click()

    await expect(page.getByTestId('login-error')).toHaveText(
      'Invalid email or password.',
      { timeout: 15000 }
    )

    await expect(page).toHaveURL(/\/$/)
  })

  test('4. Valid login returns a successful API response', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-email').fill(validEmail)
    await page.getByTestId('login-password').fill(validPassword)

    const responsePromise = page.waitForResponse((response) =>
      response.url().endsWith('/api/login') &&
      response.request().method() === 'POST'
    )

    await page.getByTestId('login-submit').click()

    const response = await responsePromise

    expect(response.status()).toBe(200)
  })

  test('5. Successful login redirects to Dashboard', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-email').fill(validEmail)
    await page.getByTestId('login-password').fill(validPassword)
    await page.getByTestId('login-submit').click()

    await expect(page).toHaveURL(/\/dashboard$/, {
      timeout: 15000,
    })

    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible()
  })

  test('6. Successful login stores authentication state', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-email').fill(validEmail)
    await page.getByTestId('login-password').fill(validPassword)
    await page.getByTestId('login-submit').click()

    await expect(page).toHaveURL(/\/dashboard$/, {
      timeout: 15000,
    })

    const authState = await page.evaluate(() => ({
      token: localStorage.getItem('auth_token'),
      user: localStorage.getItem('user'),
    }))

    expect(authState.token).toBeTruthy()
    expect(authState.user).toBeTruthy()
  })

  test('7. Empty registration form shows validation message', async ({ page }) => {
    await page.goto('/register')

    await page.getByTestId('register-submit').click()

    await expect(page.getByTestId('register-error')).toHaveText(
      'Please complete all fields.'
    )
  })

  test('8. Registration rejects mismatched passwords', async ({ page }) => {
    await page.goto('/register')

    await page.getByTestId('register-name').fill('Playwright Test User')
    await page
      .getByTestId('register-email')
      .fill(`mismatch-${Date.now()}@example.com`)
    await page.getByTestId('register-password').fill('password123')
    await page
      .getByTestId('register-confirm-password')
      .fill('different123')

    await page.getByTestId('register-submit').click()

    await expect(page.getByTestId('register-error')).toHaveText(
      'Passwords do not match.'
    )
  })

  test('9. Successful registration returns a 201 API response', async ({ page }) => {
    const uniqueEmail = `functional-${Date.now()}@example.com`

    await page.goto('/register')

    await page.getByTestId('register-name').fill('Playwright Functional User')
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
  })

  test('10. Successful registration stores authentication state', async ({
    page,
  }) => {
    const uniqueEmail = `state-${Date.now()}@example.com`

    await page.goto('/register')

    await page.getByTestId('register-name').fill('Playwright State User')
    await page.getByTestId('register-email').fill(uniqueEmail)
    await page.getByTestId('register-password').fill(validPassword)
    await page.getByTestId('register-confirm-password').fill(validPassword)

    await page.getByTestId('register-submit').click()

    await expect(page).toHaveURL(/\/dashboard$/, {
      timeout: 15000,
    })

    const authState = await page.evaluate(() => ({
      token: localStorage.getItem('auth_token'),
      user: localStorage.getItem('user'),
    }))

    expect(authState.token).toBeTruthy()
    expect(authState.user).toBeTruthy()

    const user = JSON.parse(authState.user)

    expect(user.email).toBe(uniqueEmail)
  })


  test('11. Login page displays the correct heading and logo', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: 'Inventory Management System',
      })
    ).toBeVisible()

    await expect(page.locator('.ims-logo')).toBeVisible()
    await expect(page.locator('.ims-logo')).toHaveAttribute(
      'alt',
      'IMS logo'
    )
  })

  test('12. Login email field has correct UI properties', async ({ page }) => {
    await page.goto('/')

    const emailInput = page.getByTestId('login-email')

    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute(
      'placeholder',
      'Enter your email'
    )

    const box = await emailInput.boundingBox()

    expect(box).not.toBeNull()
    expect(box.width).toBeGreaterThan(200)
    expect(box.height).toBeGreaterThan(30)
  })

  test('13. Login password field has correct UI properties', async ({
    page,
  }) => {
    await page.goto('/')

    const passwordInput = page.getByTestId('login-password')

    await expect(passwordInput).toBeVisible()
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(passwordInput).toHaveAttribute(
      'placeholder',
      'Enter your password'
    )
  })

  test('14. Login button is visible, enabled, and styled', async ({ page }) => {
    await page.goto('/')

    const button = page.getByTestId('login-submit')

    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await expect(button).toHaveText('Log In')

    const backgroundColor = await button.evaluate(
      (element) => getComputedStyle(element).backgroundColor
    )

    expect(backgroundColor).toBe('rgb(31, 59, 100)')
  })

  test('15. Login error message renders correctly', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('login-submit').click()

    const error = page.getByTestId('login-error')

    await expect(error).toBeVisible()
    await expect(error).toHaveText(
      'Please enter your email and password.'
    )

    const color = await error.evaluate(
      (element) => getComputedStyle(element).color
    )

    expect(color).toBe('rgb(220, 38, 38)')
  })

  test('16. Registration page displays the correct heading and logo', async ({
    page,
  }) => {
    await page.goto('/register')

    await expect(
      page.getByRole('heading', { name: 'Create Account' })
    ).toBeVisible()

    await expect(page.locator('.ims-logo')).toBeVisible()
    await expect(page.locator('.ims-logo')).toHaveAttribute(
      'alt',
      'IMS logo'
    )
  })

  test('17. Registration form fields render correctly', async ({ page }) => {
    await page.goto('/register')

    const nameInput = page.getByTestId('register-name')
    const emailInput = page.getByTestId('register-email')
    const passwordInput = page.getByTestId('register-password')
    const confirmInput = page.getByTestId('register-confirm-password')

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(confirmInput).toBeVisible()

    await expect(nameInput).toHaveAttribute(
      'placeholder',
      'Enter your full name'
    )

    await expect(emailInput).toHaveAttribute(
      'placeholder',
      'Enter your email'
    )

    await expect(passwordInput).toHaveAttribute(
      'placeholder',
      'Create a password'
    )

    await expect(confirmInput).toHaveAttribute(
      'placeholder',
      'Confirm your password'
    )
  })

  test('18. Registration button is visible and styled', async ({ page }) => {
    await page.goto('/register')

    const button = page.getByTestId('register-submit')

    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await expect(button).toHaveText('Create Account')

    const backgroundColor = await button.evaluate(
      (element) => getComputedStyle(element).backgroundColor
    )

    expect(backgroundColor).toBe('rgb(31, 59, 100)')
  })

  test('19. Dashboard renders with correct layout', async ({ page }) => {
    await page.goto('/dashboard')

    const dashboardPage = page.locator('.dashboard-page')
    const dashboardCard = page.locator('.dashboard-card')

    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible()

    await expect(
      page.getByText(
        'Welcome to the dashboard. Replace this with real content.'
      )
    ).toBeVisible()

    await expect(dashboardPage).toBeVisible()
    await expect(dashboardCard).toBeVisible()

    const cardBox = await dashboardCard.boundingBox()

    expect(cardBox).not.toBeNull()
    expect(cardBox.width).toBeLessThanOrEqual(900)
  })

  test('20. Login and Registration pages are responsive on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 375,
      height: 667,
    })

    // Check Login
    await page.goto('/')

    const loginCard = page.locator('.login-card')
    const loginBox = await loginCard.boundingBox()

    expect(loginBox).not.toBeNull()
    expect(loginBox.width).toBeLessThanOrEqual(375)

    const loginOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )

    expect(loginOverflow).toBe(false)

    // Check Registration
    await page.goto('/register')

    const registerCard = page.locator('.register-card')
    const registerBox = await registerCard.boundingBox()

    expect(registerBox).not.toBeNull()
    expect(registerBox.width).toBeLessThanOrEqual(375)

    const registerOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )

    expect(registerOverflow).toBe(false)
  })
})
