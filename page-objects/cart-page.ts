import type { Page } from "playwright"
import { BasePage } from "./base-page"

export class CartPage extends BasePage {
  protected url = "http://localhost/opencart/index.php?route=checkout/cart"

  private readonly cartItems = this.page.locator(".table-responsive tbody tr, .cart-item")
  private readonly checkoutButton = this.page.locator('a:has-text("Checkout"), .btn:has-text("Checkout")')
  private readonly totalAmount = this.page.locator(".table-responsive tfoot tr:last-child td:last-child, .total")
  private readonly quantityInputs = this.page.locator('input[name*="quantity"], .qty input')
  private readonly updateButtons = this.page.locator('button:has-text("Update"), .btn-update')
  private readonly removeButtons = this.page.locator('button:has-text("Remove"), .btn-remove, .fa-times')

  constructor(page: Page) {
    super(page)
  }

  async getCartItemCount(): Promise<number> {
    try {
      const items = await this.cartItems.all()
      return items.length
    } catch (error) {
      console.log("Could not get cart item count:", error)
      return 0
    }
  }

  async proceedToCheckout(): Promise<void> {
    try {
      await this.waitForElement(this.checkoutButton, 10000)
      await this.clickElement(this.checkoutButton)
    } catch (error) {
      console.log("Checkout button not found, trying direct navigation")
      await this.page.goto("http://localhost/opencart/index.php?route=checkout/checkout")
    }
  }

  async getTotalAmount(): Promise<string> {
    try {
      return await this.getText(this.totalAmount)
    } catch (error) {
      return "$0.00"
    }
  }

  async updateQuantity(itemIndex: number, quantity: number): Promise<void> {
    try {
      const quantityInputs = await this.quantityInputs.all()
      if (quantityInputs[itemIndex]) {
        await quantityInputs[itemIndex].fill(quantity.toString())

        // Try to find and click update button
        const updateButtons = await this.updateButtons.all()
        if (updateButtons[itemIndex]) {
          await updateButtons[itemIndex].click()
        } else {
          // Fallback: press Enter on quantity input
          await quantityInputs[itemIndex].press("Enter")
        }

        await this.page.waitForTimeout(2000)
      }
    } catch (error) {
      console.log("Update quantity failed:", error)
    }
  }

  async removeItem(itemIndex: number): Promise<void> {
    try {
      const removeButtons = await this.removeButtons.all()
      if (removeButtons[itemIndex]) {
        await removeButtons[itemIndex].click()
        await this.page.waitForTimeout(2000)
      }
    } catch (error) {
      console.log("Remove item failed:", error)
    }
  }
}
