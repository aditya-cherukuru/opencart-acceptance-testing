import type { Page } from "playwright"
import { BasePage } from "./base-page"

export class SearchResultsPage extends BasePage {
  private readonly productGrid = this.page.locator(".product-thumb, .product-layout, .product-item")
  private readonly sortDropdown = this.page.locator('#input-sort, select[name="sort"]')
  private readonly noResultsMessage = this.page.locator("#content p, .alert, .no-results")
  private readonly productNames = this.page.locator("h4 a, .product-name a, .caption h4 a")
  private readonly productPrices = this.page.locator(".price, .price-new, .product-price")

  constructor(page: Page) {
    super(page)
  }

  async getSearchResults(): Promise<string[]> {
    await this.page.waitForTimeout(2000)

    const productCount = await this.productGrid.count()
    console.log(`Found ${productCount} products`)

    if (productCount === 0) {
      return []
    }

    const productNames: string[] = []
    const nameElements = await this.productNames.all()

    for (const nameElement of nameElements) {
      try {
        const name = await nameElement.textContent()
        if (name) productNames.push(name.trim())
      } catch (error) {
        console.log("Could not get product name:", error)
      }
    }

    console.log("Product names found:", productNames)
    return productNames
  }

  async sortResults(sortOption: string): Promise<void> {
    try {
      const sortExists = await this.sortDropdown.isVisible({ timeout: 5000 })
      if (!sortExists) {
        console.log("Sort dropdown not found, skipping sort")
        return
      }

      // Get available options
      const options = await this.sortDropdown.locator("option").all()
      const availableOptions: string[] = []

      for (const option of options) {
        const value = await option.getAttribute("value")
        const text = await option.textContent()
        if (value) {
          availableOptions.push(value)
          console.log(`Available sort option: ${value} (${text})`)
        }
      }

      // Try to find a matching option
      let selectedOption = sortOption
      if (!availableOptions.includes(sortOption)) {
        // Map common sort options to available ones
        const sortMapping: { [key: string]: string } = {
          "p.price-ASC":
            availableOptions.find((opt) => opt.includes("price") && opt.includes("ASC")) || availableOptions[0],
          "p.price-DESC":
            availableOptions.find((opt) => opt.includes("price") && opt.includes("DESC")) || availableOptions[0],
          "pd.name-ASC":
            availableOptions.find((opt) => opt.includes("name") && opt.includes("ASC")) || availableOptions[0],
          "rating-DESC": availableOptions.find((opt) => opt.includes("rating")) || availableOptions[0],
        }

        selectedOption = sortMapping[sortOption] || availableOptions[0]
        console.log(`Mapped ${sortOption} to ${selectedOption}`)
      }

      if (selectedOption && availableOptions.includes(selectedOption)) {
        await this.selectDropdownOption(this.sortDropdown, selectedOption)
        await this.page.waitForTimeout(2000)
        console.log(`✅ Sorted by: ${selectedOption}`)
      } else {
        console.log("⚠️ No suitable sort option found, skipping")
      }
    } catch (error) {
      console.log("Sort operation failed:", error)
    }
  }

  async getProductPrices(): Promise<number[]> {
    const priceElements = await this.productPrices.all()
    const prices: number[] = []

    for (const priceElement of priceElements) {
      try {
        const priceText = await priceElement.textContent()
        if (priceText) {
          const price = Number.parseFloat(priceText.replace(/[^0-9.]/g, ""))
          if (!isNaN(price)) prices.push(price)
        }
      } catch (error) {
        console.log("Could not get price:", error)
      }
    }

    return prices
  }

  async hasNoResults(): Promise<boolean> {
    const pageContent = await this.page.textContent("body")
    return (
      pageContent?.toLowerCase().includes("no product") ||
      pageContent?.toLowerCase().includes("no results") ||
      (await this.productGrid.count()) === 0
    )
  }
}
