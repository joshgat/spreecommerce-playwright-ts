# spreecommerce-playwright-ts
Sample Test Automation Framework for Spree Commerce Website https://demo.spreecommerce.org/

## Features

- **Playwright Fixtures**: Simplified test writing with dependency injection
- **Page Object Model**: Clean, maintainable page objects
- **TypeScript Support**: Full type safety throughout
- **E2E Test Coverage**: Complete checkout flow testing
- **Modern Test Structure**: Organized, readable test files

## Commands

- Install deps: `npm ci`
- Run tests: `npm test`
- Open UI Mode: `npm run test:ui`
- Show last report: `npm run report`

## Fixtures Usage

This project uses Playwright fixtures to simplify test writing. Instead of manually instantiating page objects, you can inject them directly:

```typescript
import { test, expect } from './src/fixtures';

test('My test', async ({ page, homePage, checkoutPage, cartPane }) => {
  // All page objects are ready to use!
  await page.goto('/');
  await homePage.navigateToShopAll();
  // ... rest of your test
});
```

See [src/fixtures/README.md](src/fixtures/README.md) for detailed documentation.