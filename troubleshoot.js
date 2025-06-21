/**
 * OpenCart Testing Troubleshooting Guide
 *
 * Common Issues and Solutions:
 */

export const TroubleshootingGuide = {
  // Issue 1: Element not found errors
  elementNotFound: {
    problem: "locator.waitFor: Timeout exceeded",
    solutions: [
      "Check if OpenCart is running on http://localhost/opencart/",
      "Verify element selectors match your OpenCart version",
      "Increase timeout values in page objects",
      "Use more flexible selectors (text-based instead of strict CSS)",
    ],
    code: `
      // Instead of strict selectors:
      this.page.locator('a[title="My Account"]')
      
      // Use flexible selectors:
      this.page.locator('a:has-text("My Account"), .dropdown:has(.fa-user)')
    `,
  },

  // Issue 2: Search returning no results
  searchNoResults: {
    problem: "Search functionality not working",
    solutions: [
      "Check if sample data is loaded in OpenCart",
      "Verify search input selector matches your theme",
      "Add products to OpenCart admin panel",
      "Check if search module is enabled",
    ],
    code: `
      // Add fallback search selectors:
      private readonly searchButton = this.page.locator(
        'button.btn-light, .btn-default, button:has(.fa-search)'
      );
    `,
  },

  // Issue 3: Browser context closed errors
  browserClosed: {
    problem: "Target page, context or browser has been closed",
    solutions: [
      "Add proper error handling in page objects",
      "Check for page.isClosed() before operations",
      "Implement retry mechanisms",
      "Ensure proper cleanup in hooks",
    ],
    code: `
      static getPage(): Page {
        if (!this.page || this.page.isClosed()) {
          throw new Error('Browser not initialized or page closed');
        }
        return this.page;
      }
    `,
  },

  // Issue 4: Timeout issues
  timeouts: {
    problem: "Function timed out, ensure promise resolves within 30000ms",
    solutions: [
      "Increase timeout values in cucumber.js",
      "Add proper waits in step definitions",
      "Use waitForLoadState for navigation",
      "Implement retry logic for flaky elements",
    ],
    code: `
      // In cucumber.js:
      '--timeout 60000'
      
      // In page objects:
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    `,
  },

  // Quick fixes to implement
  quickFixes: [
    "Update OpenCart URL to match your local setup",
    "Add sample products via OpenCart admin",
    "Enable all required OpenCart modules",
    "Check OpenCart theme compatibility",
    "Increase all timeout values",
    "Add more flexible element selectors",
    "Implement proper error handling",
  ],
}

// Usage example:
console.log("Troubleshooting OpenCart Tests:")
console.log(TroubleshootingGuide.quickFixes)
