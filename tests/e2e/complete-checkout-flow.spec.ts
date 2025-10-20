import { test, expect } from '../../src/fixtures';

test('Complete E2E Checkout Flow', async ({ 
  page, 
  homePage, 
  checkoutPage, 
  cartPane, 
  loginPane,
  signUpPane, 
  productDetailPage, 
  testAddress, 
  testCard, 
  generateRandomEmail 
}) => {
  // Generate unique credentials
  const userEmail = generateRandomEmail();
  const userPassword = 'TestPassword123!';

  // Navigate to application
  await page.goto('https://demo.spreecommerce.org/', { 
    waitUntil: 'networkidle'
  });
  await expect(homePage.logo).toBeVisible();

  // Register new user
  await homePage.openAccountMenu();
  await expect(page.locator('#account-pane')).toBeVisible();
  await loginPane.clickSignUpLink();
  await expect(signUpPane.signUpForm).toBeVisible();
  await signUpPane.fillSignUpForm(userEmail, userPassword, userPassword);
  await signUpPane.submitSignUpForm();
  await expect(homePage.logo).toBeVisible();
  await expect(page.locator('#flashes .flash-message:has-text("Welcome! You have signed up successfully.")')).toBeVisible();

  // Browse and add product to cart
  await homePage.navigateToShopAll();
  await expect(page.locator('.section-page-title:has-text("Shop All")')).toBeVisible();
  await page.locator('.product-card a').first().click();
  await expect(page.locator('[data-editor-name="Description"]')).toBeVisible();
  await productDetailPage.selectFirstAvailableSize();
  await productDetailPage.addToCart();
  await expect(cartPane.counter).toBeVisible();

  // Complete checkout
  await cartPane.proceedToCheckout();
  await expect(page).toHaveURL(/.*\/checkout/);
  await checkoutPage.fillShippingAddress(testAddress);
  await checkoutPage.saveAndContinue();
  await checkoutPage.selectShippingMethodByLabel('Standard');
  await page.waitForLoadState('networkidle');
  await checkoutPage.saveAndContinueDelivery();
  await checkoutPage.waitForPaymentFormReady();
  await checkoutPage.fillPaymentDetails(testCard);
  await checkoutPage.submitPayment();

  // Verify order confirmation
  await checkoutPage.expectOrderConfirmation();
});
