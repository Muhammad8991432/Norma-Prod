/**
 * // MPS
 * Payment configuration for MPS/Braintree integration
 *
 * API Docs: https://norma-mps-int.d.dom.de/norma/dom/mps/docs
 * Swagger UI: https://norma-mps-int.d.dom.de/norma/etc/api/ui
 *
 * Changelog:
 * - 1. Mar: methods endpoint has optional authentication
 * - 25. Feb: normalized endpoints for onetime and recurring payments
 */

export const paymentConfig = {
  // MPS Proxy Backend Configuration
  mps: {
    // MPS: change default values to final PSA prod URLs before release, use env vars for flexibility
    baseUrl: process.env.REACT_APP_MPS_PROXY_URL || 'https://norma-mps-int.c.dom.de/norma/dom/mps',
    contentBaseUrl: process.env.REACT_APP_BACKEND_URL || 'https://norma-mps-int.d.dom.de/norma/dom/content',
    etcOneBaseUrl: process.env.REACT_APP_MO_URL || 'https://norma-mps-int.d.dom.de/norma/etc/api',
    timeout: 30000, // 30 seconds
  },

  endpoints: {
    // -----------------------------------------------------------------------
    // MPS API Payment Endpoints (updated 2. Mar)
    // (from Swagger - https://norma-mps-int.d.dom.de/norma/dom/mps/docs)
    // Base pattern: /{recurring}/* where recurring = "recurring" | "onetime"
    // Each endpoint uses /mps prefix to distinguish from MPS Static Content
    // API-Proxy.
    // -----------------------------------------------------------------------

    // 1.) Get available Methods
    // -------------------------
    // GET /{recurring}/methods - List available payment methods
    // Query params: ?applepay=false&googlepay=false
    onetimeMethods: '/onetime/methods', // GET
    recurringMethods: '/recurring/methods', // GET

    // 2.) Initialize - Get Braintree client tokens
    // --------------------------------------------

    // POST /{recurring}/tokens/{method} - Get token for specific method
    // POST /{recurring}/tokens - Get tokens for all methods
    onetimeTokens: '/onetime/tokens', // POST - all tokens
    recurringTokens: '/recurring/tokens', // POST - all tokens

    // 3.) Pay - Normalized endpoints (handles Card/PayPal automatically)
    // ------------------------------------------------------------------

    // POST /{onetime} - Body: { amount, method, msisdn?, meta?, nonce? }
    // For PayPal: returns approval URL
    // For Card/Google/Apple: directly reserves transaction
    onetime: '/onetime', // POST - one-time payment
    recurring: '/recurring', // POST - recurring registration

    // 4.) Result - Poll payment result by lookup key
    // ----------------------------------------------
    result: '/result', // GET /result/{lookup_key}

    // Service endpoints
    // -----------------
    activateSim: '/activation/activate-sim', // POST - activate SIM card
    storedPayment: '/stored/payment', // GET - retrieve stored payment details
    health: '/health', // GET - health check


    // -----------------------------------------------------------------------
    // MPS API Static Content Endpoints
    // (from Swagger - https://norma-mps-int.d.dom.de/norma/dom/content/docs)
    // Base pattern: /{recurring}/* where recurring = "recurring" | "onetime"
    // Each endpoint uses /mps prefix to distinguish from MPS Static Content
    // API-Proxy.
    // -----------------------------------------------------------------------
    campaign: '/ads', // GET - campaign details
    cmsSiteSettings: '/static_content', // GET - JSONs (CMS site settings)
    cmsKeyValues: '/static_content', // POST - CMS key values


    // -----------------------------------------------------------------------
    // calls to ETC One API-Proxy
    // -----------------------------------------------------------------------
    voucherHistory: '/voucher/history', // GET - voucher/topup history
    customerWithProducts: '/customer/with-products', // GET - customer with products
    customerPayment: '/customer/payment', // DELETE - remove payment method stored with ETC One (for recurring payments)
  },

  // Supported payment methods
  // NOTE: PayPal uses redirect flow, others use Braintree SDK
  paymentMethods: {
    CREDIT_CARD: 'creditcard',
    APPLE_PAY: 'applepay',
    GOOGLE_PAY: 'googlepay',
    PAYPAL: 'paypal'
  },

  // Payment methods that require Braintree client token and SDK
  braintreePaymentMethods: ['creditcard', 'applepay', 'googlepay'],

  // Payment methods that use redirect flow (no client token needed)
  redirectPaymentMethods: ['paypal'],

  // Methods that CANNOT be stored/selected as stored payment
  // Frontend: display stored payment info but only allow selection if NOT in this list
  notStorablePaymentMethods: ['applepay', 'googlepay'],

  // MPS: this will come from cms json
  // Payment method display names placeholder
  paymentMethodLabels: {
    creditcard: 'Credit Card',
    applepay: 'Apple Pay',
    googlepay: 'Google Pay',
    paypal: 'PayPal'
  },

  // MPS: this is just a placeholder, adjust based on layouts
  // Braintree Hosted Fields configuration (frontend styling - adjust to match design system)
  braintree: {
    hostedFields: {
      styles: {
        input: {
          'font-size': '16px',
          'font-family': 'FFRealText, Arial, sans-serif',
          color: '#2d2d2d'
        },
        ':focus': {
          color: '#000000'
        },
        '.valid': {
          color: '#2d2d2d'
        },
        '.invalid': {
          color: '#d9534f'
        }
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: 'nc_global_wrapper_cardnumber_plc',
          // aria-label is injected as the iframe title — required for NVDA Forms Mode
          // resolved via the same 't' translation function as placeholder
          'aria-label': 'nc_global_wrapper_cardnumber_lbl'
        },
        cvv: {
          selector: '#cvv',
          placeholder: 'nc_global_wrapper_creditcard_cvv_plc',
          'aria-label': 'nc_global_wrapper_creditcard_cvv_lbl',
          // maskInput: true, //  applies visual masking only when the field is NOT focused
          // type: 'password' // the browser renders bullets while the field is focused and while typing
        },
        expirationDate: {
          selector: '#expiration-date',
          placeholder: 'nc_global_wrapper_expiredate_plc',
          'aria-label': 'nc_global_wrapper_expiredate_lbl'
        },
        postalCode: {
          selector: '#postal-code',
          placeholder: 'nc_global_wrapper_zip_plc',
          'aria-label': 'nc_global_wrapper_zip_lbl'
        }
      }
    }
  },

  // MPS: adjust
  // Default callback URLs (frontend routing - adjust based on your app structure)
  callbacks: {
    success: '/topup/payment-success',
    error: '/topup/payment-error',
    cancel: '/topup/payment-cancelled'
  },

  // MPS: adjust
  // Payment amount constraints (business logic - verify with requirements)
  amounts: {
    min: process.env.REACT_APP_MPS_MIN_AMOUNT || 5, // Minimum top-up amount in EUR
    max: process.env.REACT_APP_MPS_MAX_AMOUNT || 250, // Maximum top-up amount in EUR
    default: 10, // Default suggested amount
    suggestions: [10, 20, 50, 100] // Quick select amounts
  },

  // MPS: adjust
  // Error codes mapping (frontend assumptions - adjust based on actual MPS error responses)
  errorCodes: {
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    INVALID_AMOUNT: 'INVALID_AMOUNT',
    PAYMENT_DECLINED: 'PAYMENT_DECLINED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    INVALID_PAYMENT_METHOD: 'INVALID_PAYMENT_METHOD',
    RECURRING_REGISTRATION_FAILED: 'RECURRING_REGISTRATION_FAILED',
    RECURRING_CHARGE_FAILED: 'RECURRING_CHARGE_FAILED'
  },

  // MPS: adjust
  // Error messages for user display (adjust based on UX requirements)
  errorMessages: {
    PAYMENT_FAILED: 'Payment failed. Please try again.',
    INVALID_AMOUNT: 'Invalid payment amount. Please check and try again.',
    PAYMENT_DECLINED: 'Payment was declined. Please check your payment details.',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    INVALID_PAYMENT_METHOD: 'Selected payment method is not available.',
    RECURRING_REGISTRATION_FAILED: 'Failed to register auto top-up. Please try again.',
    RECURRING_CHARGE_FAILED: 'Auto top-up payment failed. Please check your payment method.',
    DEFAULT: 'An error occurred during payment. Please try again.'
  }
};

export default paymentConfig;
