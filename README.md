# OpenCart Automated Acceptance Testing Suite

**Tests:** TypeScript · Playwright · Cucumber  
**Academic Project:** Software Testing Course - THWS University  
**Author:** Aditya Cherukuru  
**Topic:** Automated Acceptance Testing & Reporting

---

## 🎯 Project Overview
An automated acceptance testing and reports framework for OpenCart e-commerce platform that replaces manual testing with reliable, fast, and consistent automated tests. Built using modern tools like Playwright and Cucumber.js with BDD methodology.

---


## 🛠️ Technology Stack

| Technology   | Purpose                 | Why I Chose It                          |
|-------------|--------------------------|------------------------------------------|
| Playwright  | Browser automation      | Modern, fast, multi-browser support     |
| Cucumber.js | BDD framework           | Business-readable test scenarios        |
| TypeScript  | Programming language    | Type safety and better maintainability  |
| Node.js     | Runtime environment     | Rich ecosystem and easy setup           |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+  
- XAMPP (for OpenCart)  
- Git  

### Installation

#### Setup OpenCart
```bash
# Install XAMPP and start Apache + MySQL
# Download OpenCart to C:\xampp\htdocs\opencart\
# Complete OpenCart installation at http://localhost/opencart/
```

#### Clone and Install
```bash
git clone <your-repo-url>
cd opencart-acceptance-testing
npm install
npx playwright install
```

#### Run Tests
```bash
npm test
```

---

## 🧪 Test Coverage

### ✅ Implemented Test Scenarios
- **User Registration & Login** – Account creation and authentication  
- **Product Search & Filtering** – Search functionality with sorting options  
- **Shopping Cart Management** – Add, update, remove items  
- **Checkout Process** – Guest and registered user checkout flows  
- **Form Validation** – Input validation and error handling  

---

## 📊 Test Results Summary

- ✅ Total Scenarios: 18  
- ✅ Passed: 17 (94%)  
- ❌ Failed: 1 (6%)  
- ⏱️ Execution Time: ~5 minutes  
- 🌐 Browsers: Chrome, Firefox, Safari  

---

## 🏃‍♂️ Running Tests

### Basic Commands
```bash
npm test                    # Run all tests (visible browser)
npm run test:headless       # Run in headless mode (faster)
npm run test:chrome
npm run test:firefox
npm run test:safari
npm run test:debug          # Debug mode (slower execution)
```

### Specific Test Execution
```bash
npx cucumber-js features/checkout-process.feature
npx cucumber-js --tags "@smoke"
npx cucumber-js features/user-registration.feature:15
```

---

## 📊 Reports & Documentation

### Generate Reports
```bash
npm run report
npm run report:open
```

### Report Features
- 📈 Execution Summary – Pass/fail statistics  
- 🖼️ Screenshots – Automatic capture on failures  
- ⏱️ Performance Metrics – Step execution timing  
- 🌐 Browser Information – Cross-browser results  
- 📝 Detailed Logs – Step-by-step execution details  

---

## 🏗️ Project Structure

```
opencart-acceptance-testing/
├── features/                    # BDD test scenarios
├── step-definitions/           # Test step implementations
├── page-objects/               # Page Object Model classes
├── test-data/                  # Test data and fixtures
├── utils/                      # Helper functions
├── screenshots/                # Failure screenshots
└── cucumber-reports/           # JSON reports and Generated HTML Reports
```

---

## 🔧 Technical Implementation

### Page Object Model Example

```ts
export class CheckoutPage extends BasePage {
  private readonly emailField = this.page.locator('input[name="email"]')
  private readonly continueButton = this.page.locator('input[value="Continue"]')

  async fillBillingDetails(customer: CustomerData): Promise<void> {
    await this.emailField.fill(customer.email)
    await this.waitForElement(this.continueButton)
  }
}
```

### BDD Scenario Example

```gherkin
Feature: Checkout Process
  Scenario: Complete guest checkout
    Given I have products in my cart
    When I proceed to checkout as guest
    And I fill in billing information
    And I select shipping method
    And I choose payment method
    Then I should see order confirmation
```

---

## 📈 Results & Impact

| Metric              | Manual Testing | Automated Testing | Improvement     |
|---------------------|----------------|--------------------|-----------------|
| Execution Time      | 2-3 hours      | 5 minutes          | 96% faster      |
| Browser Coverage    | 1 browser      | 3+ browsers        | 3x coverage     |
| Consistency         | Variable       | 100% consistent    | No human error  |

---

## 🔄 Lessons Learned

- **Start Small** – Begin with most critical scenarios  
- **Invest in Maintenance** – Keep tests updated with application changes  
- **Team Training** – Ensure team understands BDD methodology  
- **Proper Error Handling** – Robust tests with good debugging  

