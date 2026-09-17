import { test, expect } from '@playwright/test'

test('user can submit the login form', async ({ page }) => {
  let alertMessage = ''

  page.on('dialog', async (dialog) => {
    alertMessage = dialog.message()
    await dialog.accept()
  })

  await page.goto('/')

  await page
    .getByTestId('login-email-input')
    .fill('test@example.com')

  await page
    .getByTestId('login-password-input')
    .fill('Password123!')

  await page
    .getByTestId('login-submit-button')
    .click()

  await expect.poll(() => alertMessage).toBe(
    'Login submitted for: test@example.com',
  )
})
