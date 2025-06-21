import type { Page } from "playwright"
import { BasePage } from "./base-page"
import type { UserData } from "../utils/test-data-manager"

export class RegistrationPage extends BasePage {
  protected url = "http://localhost/opencart/index.php?route=account/register"

  // Updated selectors based on the actual form structure
  private readonly firstNameInput = this.page.locator('#input-firstname, input[name="firstname"]')
  private readonly lastNameInput = this.page.locator('#input-lastname, input[name="lastname"]')
  private readonly emailInput = this.page.locator('#input-email, input[name="email"]')
  private readonly passwordInput = this.page.locator('#input-password, input[name="password"]')

  // Newsletter subscription toggle/checkbox
  private readonly newsletterCheckbox = this.page.locator('input[name="newsletter"], .form-check-input')

  // Privacy policy checkbox - multiple possible selectors
  private readonly privacyPolicyCheckbox = this.page.locator(
    'input[name="agree"], input[type="checkbox"]:near(:text("Privacy Policy")), .form-check-input:near(:text("Privacy Policy"))',
  )

  // Continue button
  private readonly continueButton = this.page.locator(
    'button:has-text("Continue"), input[value="Continue"], .btn-primary',
  )

  private readonly successMessage = this.page.locator("#content h1, .alert-success, h1")
  private readonly errorMessages = this.page.locator(".alert-danger, .text-danger, .error")

  constructor(page: Page) {
    super(page)
  }

  async fillRegistrationForm(userData: UserData): Promise<void> {
    console.log("Filling registration form with simplified fields...")

    // Wait for form to be visible
    await this.waitForElement(this.firstNameInput, 15000)

    // Fill basic fields
    await this.fillInput(this.firstNameInput, userData.firstName)
    await this.page.waitForTimeout(500)

    await this.fillInput(this.lastNameInput, userData.lastName)
    await this.page.waitForTimeout(500)

    await this.fillInput(this.emailInput, userData.email)
    await this.page.waitForTimeout(500)

    // Only fill password once (no confirmation field)
    await this.fillInput(this.passwordInput, userData.password)
    await this.page.waitForTimeout(500)

    console.log("✅ Registration form filled successfully")
  }

  async acceptPrivacyPolicy(): Promise<void> {
    try {
      console.log("Looking for privacy policy checkbox...")

      // Try multiple approaches to find and click the privacy policy checkbox
      const privacyCheckboxes = [
        'input[name="agree"]',
        'input[type="checkbox"]:near(:text("Privacy Policy"))',
        ".form-check-input:last-of-type",
        'input[type="checkbox"]:last-of-type',
      ]

      let clicked = false
      for (const selector of privacyCheckboxes) {
        try {
          const checkbox = this.page.locator(selector)
          if (await checkbox.isVisible({ timeout: 3000 })) {
            await checkbox.click()
            console.log(`✅ Privacy policy accepted using selector: ${selector}`)
            clicked = true
            break
          }
        } catch (error) {
          console.log(`Selector ${selector} not found, trying next...`)
        }
      }

      if (!clicked) {
        // Fallback: click near the "Privacy Policy" text
        try {
          await this.page.click("text=Privacy Policy", { position: { x: -20, y: 0 } })
          console.log("✅ Privacy policy accepted using text-based click")
        } catch (error) {
          console.log("❌ Could not find privacy policy checkbox")
          throw new Error("Privacy policy checkbox not found")
        }
      }

      await this.page.waitForTimeout(1000)
    } catch (error) {
      console.log("Privacy policy acceptance failed:", error)
      throw error
    }
  }

  async submitRegistration(): Promise<void> {
    try {
      console.log("Looking for continue button...")

      // Try multiple selectors for the continue button
      const continueSelectors = [
        'button:has-text("Continue")',
        'input[value="Continue"]',
        ".btn-primary",
        'button[type="submit"]',
        '.btn:has-text("Continue")',
      ]

      let clicked = false
      for (const selector of continueSelectors) {
        try {
          const button = this.page.locator(selector)
          if (await button.isVisible({ timeout: 3000 })) {
            await button.click()
            console.log(`✅ Continue button clicked using selector: ${selector}`)
            clicked = true
            break
          }
        } catch (error) {
          console.log(`Continue button selector ${selector} not found, trying next...`)
        }
      }

      if (!clicked) {
        throw new Error("Continue button not found")
      }

      await this.page.waitForTimeout(3000)
    } catch (error) {
      console.log("Submit registration failed:", error)
      throw error
    }
  }

  async getSuccessMessage(): Promise<string> {
    try {
      await this.waitForElement(this.successMessage, 15000)
      return await this.getText(this.successMessage)
    } catch (error) {
      // Check page content for success indicators
      const pageContent = await this.page.textContent("body")
      console.log("Page content after registration:", pageContent?.substring(0, 500))

      if (
        pageContent?.includes("success") ||
        pageContent?.includes("created") ||
        pageContent?.includes("congratulations")
      ) {
        return "Account created successfully"
      }
      throw error
    }
  }

  async getErrorMessages(): Promise<string[]> {
    const errors = await this.errorMessages.all()
    const errorTexts: string[] = []

    for (const error of errors) {
      const text = await error.textContent()
      if (text) errorTexts.push(text.trim())
    }

    return errorTexts
  }
}
