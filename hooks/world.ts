import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { BrowserManager } from '../utils/browser-manager';
import { TestDataManager } from '../utils/test-data-manager';
import { logger } from '../utils/logger';

export class CustomWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    await TestDataManager.loadTestData();
    await BrowserManager.launchBrowser();
  }

  async cleanup(): Promise<void> {
    await BrowserManager.closeBrowser();
  }
}

setWorldConstructor(CustomWorld);