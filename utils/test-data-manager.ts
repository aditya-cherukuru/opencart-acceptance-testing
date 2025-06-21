// utils/test-data-manager.ts
import fs from 'fs-extra';
import { parse } from 'csv-parse/sync';
import { logger } from './logger';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  telephone: string;
}

export interface ProductData {
  name: string;
  price: string;
  category: string;
  sku: string;
}

export class TestDataManager {
  private static userData: UserData[] = [];
  private static productData: ProductData[] = [];

  static async loadTestData(): Promise<void> {
    try {
      // Create test data if files don't exist
      await this.createTestDataFiles();
      
      // Load user data
      if (await fs.pathExists('test-data/users.csv')) {
        const userCsv = await fs.readFile('test-data/users.csv', 'utf-8');
        this.userData = parse(userCsv, { 
          columns: true, 
          skip_empty_lines: true 
        });
      }

      // Load product data
      if (await fs.pathExists('test-data/products.csv')) {
        const productCsv = await fs.readFile('test-data/products.csv', 'utf-8');
        this.productData = parse(productCsv, { 
          columns: true, 
          skip_empty_lines: true 
        });
      }

      logger.info(`Loaded ${this.userData.length} users and ${this.productData.length} products`);
    } catch (error) {
      logger.error('Failed to load test data:', error);
      // Create default data if loading fails
      this.createDefaultData();
    }
  }

  private static async createTestDataFiles(): Promise<void> {
    try {
      await fs.ensureDir('test-data');
      
      const usersCsv = `firstName,lastName,email,password,telephone
John,Doe,john.doe@example.com,SecurePass123!,1234567890
Jane,Smith,jane.smith@example.com,SecurePass123!,0987654321
Bob,Johnson,bob.johnson@example.com,SecurePass123!,5555555555
Alice,Brown,alice.brown@example.com,SecurePass123!,1111111111`;

      const productsCsv = `name,price,category,sku
MacBook Pro,1500.00,Laptops,MBPRO2024
iPhone 15,999.00,Phones,IP15-128
Canon EOS R5,2499.00,Cameras,CEOSR5
Samsung Galaxy S24,899.00,Phones,SGS24-256`;

      if (!await fs.pathExists('test-data/users.csv')) {
        await fs.writeFile('test-data/users.csv', usersCsv);
      }
      
      if (!await fs.pathExists('test-data/products.csv')) {
        await fs.writeFile('test-data/products.csv', productsCsv);
      }
    } catch (error) {
      logger.error('Failed to create test data files:', error);
    }
  }

  private static createDefaultData(): void {
    this.userData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        telephone: '1234567890'
      }
    ];

    this.productData = [
      {
        name: 'MacBook Pro',
        price: '1500.00',
        category: 'Laptops',
        sku: 'MBPRO2024'
      }
    ];
  }

  static getRandomUser(): UserData {
    if (this.userData.length === 0) {
      this.createDefaultData();
    }
    return this.userData[Math.floor(Math.random() * this.userData.length)];
  }

  static getRandomProduct(): ProductData {
    if (this.productData.length === 0) {
      this.createDefaultData();
    }
    return this.productData[Math.floor(Math.random() * this.productData.length)];
  }

  static generateUniqueEmail(): string {
    return `test${Date.now()}@example.com`;
  }
}