/**
 * // MPS
 * Braintree Client Wrapper
 * Handles Braintree SDK client initialization and management
 */

import braintree from 'braintree-web';

/**
 * Braintree client instance cache
 * Prevents multiple initializations with same token
 */
let clientInstance = null;
let currentToken = null;

/**
 * Initialize Braintree client
 * @param {string} clientToken - Client token from MPS API
 * @returns {Promise<Object>} Braintree client instance
 */
export async function createBraintreeClient(clientToken) {
  // Return cached instance if token hasn't changed
  if (clientInstance && currentToken === clientToken) {
    // console.log('🔵 Reusing existing Braintree client');
    return clientInstance;
  }

  try {
    // console.log('🔵 Creating new Braintree client...');

    const client = await braintree.client.create({
      authorization: clientToken
    });

    // Cache the client instance
    clientInstance = client;
    currentToken = clientToken;

    // console.log('✅ Braintree client created successfully');

    return client;
  } catch (error) {
    console.error('❌ Failed to create Braintree client:', error?.message || 'Unknown error');
    throw new Error('Failed to initialize payment system. Please try again.');
  }
}

/**
 * Get current Braintree client instance
 * @returns {Object|null} Current client instance or null
 */
export function getBraintreeClient() {
  return clientInstance;
}

/**
 * Clear Braintree client cache
 * Use when logging out or clearing payment session
 */
export function clearBraintreeClient() {
  // console.log('🔵 Clearing Braintree client cache');

  if (clientInstance && typeof clientInstance.teardown === 'function') {
    clientInstance.teardown((err) => {
      if (err) {
        console.error('Error tearing down Braintree client:', err?.message || 'Unknown error');
      }
    });
  }

  clientInstance = null;
  currentToken = null;
}

export default {
  createBraintreeClient,
  getBraintreeClient,
  clearBraintreeClient
};
