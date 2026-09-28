/**
 * // MPS
 * Payment Service
 * Business logic layer for payment operations
 *
 * API Docs: https://norma-mps-int.d.dom.de/norma/dom/mps/docs
 * Provides high-level payment methods with proper validation and formatting
 */

import { paymentConfig } from '@config/Payment';
import mpsApi from './api';

/**
 * Payment Service
 * Handles payment flows for both Braintree SDK methods and redirect methods
 */
const paymentService = {
  /**
   * Check if payment method requires Braintree SDK (client token + nonce)
   * @param {string} paymentMethod
   * @returns {boolean}
   */
  isBraintreeMethod(paymentMethod) {
    return paymentConfig.braintreePaymentMethods.includes(paymentMethod);
  },

  /**
   * Check if payment method uses redirect flow
   * @param {string} paymentMethod
   * @returns {boolean}
   */
  isRedirectMethod(paymentMethod) {
    // Normalize to lowercase for case-insensitive comparison
    const normalizedMethod = String(paymentMethod).toLowerCase();
    const isRedirect = paymentConfig.redirectPaymentMethods.includes(normalizedMethod);
    // console.log('[paymentService.isRedirectMethod]', {
    //   method: paymentMethod,
    //   normalized: normalizedMethod,
    //   redirectMethods: paymentConfig.redirectPaymentMethods,
    //   isRedirect
    // });
    return isRedirect;
  },

  /**
   * Check if a payment method can be stored/selected as stored payment
   * Apple Pay and Google Pay cannot be selected as stored payment method
   * @param {string} paymentMethod
   * @returns {boolean}
   */
  canBeStored(paymentMethod) {
    return !paymentConfig.notStorablePaymentMethods.includes(paymentMethod);
  },

  /**
   * Format amount to string with 2 decimal places
   * MPS API requires amount as string
   * @param {number|string} amount
   * @returns {string}
   */
  formatAmount(amount) {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (Number.isNaN(numAmount) || numAmount < 0) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    return numAmount.toFixed(2);
  },

  /**
   * Validate payment amount against constraints
   * Amount 0 is allowed for storage-only flows (save payment method without charge)
   * @param {number|string} amount
   * @throws {Error} if amount is invalid
   */
  validateAmount(amount) {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // REMOVE: remove console.logs
    // console.log('paymentConfig.amounts.min', paymentConfig.amounts.min);
    // console.log('paymentConfig.amounts.max', paymentConfig.amounts.max);
    // console.log(`Validated amount: ${numAmount} (raw input: ${amount})`);

    if (Number.isNaN(numAmount)) {
      throw new Error('Amount must be a valid number');
    }

    // Amount 0 is special case for storing payment method only (no charge)
    if (numAmount === 0) {
      return;
    }

    if (numAmount < paymentConfig.amounts.min) {
      throw new Error(`Amount must be at least €${paymentConfig.amounts.min}`);
    }

    if (numAmount > paymentConfig.amounts.max) {
      throw new Error(`Amount cannot exceed €${paymentConfig.amounts.max}`);
    }
  },

  /**
   * Get Braintree client token for SDK initialization
   * @param {Object} options
   * @param {string} options.type - 'onetime' or 'recurring' (default: 'onetime')
   * @param {string} options.method - Payment method (creditcard, applepay, googlepay)
   * @returns {Promise<string>} Client token
   */
  async getClientToken({ type = 'onetime', method } = {}) {
    if (!this.isBraintreeMethod(method)) {
      throw new Error(`Client token not available for ${method}. Use redirect flow instead.`);
    }

    try {
      const response = await mpsApi.getClientToken(type, method);
      return response.clientToken;
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('Failed to get client token:', error);
      throw new Error('Failed to initialize payment. Please try again.');
    }
  },

  /**
   * Get available payment methods for the user
   *
   * Device Compatibility Flow:
   * 1. Frontend detects device capabilities (Apple Pay / Google Pay)
   * 2. Sends device info to backend via query parameters
   * 3. Backend can disable payment methods by returning empty list or
   *    can set applepay/googlepay to false to prevent frontend from offering them
   *
   * @param {Object} options
   * @param {string} options.type - 'onetime' or 'recurring' payment type
   * @param {boolean} options.applepay - Device supports Apple Pay (frontend detected)
   * @param {boolean} options.googlepay - Device supports Google Pay (frontend detected)
   * @returns {Promise<Object>} Available payment methods with optional restrictions
   *
   * Backend should:
   * - Check device capabilities (applepay, googlepay params)
   * - Verify merchant has enabled the methods
   * - Return list of available methods for this user/device combination
   */
  async getPaymentMethods({ type = 'onetime', applepay = true, googlepay = true } = {}) {
    try {
      // Debug: log incoming request for tracing
      // console.log('[paymentService.getPaymentMethods] called with:', { type, applepay, googlepay });

      // TESTING: Use mock without postal code to test dynamic fields
      // const { mockGetMethodsWithoutPostalCode } = await import('./mock');
      // return await mockGetMethodsWithoutPostalCode();

      // PRODUCTION: call real API with device compatibility info
      // Enforce: for recurring flows, wallets (Apple/Google Pay) are not supported
      const effectiveApple = type === 'recurring' ? false : applepay;
      const effectiveGoogle = type === 'recurring' ? false : googlepay;

      if (type === 'recurring') {
        // console.log(
        //   '[paymentService.getPaymentMethods] recurring flow detected — forcing wallets OFF'
        // );
      }

      // console.log('[paymentService.getPaymentMethods] effective device flags:', {
      //   applepay: effectiveApple,
      //   googlepay: effectiveGoogle
      // });

      const result = await mpsApi.getMethods({
        type,
        applepay: effectiveApple,
        googlepay: effectiveGoogle
      });

      // Log backend response details for debugging
      // console.log('[paymentService.getPaymentMethods] backend response:', {
      //   methods: result?.methods,
      //   stored: result?.stored,
      //   creditcard_hint: result?.creditcard_hint
      // });

      return result;
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('[paymentService.getPaymentMethods] Failed to get payment methods:', error);
      throw new Error('Failed to load payment methods. Please try again.');
    }
  },

  /**
   * Process one-time payment (normalized endpoint)
   * Handles ALL payment methods - Card/Apple/Google Pay AND PayPal
   * - For PayPal: returns { redirectUrl, ... } - redirect user to PayPal
   * - For Card/Google/Apple: returns { checkoutSessionId, state, ... }
   *
   * @param {Object} params
   * @param {number|string} params.amount - Payment amount
   * @param {string} params.method - Payment method (creditcard, applepay, googlepay, paypal)
   * @param {string} [params.nonce] - Payment nonce (required for Card/Apple/Google)
   * @param {string} params.msisdn - Phone number (REQUIRED - format: "0160123456")
   * @param {string} [params.email] - Email address (required for public online topup)
   * @param {boolean} [params.unauthorized] - Flag for unauthorized payment (public online topup)
   * @returns {Promise<Object>} Payment result or redirect URL
   */
  async processOneTimePayment({ amount, method, nonce, msisdn, email, unauthorized }) {
    // console.log('processOneTimePayment called with:', {
    //   amount,
    //   method,
    //   nonce,
    //   msisdn,
    //   email,
    //   unauthorized
    // });

    // Validate amount
    this.validateAmount(amount);
    const formattedAmount = this.formatAmount(amount);

    // Validate nonce for Braintree methods
    if (this.isBraintreeMethod(method) && !nonce) {
      throw new Error('Payment nonce is required for Card/Apple/Google Pay');
    }

    // if (this.isBraintreeMethod(method) && !email) {
    //   throw new Error('Email is required for Card/Apple/Google Pay payments');
    // }

    let apiPayload; // Declare outside try block for access in catch block
    try {
      // const simulatedEmail = email || 'testuser@test.test'; // REMOVE after testing

      apiPayload = {
        amount: formattedAmount,
        method,
        nonce,
        msisdn,
        email,
        ...(unauthorized ? { unauthorized } : {})
      };

      // Mark this as a web client flow for redirect methods (do NOT forward URLs)
      // Always signal web client for redirect methods so backend can detect browser flows
      // console.log('[paymentService] Before client check:', {
      //   method,
      //   isRedirectMethod: this.isRedirectMethod(method),
      //   payloadBefore: apiPayload
      // });
      if (this.isRedirectMethod(method)) {
        apiPayload.client = 'web';
        // console.log('[paymentService] Added client:web to payload');
      } else {
        // console.log('[paymentService] NOT a redirect method - client NOT added');
      }

      // console.log('[paymentService] processOneTimePayment final payload:', apiPayload);

      const result = await mpsApi.processOnetime(apiPayload);

      // Check if redirect is needed (PayPal)
      const requiresRedirect = this.isRedirectMethod(method) || !!result.redirectUrl;

      // For redirect payments, return early (success determined after redirect)
      if (requiresRedirect) {
        return {
          success: true,
          method,
          requiresRedirect,
          ...result
        };
      }

      // Compute state early (before checking completed)
      const state = result.state?.toUpperCase();

      // Handle completed=true with state checks
      if (result.completed === true) {
        if (state === 'ERROR') {
          // show error screen
          // console.warn('Payment completed with ERROR state:', result);
          return {
            success: false,
            error: true,
            method,
            requiresRedirect,
            ...result
          };
        }

        if (state === 'CANCELLED') {
          // user cancelled (PayPal) — do not show success; let caller handle cancellation
          return {
            success: false,
            cancelled: true,
            method,
            requiresRedirect,
            ...result
          };
        }

        // any other completed=true state -> success screen
        return {
          success: true,
          method,
          requiresRedirect,
          ...result
        };
      }

      // For completed === false, don't validate state yet
      // completed=false only indicates: call /result endpoint
      // Just return the result so caller can poll

      return {
        success: true,
        method,
        requiresRedirect,
        ...result
      };
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('One-time payment failed:', error);
      throw new Error(
        error.response?.data?.message || error.message || 'Payment failed. Please try again.'
      );
    }
  },

  /**
   * Register recurring payment (auto top-up)
   * Handles ALL payment methods - Card/Apple/Google Pay AND PayPal
   * - For PayPal: returns { redirectUrl, ... } - redirect user to PayPal
   * - For Card/Google/Apple: returns { checkoutSessionId, state, paymentMethodDetails, ... }
   *
   * @param {Object} params
   * @param {number|string} params.amount - Default top-up amount
   * @param {string} params.method - Payment method (creditcard, applepay, googlepay, paypal)
   * @param {string} [params.nonce] - Payment nonce (required for Card/Apple/Google)
   * @param {string} params.msisdn - Phone number (REQUIRED - format: "0160123456")
   * @returns {Promise<Object>} Registration result or redirect URL
   */
  async registerRecurringPayment({ amount, method, nonce, msisdn, unauthorized }) {
    // DEBUG: Log all incoming parameters to verify unauthorized is passed
    // console.log('[paymentService] registerRecurringPayment received:', {
    //   amount,
    //   method,
    //   nonce: nonce ? '***NONCE_PRESENT***' : null,
    //   msisdn,
    //   unauthorized
    // });

    // Validate amount
    this.validateAmount(amount);
    const formattedAmount = this.formatAmount(amount);

    // Validate nonce for Braintree methods
    if (this.isBraintreeMethod(method) && !nonce) {
      throw new Error('Payment nonce is required for Card/Apple/Google Pay');
    }

    let apiPayload; // Declare outside try block for access in catch block
    try {
      apiPayload = {
        amount: formattedAmount,
        method,
        nonce,
        msisdn,
        ...(unauthorized ? { unauthorized } : {})
      };

      // Mark this as a web client flow for redirect methods (do NOT forward URLs)
      // Always signal web client for redirect methods so backend can detect browser flows
      // console.log('[paymentService] Before client check (recurring):', {
      //   method,
      //   isRedirectMethod: this.isRedirectMethod(method),
      //   payloadBefore: apiPayload
      // });
      if (this.isRedirectMethod(method)) {
        apiPayload.client = 'web';
        // console.log('[paymentService] Added client:web to recurring payload');
      } else {
        // console.log('[paymentService] NOT a redirect method - client NOT added to recurring');
      }

      // console.log('[paymentService] registerRecurringPayment final payload:', apiPayload);

      const result = await mpsApi.registerRecurring(apiPayload);

      // Log the response details for debugging
      // console.log('[paymentService.registerRecurring] Response received:', {
      //   completed: result.completed,
      //   state: result.state,
      //   lookup_key: result.lookup_key ? `${result.lookup_key.substring(0, 16)}...` : null,
      //   error: result.error,
      //   redirectUrl: result.redirectUrl ? 'present' : null,
      //   timestamp: new Date().toISOString()
      // });

      // Check if redirect is needed (PayPal)
      const requiresRedirect = this.isRedirectMethod(method) || !!result.redirectUrl;

      // For redirect payments, return early (success determined after redirect)
      if (requiresRedirect) {
        return {
          success: true,
          method,
          requiresRedirect,
          ...result
        };
      }

      // Compute state early (before checking completed)
      const state = result.state?.toUpperCase();

      // Handle completed=true with state checks
      if (result.completed === true) {
        if (state === 'ERROR') {
          // show error screen
          // console.warn('Payment completed with ERROR state:', result);
          return {
            success: false,
            error: true,
            method,
            requiresRedirect,
            ...result
          };
        }

        if (state === 'CANCELLED') {
          // user cancelled (PayPal) — do not show success; let caller handle cancellation
          return {
            success: false,
            cancelled: true,
            method,
            requiresRedirect,
            ...result
          };
        }

        // any other completed=true state -> success screen
        return {
          success: true,
          method,
          requiresRedirect,
          ...result
        };
      }

      // For completed === false, don't validate state yet
      // completed=false only indicates: call /result endpoint
      // Just return the result so caller can poll
      return {
        success: true,
        method,
        requiresRedirect,
        ...result
      };
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('[paymentService.registerRecurring] API Error Details:', {
      //   status: error.response?.status,
      //   statusText: error.response?.statusText,
      //   errorMessage: error.response?.data?.message || error.message,
      //   fullErrorData: error.response?.data,
      //   requestPayload: apiPayload,
      //   timestamp: new Date().toISOString()
      // });
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to register auto top-up. Please try again.'
      );
    }
  },

  /**
   * Validate payment result from /result endpoint
   * Checks state field when completed=true (polling scenario)
   * @param {Object} result - Result from /result/{lookup_key} call
   * @returns {Object} Validated result with success/cancelled flags
   * @throws {Error} if state is ERROR
   */
  validatePaymentResult(result) {
    if (!result) {
      return {
        success: false,
        error: true,
        message: 'No payment result provided'
      };
    }

    // Only validate when completed=true (polling finished)
    if (result.completed !== true) {
      // Still polling, return as-is
      return result;
    }

    const state = result.state?.toUpperCase();

    // Check state for completed results
    if (state === 'ERROR') {
      // console.warn('Payment result returned ERROR state:', result);
      return {
        success: false,
        error: true,
        ...result
      };
    }

    if (state === 'CANCELLED') {
      return {
        success: false,
        cancelled: true,
        ...result
      };
    }

    // Any other completed=true state is success
    return {
      success: true,
      ...result
    };
  },

  // MPS // TODO for account pages
  /**
   * Add a payment method (amount "0" logic)
   * To be used in account pages for saving a payment method without top-up.
   * @param {Object} params - Same as registerRecurringPayment, but always uses amount "0"
   */
  async handleAddPaymentMethod({ method, nonce, msisdn }) {
    // Log the request payload right before sending
    // console.log('[paymentService.handleAddPaymentMethod] Sending storage-only payment:', {
    //   amount: '0',
    //   method,
    //   nonce: nonce ? `${nonce.substring(0, 20)}...` : null,
    //   msisdn,
    //   timestamp: new Date().toISOString()
    // });

    // Calls registerRecurringPayment with amount "0"
    return this.registerRecurringPayment({
      amount: '0', // amount "0" indicates storage-only flow (no charge, just save payment method)
      method,
      nonce,
      msisdn
    });
  },

  /**
   * Change the amount for a stored auto top-up.
   *
   * To be used in account pages in "manage auto top-up" section.
   *
   * @param {string} amount - New amount for the auto top-up
   * @returns {Promise<Object>} Result of the amount change operation
   */
  async updateAutoTopupAmount(amount) {
    // Validate amount
    this.validateAmount(amount);
    const formattedAmount = this.formatAmount(amount);

    try {
      const apiPayload = {
        amount: formattedAmount,
        method: 'stored'
      };

      const result = await mpsApi.registerRecurring(apiPayload);

      // Compute state early (before checking completed)
      const state = result.state?.toUpperCase();

      // Handle completed=true with state checks
      if (result.completed === true) {
        if (state === 'ERROR') {
          // show error screen
          // REMOVE: remove console.warn
          // console.warn('Updating auto top-up amount completed with ERROR state:', result);
          return {
            success: false,
            error: true,
            method: 'stored',
            ...result
          };
        }

        // REMOVE: we do not have a CANCELLED state for amount updates
        // UNUSED: remove before going live
        // if (state === 'CANCELLED') {
        //   // user cancelled (PayPal) — do not show success; let caller handle cancellation
        //   return {
        //     success: false,
        //     cancelled: true,
        //     method: "stored",
        //     ...result
        //   };
        // }

        // any other completed=true state -> success screen
        return {
          success: true,
          method: 'stored',
          ...result
        };
      }

      // For completed === false, this is handled as an error.
      return {
        success: false,
        error: true,
        method: 'stored',
        ...result
      };
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('Updating auto top-up amount failed:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update auto top-up amount. Please try again.'
      );
    }
  },

  /**
   * Call /activation/activate-sim (in MPS Payment Proxy!)
   *
   * @param {Object} payload request body data for activate-sim endpoint, e.g. { msisdn ... }
   * @returns {Promise<Object>} activate-sim response data
   * @throws {Error} if call is not successful
   */
  async handleActivateSim(payload) {
    try {
      return await mpsApi.activateSim(payload);
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('activate SIM in MPS Payment Proxy failed:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to activate SIM. Please try again.'
      );
    }
  },

  /**
   * Get campaign details data (from MPS Content Proxy!)
   *
   * @returns {Promise<Object>} campaign details data
   * @throws {Error} if call is not successful
   */
  async getCampaignData() {
    try {
      return await mpsApi.getCampaignDetailsData();
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('get campaign details in MPS Content Proxy failed:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to get campaign details. Please try again.'
      );
    }
  },

  /**
   * Get CMS site settings (from MPS Content Proxy!)
   *
   * @returns {Promise<Object>} CMS site settings response data
   * @throws {Error} if call is not successful
   */
  async getStaticContentSiteSettings() {
    try {
      return await mpsApi.getCmsSiteSettings();
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('get CMS site settings in MPS Content Proxy failed:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to get site settings. Please try again.'
      );
    }
  },

  /**
   * Get CMS key value pairs (from MPS Content Proxy!)
   *
   * @param {Object} payload request body data for CMS key value pairs endpoint
   * @returns {Promise<Object>} CMS key value pairs response data
   * @throws {Error} if call is not successful
   */
  async getStaticContentKeyValuePairs(payload) {
    try {
      return await mpsApi.getCmsKeyValuePairs(payload);
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('get CMS key value pairs in MPS Content Proxy failed:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to get key value pairs. Please try again.'
      );
    }
  },

  /**
   * Get voucher/topup history
   * @returns {Promise<Object>} Voucher history data
   */
  async getVoucherHistory() {
    try {
      return await mpsApi.getVoucherHistory();
    } catch (error) {
      // REMOVE: remove console.log
      // console.error('Failed to get voucher history:', error);
      throw new Error('Failed to load voucher history. Please try again.');
    }
  },

  /**
   * Get customer with products
   * @param {Object} [options]
   * @returns {Promise<Object>} Customer with products data
   */
  async getCustomerWithProducts() {
    try {
      return await mpsApi.getCustomerWithProducts();
    } catch (error) {
      // console.error('Failed to get customer with products:', error);
      throw new Error('Failed to load customer with products. Please try again.');
    }
  },

  /**
   * Delete stored payment method from ETC One (for recurring payments)
   * @returns {Promise<Object>} Delete payment method result
   */
  async deletePaymentMethod() {
    try {
      return await mpsApi.deletePayment();
    } catch (error) {
      // console.error('Failed to delete stored payment method:', error);
      throw new Error('Failed to delete stored payment method. Please try again.');
    }
  },

  /**
   * Handle redirect back from PayPal
   * Process query parameters and verify payment status
   * @param {Object} queryParams - URL query parameters
   * @returns {Object} Payment status information
   */
  handlePaymentCallback(queryParams) {
    const { status, checkoutSessionId, state } = queryParams;

    if (status === 'success' || state === 'FINALIZED') {
      return {
        success: true,
        message: 'Payment completed successfully',
        checkoutSessionId,
        state
      };
    }

    if (status === 'cancelled') {
      return {
        success: false,
        cancelled: true,
        message: 'Payment was cancelled',
        checkoutSessionId
      };
    }

    return {
      success: false,
      message: 'Payment status unknown',
      checkoutSessionId,
      state
    };
  },

  // Expose getPaymentResult for polling hook
  getPaymentResult: mpsApi.getPaymentResult
};

export default paymentService;
