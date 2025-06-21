import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from "@cucumber/cucumber"
import { BrowserManager } from "../utils/browser-manager"
import { TestDataManager } from "../utils/test-data-manager"
import { logger } from "../utils/logger"
import fs from "fs-extra"

// Set default timeout for all steps
setDefaultTimeout(60000) // 60 seconds

BeforeAll(async () => {
  // Create directories
  await fs.ensureDir("screenshots")
  await fs.ensureDir("videos")
  await fs.ensureDir("logs")
  await fs.ensureDir("cucumber-reports")
  await fs.ensureDir("allure-results")

  // Load test data
  await TestDataManager.loadTestData()

  logger.info("Test suite initialization completed")
})

Before(async (scenario) => {
  await BrowserManager.launchBrowser()
  logger.info(`Starting scenario: ${scenario.pickle?.name || "Unknown scenario"}`)
})

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    try {
      // Take screenshot on failure
      const scenarioName = scenario.pickle?.name || "unknown-scenario"
      const screenshotPath = await BrowserManager.takeScreenshot(`failed-${scenarioName.replace(/\s+/g, "-")}`)

      // Attach screenshot to report
      if (await fs.pathExists(screenshotPath)) {
        const screenshot = await fs.readFile(screenshotPath)
        this.attach(screenshot, "image/png")
      }

      logger.error(`Scenario failed: ${scenarioName}`)
    } catch (error) {
      logger.error("Error taking screenshot:", error)
    }
  }

  await BrowserManager.closeBrowser()
})

AfterAll(async () => {
  logger.info("Test suite completed")
})
