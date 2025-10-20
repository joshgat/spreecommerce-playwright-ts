import { Address } from '../pages/checkout/AddressForm';
import { Card } from '../pages/checkout/PaymentForm';

/**
 * Generates a unique email address for testing purposes
 * @param {string} [prefix='spree_user'] - Prefix for the email address
 * @returns {string} A unique email address with timestamp
 * @example
 * ```typescript
 * const email = generateRandomEmail('testuser');
 * // Returns: testuser_1703123456789@example.com
 * ```
 */
export function generateRandomEmail(prefix = 'spree_user'): string {
  const ts = Date.now();
  return `${prefix}_${ts}@example.com`;
}

/**
 * Standard test address data for checkout testing
 * Uses a valid US address for testing purposes
 * 
 * @constant {Address} testAddress
 */
export const testAddress: Address = {
  firstName: 'John',
  lastName: 'Doe',
  address1: '123 Main St',
  city: 'New York',
  zipcode: '10001',
  country: 'United States',
  state: 'New York',
  phone: '2125550100',
};

/**
 * Validates that the provided address object has all required fields
 * @param {Address} address - Address object to validate
 * @returns {boolean} True if address is valid, false otherwise
 */
export function validateAddress(address: Address): boolean {
  const requiredFields: (keyof Address)[] = ['firstName', 'lastName', 'address1', 'city', 'zipcode', 'country', 'state'];
  return requiredFields.every(field => address[field] && address[field].trim().length > 0);
}

/**
 * Stripe test card details for payment processing
 * Uses Stripe's universal test card number that always succeeds
 * 
 * @constant {Card} testCard
 */
export const testCard: Card = {
  number: '4242 4242 4242 4242',
  name: 'JOHN DOE',
  expiry: '12/34',
  cvc: '123',
};

/**
 * Validates that the provided card object has all required fields
 * @param {Card} card - Card object to validate
 * @returns {boolean} True if card is valid, false otherwise
 */
export function validateCard(card: Card): boolean {
  const requiredFields: (keyof Card)[] = ['number', 'name', 'expiry', 'cvc'];
  return requiredFields.every(field => card[field] && card[field].trim().length > 0);
}

/**
 * Test configuration constants
 */
export const TEST_CONFIG = {
  /** Default timeout for page loads in milliseconds */
  PAGE_LOAD_TIMEOUT: 30000,
  /** Default timeout for element interactions in milliseconds */
  ELEMENT_TIMEOUT: 10000,
  /** Default timeout for network requests in milliseconds */
  NETWORK_TIMEOUT: 15000,
} as const;


