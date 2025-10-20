import { checkoutTest, expect } from '../../src/fixtures';
import { validateAddress, validateCard } from '../../src/utils/testData';

/**
 * Complete E2E Checkout Flow Test
 * 
 * This test performs a full end-to-end checkout flow including:
 * 1. User registration
 * 2. Product browsing and selection
 * 3. Adding items to cart
 * 4. Complete checkout process with payment
 * 5. Order confirmation verification
 * 
 * @description Tests the complete user journey from signup to order confirmation
 */
checkoutTest('Complete E2E Checkout Flow - User Registration to Order Confirmation', async ({ 
  page, 
  homePage, 
  checkoutPage, 
  cartPane, 
  loginPane, 
  signUpPane, 
  productDetailPage, 
  testAddress, 
  testCard, 
  userEmail, 
  userPassword 
}) => {
  // Validate test data before starting the test
  if (!validateAddress(testAddress)) {
    throw new Error('Invalid test address data provided');
  }
  if (!validateCard(testCard)) {
    throw new Error('Invalid test card data provided');
  }

  // ===== STEP 1: Navigate to the application =====
  try {
    await page.goto('https://demo.spreecommerce.org/', { 
      waitUntil: 'networkidle'
    });
    
    // Verify the application loaded successfully
    await expect(homePage.logo).toBeVisible();
  } catch (error) {
    throw new Error(`Failed to load the application: ${error}`);
  }

  // ===== STEP 2: User Registration =====
  try {
    await homePage.openAccountMenu();
    await expect(page.locator('#account-pane')).toBeVisible();
    await loginPane.clickSignUpLink();
    
    // Wait for sign up form to load and verify it's visible
    await expect(page.locator('#account-pane')).toBeVisible();
    await expect(signUpPane.signUpForm).toBeVisible();
    
    // Fill and submit the registration form
    await signUpPane.fillSignUpForm(userEmail, userPassword, userPassword);
    await signUpPane.submitSignUpForm();
    
    // Verify successful registration - wait for navigation back to home page
    await expect(homePage.logo).toBeVisible();
    
    // Verify registration success message
    await expect(page.locator('#flashes .flash-message:has-text("Welcome! You have signed up successfully.")')).toBeVisible();
  } catch (error) {
    throw new Error(`User registration failed: ${error}`);
  }

  // ===== STEP 3: Product Selection =====
  await homePage.navigateToShopAll();

  // Verify we're on the Shop All page
  await expect(page.locator('.section-page-title:has-text("Shop All")')).toBeVisible();
  
  // Select the first available product
  await page.locator('.product-card a').first().click();

  // Verify we're on the product detail page by checking for the product description section
  await expect(page.locator('[data-editor-name="Description"]')).toBeVisible();

  // ===== STEP 4: Add Product to Cart =====
  await productDetailPage.selectFirstAvailableSize();
  await productDetailPage.addToCart();
  await expect(cartPane.counter).toBeVisible();

  // ===== STEP 5: Navigate to Checkout =====
  await cartPane.proceedToCheckout();
  await expect(page).toHaveURL(/.*\/checkout/);

  // ===== STEP 6: Complete Checkout Process =====
  try {
    // Fill shipping address information
    await checkoutPage.fillShippingAddress(testAddress);
    await checkoutPage.saveAndContinue();
    
    // Select shipping method and wait for UI to update
    await checkoutPage.selectShippingMethodByLabel('Standard');
    // Wait for shipping method selection to be processed
    await page.waitForLoadState('networkidle');
    await checkoutPage.saveAndContinueDelivery();
    
    // Wait for payment form to be ready and fill payment details
    await checkoutPage.waitForPaymentFormReady();
    await checkoutPage.fillPaymentDetails(testCard);
    await checkoutPage.submitPayment();
  } catch (error) {
    throw new Error(`Checkout process failed: ${error}`);
  }

  // ===== STEP 7: Verify Order Confirmation =====
  await checkoutPage.expectOrderConfirmation();
  console.log(`✅ Test completed successfully! Order confirmed.`);
});
