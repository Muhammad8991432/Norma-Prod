/**
 * // MPS
 * MPS Proxy API Client
 *
 * API Docs: https://norma-mps-int.d.dom.de/norma/dom/mps/docs
 * Swagger UI: https://norma-mps-int.d.dom.de/norma/etc/api/ui
 *
 * Authorization:
 * - Optional: methods endpoints (onetime/methods, recurring/methods) - since 1. Mar
 * - Required: stored payment operations (not implemented yet)
 *
 * Changelog:
 * - 2. Mar: MSISDN is required! Can be provided via auth token OR in JSON body.
 *   JSON body has priority. Format: "0160123456" (German number with leading 0)
 */

import axios from 'axios';
import { paymentConfig } from '@config/Payment';

/**
 * Create axios instance for MPS Payment Proxy
 */
export const mpsApiClient = axios.create({
  baseURL: paymentConfig.mps.baseUrl,
  timeout: paymentConfig.mps.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Create axios instance for MPS Content Proxy (different base URL)
 */
export const mpsContentApiClient = axios.create({
  baseURL: paymentConfig.mps.contentBaseUrl,
  timeout: paymentConfig.mps.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Create axios instance for ETC One API (different base URL)
 */
export const etcOneApiClient = axios.create({
  baseURL: paymentConfig.mps.etcOneBaseUrl,
  timeout: paymentConfig.mps.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * MPS API Service
 * Provides methods to interact with MPS proxy endpoints
 * Updated from Swagger docs (2. Mar)
 *
 * Flow: 1) Initialize (get tokens) → 2) Pay (onetime/recurring)
 */
const mpsApi = {
  // ============================================
  // 1.) METHODS - Get available payment methods
  // 2.) INITIALIZE - Get Braintree client tokens
  // ============================================

  /**
   * Get Braintree client token for specific payment method
   * 
   * Endpoint: POST /{recurring}/tokens/{method}
   * 
   * @param {string} type - 'onetime' or 'recurring'
   * @param {string} method - Payment method (creditcard, applepay, googlepay)
   * @returns {Promise<Object>} { clientToken, ... }
   */
  async getClientToken(type, method) {
    if (!paymentConfig.braintreePaymentMethods.includes(method)) {
      throw new Error(`Client token not available for payment method: ${method}`);
    }

    const endpoint =
      type === 'recurring'
        ? `${paymentConfig.endpoints.recurringTokens}/${method}`
        : `${paymentConfig.endpoints.onetimeTokens}/${method}`;

    const response = await mpsApiClient.post(endpoint);
    return response.data;
  },

  /**
   * Get Braintree client tokens for ALL payment methods
   * 
   * Endpoint: POST /{recurring}/tokens
   * 
   * @param {string} type - 'onetime' or 'recurring'
   * @returns {Promise<Object>} Tokens for all methods
   */
  async getAllClientTokens(type) {
    const endpoint =
      type === 'recurring'
        ? paymentConfig.endpoints.recurringTokens
        : paymentConfig.endpoints.onetimeTokens;

    const response = await mpsApiClient.post(endpoint);
    return response.data;
  },

  /**
   * Get available payment methods
   * 
   * Endpoint: GET /{type}/methods
   * 
   * @param {Object} options
   * @param {string} options.type - 'onetime' or 'recurring'
   * @param {boolean} options.applepay - Include Apple Pay (default: true)
   * @param {boolean} options.googlepay - Include Google Pay (default: true)
   * @returns {Promise<Object>} { methods: [...], stored?: {...} }
   */
  async getMethods({ type = 'onetime', applepay = true, googlepay = true } = {}) {
    const endpoint =
      type === 'recurring'
        ? paymentConfig.endpoints.recurringMethods
        : paymentConfig.endpoints.onetimeMethods;

    const params = {};
    if (!applepay) params.applepay = 'false';
    if (!googlepay) params.googlepay = 'false';

    const response = await mpsApiClient.get(endpoint, { params });
    return response.data;
  },

  // ============================================
  // 3.) PAY - Normalized payment endpoints
  // ============================================

  /**
   * Process one-time payment (normalized endpoint)
   * Handles Card/Apple/Google Pay AND PayPal automatically
   * - For PayPal: returns approval URL (redirectUrl)
   * - For Card/Google/Apple: directly reserves transaction
   *
   * Endpoint: POST /onetime
   *
   * @param {Object} payload
   * @param {string} payload.amount - Amount as string (e.g., "10.00")
   * @param {string} payload.method - Payment method (creditcard, applepay, googlepay, paypal)
   * @param {string} [payload.nonce] - Payment nonce (required for Card/Apple/Google)
   * @param {string} payload.msisdn - Phone number (REQUIRED - from auth token or body, body has priority)
   * @param {string} [payload.email] - Email address
   * @returns {Promise<Object>} Payment result or redirect URL
   */
  async processOnetime({ amount, method, nonce, msisdn, email, returnUrl, cancelUrl, errorUrl, client, unauthorized }) {
    const payload = {
      amount: String(amount),
      method,
      // email: email || 'testuser@example.com' // Simulate correct email if not provided
      email
    };

    // Include only client identifier for web flows; do NOT forward callback URLs
    // Keep callback URL forwarding commented out for possible future use
    // if (returnUrl) payload.returnUrl = returnUrl;
    // if (cancelUrl) payload.cancelUrl = cancelUrl;
    // if (errorUrl) payload.errorUrl = errorUrl;
    if (client) payload.client = client;
    if (unauthorized) payload.unauthorized = unauthorized;

    // Only include nonce for Braintree methods
    if (nonce) payload.nonce = nonce;
    if (msisdn) payload.msisdn = msisdn;

    const response = await mpsApiClient.post(paymentConfig.endpoints.onetime, payload);
    return response.data;
  },

  /**
   * Register recurring payment (normalized endpoint)
   * Handles Card/Apple/Google Pay AND PayPal automatically
   * - For PayPal: returns approval URL (redirectUrl)
   * - For Card/Google/Apple: directly registers mandate
   *
   * Endpoint: POST /recurring
   *
   * @param {Object} payload
   * @param {string} payload.amount - Amount as string (e.g., "10.00")
   * @param {string} payload.method - Payment method (creditcard, applepay, googlepay, paypal)
   * @param {string} [payload.nonce] - Payment nonce (required for Card/Apple/Google)
   * @param {string} payload.msisdn - Phone number (REQUIRED - from auth token or body, body has priority)
   * @param {boolean} [payload.unauthorized] - Flag for activation flow (auto-topup during SIM activation)
   * @returns {Promise<Object>} Registration result or redirect URL
   */
  async registerRecurring({ amount, method, nonce, msisdn, returnUrl, cancelUrl, errorUrl, client, unauthorized }) {
    const payload = {
      amount: String(amount),
      method
    };

    // Only include nonce for Braintree methods
    if (nonce) payload.nonce = nonce;
    if (msisdn) payload.msisdn = msisdn;

    // Include only client identifier for web flows; do NOT forward callback URLs
    // Keep callback URL forwarding commented out for possible future use
    // if (returnUrl) payload.returnUrl = returnUrl;
    // if (cancelUrl) payload.cancelUrl = cancelUrl;
    // if (errorUrl) payload.errorUrl = errorUrl;
    if (client) payload.client = client;

    // Add unauthorized flag for activation flow (tells backend this is auto-topup during SIM activation)
    if (unauthorized) payload.unauthorized = unauthorized;

    const response = await mpsApiClient.post(paymentConfig.endpoints.recurring, payload);

    return response.data;
  },

  // ============================================
  // 4.) RESULT - Polling payment result by lookup key
  // ============================================
  /**
   * Poll payment result by lookup key
   * 
   * Endpoint: GET /result/{lookup_key}
   * 
   * You should use /result/{lookup_key} when: completed === false from /onetime or /recurring
   * @param {string} lookupKey - The lookup key returned from payment initiation
   * @returns {Promise<Object>} PaymentStatus object or error info
   */
  async getPaymentResult(lookupKey) {
    if (!lookupKey) throw new Error('lookupKey is required');

    const endpoint = `${paymentConfig.endpoints.result}/${encodeURIComponent(lookupKey)}`;
    try {
      const response = await mpsApiClient.get(endpoint);

      // Always return statusCode and data for compatibility with polling hook
      return {
        statusCode: response.status,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        return {
          statusCode: error.response.status,
          data: error.response.data
        };
      }
      // Network or unknown error
      return {
        statusCode: 0,
        data: { message: error.message }
      };
    }
  },

  // ============================================
  // SERVICE - Utility endpoints
  // ============================================

  /**
   * Activate SIM card call in MPS-Proxy
   * 
   * Endpoint: POST /activation/activate-sim
   * 
   * @param {Object} payload
   * @returns {Promise<Object>} Activation result
   */
  async activateSim(payload) {
    try {
      const response = await mpsApiClient.post(paymentConfig.endpoints.activateSim, payload);
      return {
        statusCode: response.status,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        return {
          statusCode: error.response.status,
          data: error.response.data
        };
      }
      // Network or unknown error
      return {
        statusCode: 0,
        data: { message: error.message }
      };
    }
  },

  /**
   * Health check
   * 
   * Endpoint: GET /health
   * 
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    const response = await mpsApiClient.get(paymentConfig.endpoints.health);
    return response.data;
  },


  // ============================================
  // MPS Static Content API-Proxy calls (different base URL)
  // ============================================

  /**
   * Get campaign data from MPS Static Content API-Proxy.
   * 
   * Endpoint: GET /ads
   * 
   * Uses mpsContentApiClient (different base URL)
   * @returns {Promise<Object>} Campaign details data
   */
  async getCampaignDetailsData() {
    const response = await mpsContentApiClient.get(paymentConfig.endpoints.campaign);
    return {
      statusCode: response.status,
      data: response.data
    };
  },

  /**
   * Get (CMS) site settings - JSON objects - from MPS Static Content API-Proxy.
   * 
   * Endpoint: GET /static_content
   * 
   * Uses mpsContentApiClient (different base URL)
   * @returns {Promise<Object>} CMS site settings data
   */
  async getCmsSiteSettings() {
    const response = await mpsContentApiClient.get(paymentConfig.endpoints.cmsSiteSettings);
    return {
      statusCode: response.status,
      data: response.data
    };
  },

  /**
   * Load (CMS) key value pairs from MPS Static Content API-Proxy.
   * 
   * Endpoint: POST /static_content
   * 
   * @param {Object} payload
   * @param {string} payload.platform - Platform ("web")
   * @param {string} payload.lang - Language ("de")
   * @param {string} payload.client - Client (brand, e.g. "norma")
   * @returns {Promise<Object>} CMS key value pairs
   */
  async getCmsKeyValuePairs(payload) {
    try {
      const response = await mpsContentApiClient.post(paymentConfig.endpoints.cmsKeyValues, payload);
      return {
        statusCode: response.status,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        return {
          statusCode: error.response.status,
          data: error.response.data
        };
      }
      // Network or unknown error
      return {
        statusCode: 0,
        data: { message: error.message }
      };
    }
  },


  // ============================================
  // ETC One API-Proxy calls (different base URL)
  // ============================================

  /**
   * Get voucher topup history
   * 
   * Endpoint: GET /voucher/history
   * 
   * Uses etcOneApiClient (different base URL)
   * @returns {Promise<Object>} Voucher history data
   */
  async getVoucherHistory() {
    const response = await etcOneApiClient.get(paymentConfig.endpoints.voucherHistory);
    return response.data;
  },

  /**
   * Get customer with products
   * 
   * Endpoint: GET /customer/with-products
   * 
   * @returns {Promise<Object>} Customer with products data
   */
  async getCustomerWithProducts() {
    const response = await etcOneApiClient.get(paymentConfig.endpoints.customerWithProducts);
    return response.data;
  },

  /**
   * Delete payment method stored with ETC One (for recurring payments)
   *
   * Endpoint: DELETE /customer/payment
   *
   * @returns {Promise<Object>} Delete payment result
   */
  async deletePayment() {
    const response = await etcOneApiClient.delete(paymentConfig.endpoints.customerPayment);
    return {
      statusCode: response.status,
      data: response.data
    };
  }
};

export default mpsApi;
