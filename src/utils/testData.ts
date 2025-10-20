import { Address, Card } from '../pages/CheckoutPage';
import testAddressData from '../data/test-address.json';
import testCardData from '../data/test-card.json';

/**
 * Generates a unique email address for testing purposes
 */
export function generateRandomEmail(prefix = 'spree_user'): string {
  const ts = Date.now();
  return `${prefix}_${ts}@example.com`;
}

/**
 * Test address data loaded from JSON
 */
export const testAddress: Address = testAddressData as Address;

/**
 * Test card data loaded from JSON
 */
export const testCard: Card = testCardData as Card;


