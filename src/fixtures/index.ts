import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartPane } from '../pages/CartPane';
import { LoginPane } from '../pages/LoginPane';
import { SignUpPane } from '../pages/SignUpPane';
import { ShopAllPage } from '../pages/ShopAllPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { testAddress, testCard, generateRandomEmail } from '../utils/testData';

/**
 * Base fixture that provides all page objects and common utilities
 * This fixture is extended by other specialized fixtures
 */
export interface BaseFixtures {
  page: Page;
  homePage: HomePage;
  checkoutPage: CheckoutPage;
  cartPane: CartPane;
  loginPane: LoginPane;
  signUpPane: SignUpPane;
  shopAllPage: ShopAllPage;
  productDetailPage: ProductDetailPage;
  testAddress: typeof testAddress;
  testCard: typeof testCard;
  generateRandomEmail: typeof generateRandomEmail;
}


/**
 * Base test with all page objects and utilities
 */
export const test = base.extend<BaseFixtures>({
  page: async ({ page }, use) => {
    await use(page);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  cartPane: async ({ page }, use) => {
    const cartPane = new CartPane(page);
    await use(cartPane);
  },

  loginPane: async ({ page }, use) => {
    const loginPane = new LoginPane(page);
    await use(loginPane);
  },

  signUpPane: async ({ page }, use) => {
    const signUpPane = new SignUpPane(page);
    await use(signUpPane);
  },

  shopAllPage: async ({ page }, use) => {
    const shopAllPage = new ShopAllPage(page);
    await use(shopAllPage);
  },

  productDetailPage: async ({ page }, use) => {
    const productDetailPage = new ProductDetailPage(page);
    await use(productDetailPage);
  },

  testAddress: async ({}, use) => {
    await use(testAddress);
  },

  testCard: async ({}, use) => {
    await use(testCard);
  },

  generateRandomEmail: async ({}, use) => {
    await use(generateRandomEmail);
  },
});


export { expect } from '@playwright/test';
