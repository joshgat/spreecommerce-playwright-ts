# SpreeCommerce Playwright TypeScript Framework

End-to-end test automation framework for [SpreeCommerce demo](https://demo.spreecommerce.org/) built with Playwright and TypeScript.

## Quick Start

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install

# Run tests
npm test

# Run with UI
npm run test:ui
```

## Writing Tests

Use the provided fixtures for easy test writing:

```typescript
import { test, expect } from './src/fixtures';

test('Navigate to shop', async ({ page, homePage }) => {
  await page.goto('/');
  await homePage.navigateToShopAll();
  await expect(page.locator('.section-page-title')).toContainText('Shop All');
});
```

### Available Fixtures

- **`test`**: All page objects and utilities available

### Page Objects

- `homePage` - Main navigation
- `checkoutPage` - Checkout flow
- `cartPane` - Shopping cart
- `loginPane` - User login
- `signUpPane` - User registration
- `productDetailPage` - Product details

### Test Data

```typescript
import { testAddress, testCard, generateRandomEmail } from './src/utils/testData';

// Pre-configured test data from JSON files
const address = testAddress;  // Loaded from src/data/test-address.json
const card = testCard;        // Loaded from src/data/test-card.json
const email = generateRandomEmail(); // Generated unique email
```

## Commands

- `npm test` - Run all tests
- `npm run test:ui` - Interactive UI mode
- `npm run test:headed` - Run with visible browser
- `npm run test:debug` - Debug mode
- `npm run report` - Show test report

## CI/CD

GitHub Actions automatically runs tests on push/PR to `main` or `develop` branches. Test reports are uploaded as artifacts.