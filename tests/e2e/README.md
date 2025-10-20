# Checkout Payment Step Tests

This directory contains comprehensive UI tests for the Spree Commerce checkout payment step functionality.

## Test Files

### `checkout-payment.spec.ts`

Main test file covering the complete checkout payment flow and specific payment step functionality.

## Test Scenarios

### 1. Complete Checkout Flow with Payment Step
- **Purpose**: End-to-end test covering the entire checkout process
- **Steps**:
  1. Navigate to Spree Commerce demo store
  2. Add product to cart
  3. Proceed to checkout
  4. Fill shipping address
  5. Select delivery method
  6. Complete payment step
  7. Verify order confirmation

### 2. Payment Step - Use Shipping Address for Billing
- **Purpose**: Test the "use shipping address" checkbox functionality
- **Steps**:
  1. Setup: Navigate to payment step
  2. Test checkbox toggle behavior
  3. Verify billing address section visibility
  4. Test billing address form filling

### 3. Payment Step - Payment Method Validation
- **Purpose**: Test payment form validation and different card types
- **Steps**:
  1. Setup: Navigate to payment step
  2. Test form validation without payment details
  3. Test with valid payment details
  4. Test different card types (Visa, Mastercard, Amex)

### 4. Payment Step - Review Section Edit Links
- **Purpose**: Test edit links in the payment review section
- **Steps**:
  1. Setup: Navigate to payment step
  2. Test edit contact link
  3. Test edit shipping address link
  4. Test edit delivery method link

## Test Data

The tests use predefined test data from `src/utils/testData.ts`:

- **Test Address**: Standard US address for shipping/billing
- **Test Card**: Stripe test card (4242 4242 4242 4242)
- **Email Generation**: Random email generation for user registration

## Page Objects

Tests utilize the following page objects:

- **HomePage**: Navigation and product browsing
- **CartPane**: Cart management and checkout initiation
- **CheckoutPage**: Complete checkout flow including payment step

## Payment Step Locators

The CheckoutPage includes comprehensive locators for the payment step:

### Review Section
- Contact information display
- Shipping address display
- Delivery method display
- Edit links for each section

### Billing Address
- Use shipping address checkbox
- Billing address form fields
- Country/state selection

### Payment Method
- Stripe payment element
- Card input frames (number, expiry, CVC, name)
- Payment message container
- Loading indicators

### Order Confirmation
- Order confirmation page
- Order number display
- Success message

## Running the Tests

### Run All Payment Tests
```bash
npx playwright test tests/e2e/checkout-payment.spec.ts
```

### Run with UI (Headed Mode)
```bash
npx playwright test tests/e2e/checkout-payment.spec.ts --headed
```

### Run Specific Test
```bash
npx playwright test tests/e2e/checkout-payment.spec.ts -g "Complete checkout flow"
```

### Run with Debug Mode
```bash
npx playwright test tests/e2e/checkout-payment.spec.ts --debug
```

## Test Configuration

Tests are configured to:
- Run against the Spree Commerce demo store (https://demo.spreecommerce.org/)
- Use realistic test data
- Include comprehensive assertions
- Handle dynamic content and loading states
- Support different payment scenarios

## Assertions

Each test includes multiple assertions to verify:
- URL navigation correctness
- UI element visibility and state
- Form data accuracy
- Order confirmation details
- Error handling and validation

## Browser Support

Tests are designed to run on all Playwright-supported browsers:
- Chromium
- Firefox
- WebKit

## CI/CD Integration

The test suite is ready for CI/CD integration with:
- GitHub Actions
- GitLab CI
- Jenkins
- Other CI/CD platforms

## Troubleshooting

### Common Issues

1. **Stripe iframe loading**: Tests wait for Stripe elements to load before interaction
2. **Dynamic content**: Tests use proper waits for dynamic content
3. **Network timeouts**: Tests include retry logic for network operations

### Debug Tips

1. Use `--headed` mode to see browser interactions
2. Use `--debug` mode to step through tests
3. Check browser console for JavaScript errors
4. Verify network requests in browser dev tools

## Maintenance

### Adding New Tests

1. Follow the existing test structure
2. Use descriptive test names and step descriptions
3. Include proper assertions
4. Update this README if adding new test categories

### Updating Locators

1. Update locators in the appropriate page object
2. Test locators in headed mode first
3. Update related tests if locator changes affect functionality
4. Document any breaking changes