---

## 🚀 Future Enhancements

- CI/CD Integration  
- API Testing  
- Performance Testing  
- Mobile Testing  
- Visual Regression Testing  

---

## 🔧 Troubleshooting

Includes solutions for:
- Product search failures  
- Browser not launching  
- Reports not generating  
- Checkout failures  
- Database connection issues  
- Timeout errors  
- Screenshot failures  

---

## ✅ Environment Verification Checklist

Before running tests:
- Apache + MySQL running (XAMPP)  
- OpenCart accessible via `http://localhost/opencart/`  
- Required products added  
- Search works manually  
- Playwright browsers installed  

---

# 📚 External Code Sources & References

### Third-Party Libraries Used

| Library        | Version   | Purpose                       | License       | Source |
|----------------|-----------|-------------------------------|---------------|--------|
| Playwright     | 1.44.0    | Browser automation            | Apache-2.0    | [GitHub](https://github.com/microsoft/playwright) |
| Cucumber.js    | 10.8.0    | BDD framework (Gherkin)       | MIT           | [GitHub](https://github.com/cucumber/cucumber-js) |
| Winston        | 3.13.0    | Logging                       | MIT           | [GitHub](https://github.com/winstonjs/winston) |
| csv-parse      | 5.5.6     | CSV file parsing              | BSD-3-Clause  | [GitHub](https://github.com/adaltas/node-csv) |
| dotenv         | 16.4.5    | Environment variable support  | BSD-2-Clause  | [GitHub](https://github.com/motdotla/dotenv) |

### Code Patterns & Templates Referenced

- **Page Object Model Pattern**  
  Source: [Playwright POM Guide](https://playwright.dev/docs/pom)  
  Used in: `page-objects/`  
  Modifications: Custom waits, OpenCart-specific methods  

- **Cucumber Hooks**  
  Source: [Cucumber Docs](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md)  
  Used in: `hooks/hooks.ts`  
  Modifications: Screenshot capture, browser context management  

- **GitHub Actions Workflow**  
  Source: [Playwright CI Docs](https://playwright.dev/docs/ci)  
  Used in: `.github/workflows/acceptance-tests.yml`  
  Modifications: Multi-browser matrix, artifact archiving  

---

## 🤖 AI Tool Usage Documentation

### Tools Used
- **Tool**: ChatGPT-4  
- **Purpose**: Class design, logging integration, documentation  
- **Extent**: 20% (structural scaffolding, prompt help)

### Specific AI Tools Contributions
1. **Browser Manager Class**
   - Prompt: "Create a TypeScript browser manager with error handling"
   - My Modifications: Logging integration, screenshot logic

2. **Step Definitions**
   - Tool: GitHub Copilot
   - Contribution: Auto-complete suggestions
   - My Work: Business logic, validations, wait strategies

---

## 📦 Detailed Dependency Documentation

### Production Dependencies

| Package              | Version   | Purpose            | License     |
|----------------------|-----------|--------------------|-------------|
| @cucumber/cucumber   | ^10.8.0   | BDD framework      | MIT         |
| @playwright/test     | ^1.44.0   | Test automation    | Apache-2.0  |
| winston              | ^3.13.0   | Logging            | MIT         |
| csv-parse            | ^5.5.6    | Test data parsing  | BSD-3-Clause|
| dotenv               | ^16.4.5   | Env config         | BSD-2-Clause|

### Dev Dependencies

| Package        | Version   | Purpose            | License     |
|----------------|-----------|--------------------|-------------|
| typescript     | ^5.4.5    | Type-checking      | Apache-2.0  |
| ts-node        | ^10.9.2   | Run TS files       | MIT         |
| @types/node    | ^20.14.2  | Type definitions   | MIT         |

---



## 🧪 Testing Strategy & Methodology

### Principles
- **Independent:** All tests can run in isolation  
- **Repeatable:** Same input → same output  
- **Fast Feedback:** All tests < 5 min  
- **Maintainable:** POM abstraction layer  



### Exception Handling
- Element not found → Smart retries  
- Browser crash → Restart mechanism  
- Missing data → Dynamic fixture creation  
- Timeouts → Custom timeouts per feature  

---

## 📄 License
Created for educational use as part of the **Software Testing course at THWS University**.

---

## 👤 Author
**Aditya Cherukuru** – Developer & Test Architect  
- Complete implementation and architecture  
- Page Object Model and BDD test design  
- Playwright + Cucumber.js integration  
- Reporting, debugging, and documentation  
**Course**: Software Testing – THWS University  
**Submission Date**: 22 June 2025
