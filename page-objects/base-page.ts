import { Page, Locator } from 'playwright';
import { logger } from '../utils/logger';

export abstract class BasePage {
  protected page: Page;
  protected url = 'http://localhost/opencart/';

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    logger.info(`Navigating to ${this.url}`);
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
  

  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async selectDropdownOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }
}
