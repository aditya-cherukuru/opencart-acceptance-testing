import type { Page } from "playwright"
import { BasePage } from "./base-page"

export class LoginPage extends BasePage {
  protected url = "http://localhost/opencart/index.php?route=account/login"

  private readonly emailInput = this.page.locator('#input-email, input[name="email"]')
  private readonly passwordInput = this.page.locator('#input-password, input[name="password"]')

  // Multiple selectors for login button
  private readonly loginButton = this.page.locator(
    [
      'input[value="Login"]',
      'button:has-text("Login")',
      'button[type="submit"]',
      ".btn-primary",
      '.btn:has-text("Login")',
    ].join(", "),
  )

  private readonly errorAlert = this.page.locator(".alert-danger, .text-danger, .error")

  constructor(page: Page) {
    super(page)
  }

  async login(email: string, password: string): Promise<void> {
    await this.waitForElement(this.emailInput, 15000)

    await this.fillInput(this.emailInput, email)
    await this.fillInput(this.passwordInput, password)

    // Try multiple approaches to find and click login button
    const loginSelectors = [
      'input[value="Login"]',
      'button:has-text("Login")',
      'button[type="submit"]',
      ".btn-primary",
      '.btn:has-text("Login")',
      "form button",
    ]

    let clicked = false
    for (const selector of loginSelectors) {
      try {
        const button = this.page.locator(selector)
        if (await button.isVisible({ timeout: 3000 })) {
          await button.click()
          console.log(`✅ Login button clicked using: ${selector}`)
          clicked = true
          break
        }
      } catch (error) {
        console.log(`Login button selector ${selector} failed, trying next...`)
      }
    }

    if (!clicked) {
      // Last resort: press Enter
      await this.passwordInput.press("Enter")
      console.log("⚠️ Used Enter key as fallback for login")
    }

    await this.page.waitForTimeout(3000)
  }

  async getErrorMessage(): Promise<string> {
    try {
      await this.waitForElement(this.errorAlert, 5000)
      return await this.getText(this.errorAlert)
    } catch {
      return ""
    }
  }
}
