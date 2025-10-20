import { test, expect } from '../../src/fixtures';

test('Complete E2E Checkout Flow', async ({ 
  page, 
  homePage, 
  checkoutPage, 
  cartPane, 
  loginPane,
  signUpPane, 
  shopAllPage,
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
  await expect(homePage.accountPane).toBeVisible();
  await loginPane.clickSignUpLink();
  await expect(signUpPane.signUpForm).toBeVisible();
  await signUpPane.fillSignUpForm(userEmail, userPassword, userPassword);
  await signUpPane.submitSignUpForm();
  await expect(homePage.logo).toBeVisible();
  await expect(homePage.successMessage).toBeVisible();

  // Browse and add product to cart
  await homePage.navigateToShopAll();
  await expect(shopAllPage.pageTitle).toBeVisible();
  await shopAllPage.clickFirstProduct();
  await expect(productDetailPage.descriptionSection).toBeVisible();
  await productDetailPage.selectFirstAvailableSize();
  await productDetailPage.addToCart();
  await expect(cartPane.counter).toBeVisible();

  // Complete checkout
  await cartPane.proceedToCheckout();
  await expect(page).toHaveURL(/.*\/checkout/);
  await checkoutPage.fillShippingAddress(testAddress);
  await checkoutPage.saveAndContinue();
  await checkoutPage.selectStandardShipping();
  await page.waitForLoadState('networkidle');
  await checkoutPage.saveAndContinueDelivery();
  await checkoutPage.waitForPaymentFormReady();
  await checkoutPage.fillPaymentDetails(testCard);
  await checkoutPage.submitPayment();

  // Verify order confirmation
  await checkoutPage.expectOrderConfirmation();
});
