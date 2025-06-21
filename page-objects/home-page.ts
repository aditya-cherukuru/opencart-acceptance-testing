import type { Page } from "playwright"
import { BasePage } from "./base-page"

export class HomePage extends BasePage {
  protected url = "http://localhost/opencart/"

  private readonly searchInput = this.page.locator('input[name="search"]')
  private readonly searchButton = this.page.locator("button.btn-light, .btn-default")
  private readonly myAccountDropdown = this.page.locator(".dropdown:has(.fa-user)")
  private readonly myAccountLink = this.page.locator('a:has-text("My Account"), a[title="My Account"]')
  private readonly registerLink = this.page.locator('a:has-text("Register")')
  private readonly loginLink = this.page.locator('a:has-text("Login")')
  private readonly cartButton = this.page.locator("#cart, .btn-inverse")
  private readonly featuredProducts = this.page.locator(".product-thumb, .product-layout")

  constructor(page: Page) {
    super(page)
  }

  async searchForProduct(searchTerm: string): Promise<void> {
    await this.waitForElement(this.searchInput)
    await this.fillInput(this.searchInput, searchTerm)
    await this.clickElement(this.searchButton)
    await this.waitForPageLoad()
  }

  async goToRegistration(): Promise<void> {
    try {
      // Try clicking the dropdown first
      await this.clickElement(this.myAccountDropdown)
      await this.page.waitForTimeout(1000)
      await this.clickElement(this.registerLink)
    } catch (error) {
      // Fallback: try direct navigation
      await this.page.goto(`${this.url}index.php?route=account/register`)
    }
    await this.waitForPageLoad()
  }

  async goToLogin(): Promise<void> {
    try {
      // Try clicking the dropdown first
      await this.clickElement(this.myAccountDropdown)
      await this.page.waitForTimeout(1000)
      await this.clickElement(this.loginLink)
    } catch (error) {
      // Fallback: try direct navigation
      await this.page.goto(`${this.url}index.php?route=account/login`)
    }
    await this.waitForPageLoad()
  }

  async getFeaturedProducts(): Promise<string[]> {
    await this.waitForElement(this.featuredProducts.first())
    const products = await this.featuredProducts.all()
    const productNames: string[] = []

    for (const product of products) {
      try {
        const nameElement = product.locator("h4 a, .caption h4 a")
        const name = await nameElement.textContent()
        if (name) productNames.push(name.trim())
      } catch (error) {
        console.log("Could not get product name:", error)
      }
    }

    return productNames
  }

  async addFeaturedProductToCart(index = 0): Promise<void> {
    await this.waitForElement(this.featuredProducts.first())
    const products = await this.featuredProducts.all()

    if (products[index]) {
      const addToCartButton = products[index].locator('button:has(.fa-shopping-cart), button[title*="Add to Cart"]')
      await this.clickElement(addToCartButton)
      await this.page.waitForTimeout(2000) // Wait for cart update
    }
  }
}
