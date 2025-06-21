import { type Browser, type BrowserContext, type Page, chromium, firefox, webkit } from "playwright"
import { logger } from "./logger"

export class BrowserManager {
  private static browser: Browser
  private static context: BrowserContext
  private static page: Page

  static async launchBrowser(): Promise<void> {
    try {
      // Close any existing browser first
      await this.closeBrowser()

      const browserType = process.env.BROWSER || "chromium"
      logger.info(`Launching ${browserType} browser`)

      // FIXED: Better browser launch options for localhost access
      const launchOptions = {
        headless: process.env.CI === "true" || process.env.HEADLESS === "true",
        slowMo: 100,
        timeout: 60000,
        args: [
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--disable-dev-shm-usage",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--no-first-run",
          "--no-default-browser-check",
          "--disable-default-apps",
          "--allow-running-insecure-content",
          "--disable-extensions",
          "--disable-plugins",
          "--disable-images", // Speed up loading
        ],
      }

      switch (browserType) {
        case "firefox":
          this.browser = await firefox.launch(launchOptions)
          break
        case "webkit":
          this.browser = await webkit.launch(launchOptions)
          break
        default:
          this.browser = await chromium.launch(launchOptions)
      }

      // FIXED: Better context options
      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        bypassCSP: true,
        // Remove video recording to speed up
        // recordVideo: {
        //   dir: "videos/",
        //   size: { width: 1280, height: 720 },
        // },
      })

      this.page = await this.context.newPage()

      // FIXED: Better timeouts
      this.page.setDefaultTimeout(45000)
      this.page.setDefaultNavigationTimeout(60000)

      // Handle page errors gracefully
      this.page.on("pageerror", (error) => {
        logger.warn("Page error (non-fatal):", error.message)
      })

      this.page.on("console", (msg) => {
        if (msg.type() === "error") {
          logger.warn("Console error (non-fatal):", msg.text())
        }
      })

      // FIXED: Test navigation immediately
      await this.testNavigation()

      logger.info("Browser launched successfully")
    } catch (error) {
      logger.error("Failed to launch browser:", error)
      throw error
    }
  }

  // NEW: Test navigation to ensure localhost works
  private static async testNavigation(): Promise<void> {
    const testUrls = [
      "http://localhost/opencart/",
      "http://127.0.0.1/opencart/",
      "http://localhost:8080/opencart/",
      "http://localhost/",
    ]

    console.log("🔍 Testing navigation to localhost...")

    for (const url of testUrls) {
      try {
        console.log(`Testing: ${url}`)

        const response = await this.page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        })

        if (response && response.ok()) {
          const title = await this.page.title()
          const content = await this.page.textContent("body")

          console.log(`✅ SUCCESS: ${url}`)
          console.log(`   Title: ${title}`)
          console.log(`   Content: ${content?.substring(0, 100)}...`)

          // If this looks like OpenCart, save it as working URL
          if (
            title.toLowerCase().includes("opencart") ||
            content?.toLowerCase().includes("opencart") ||
            content?.toLowerCase().includes("your store") ||
            content?.toLowerCase().includes("featured")
          ) {
            process.env.WORKING_OPENCART_URL = url
            console.log(`🎯 FOUND WORKING OPENCART: ${url}`)
            return
          }
        }
      } catch (error: any) {
        console.log(`❌ Failed: ${url} - ${error.message}`)
      }
    }

    // If we get here, set a default
    process.env.WORKING_OPENCART_URL = "http://localhost/opencart/"
    console.log("⚠️ Using default URL, tests may fail")
  }

  static async closeBrowser(): Promise<void> {
    try {
      if (this.page && !this.page.isClosed()) {
        await this.page.close().catch(() => {})
      }
      if (this.context) {
        await this.context.close().catch(() => {})
      }
      if (this.browser) {
        await this.browser.close().catch(() => {})
      }
      logger.info("Browser closed")
    } catch (error) {
      logger.warn("Error closing browser (non-fatal):", error)
    }
  }

  static getPage(): Page {
    if (!this.page || this.page.isClosed()) {
      throw new Error("Browser not initialized or page closed. Call launchBrowser() first.")
    }
    return this.page
  }

  static async takeScreenshot(name: string): Promise<string> {
    try {
      if (!this.page || this.page.isClosed()) {
        logger.warn("Cannot take screenshot: page is closed")
        return ""
      }

      const screenshotPath = `screenshots/${name}-${Date.now()}.png`
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
        timeout: 10000,
      })
      logger.info(`Screenshot saved: ${screenshotPath}`)
      return screenshotPath
    } catch (error) {
      logger.warn("Failed to take screenshot (non-fatal):", error)
      return ""
    }
  }

  static async waitForPageLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState("networkidle", { timeout: 30000 })
    } catch (error) {
      logger.warn("Page load timeout, continuing anyway")
    }
  }

  // NEW: Force navigation with retries
  static async navigateWithRetry(url: string, maxRetries = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`🔄 Navigation attempt ${i + 1}: ${url}`)

        const response = await this.page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        })

        if (response && response.ok()) {
          console.log(`✅ Navigation successful: ${url}`)
          return
        }
      } catch (error: any) {
        console.log(`❌ Navigation attempt ${i + 1} failed: ${error.message}`)

        if (i === maxRetries - 1) {
          throw error
        }

        await this.page.waitForTimeout(2000)
      }
    }
  }
}
