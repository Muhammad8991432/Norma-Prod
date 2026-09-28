/**
 * Local App Configuration Provider
 * Replaces @dom-digital-online-media/dom-app-config-sdk
 *
 * This module provides environment configuration from local .env files
 * instead of fetching from a remote server.
 */
import React, { createContext, useContext, useMemo } from 'react';

// ============================================================================
// App Config Context & Provider
// ============================================================================

const AppConfigContext = createContext({
  env: {},
  loading: false,
  config: {}
});

/**
 * Collects all REACT_APP_* variables from process.env
 * CRA automatically embeds these at build time
 */
const getEnvVariables = () => {
  const env = {};
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('REACT_APP_') || key === 'NODE_ENV') {
      env[key] = process.env[key];
    }
  });
  return env;
};

/**
 * AppConfigProvider - Replacement for AppManager from the SDK
 * Provides environment variables from local .env files
 */
export function AppConfigProvider({ children, config }) {
  const env = useMemo(() => getEnvVariables(), []);
  const value = useMemo(
    () => ({
      env,
      loading: false, // No async loading needed with local env vars
      config
    }),
    [env, config]
  );

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
}

/**
 * useAppConfig - Hook to access app configuration
 * Returns { env, loading } to match SDK interface
 */
export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  return {
    env: context.env || {},
    loading: context.loading ?? false
  };
};

// ============================================================================
// HTTP Status Codes
// ============================================================================

export const StatusCodes = {
  // -------------------------------------------------------------------------
  // 1xx Informational
  // -------------------------------------------------------------------------

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
   *
   * This interim response indicates that everything so far is OK and that the client should continue with the request or
   * ignore it if it is already finished.
   */
  CONTINUE: 100,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.2
   *
   * This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
   */
  SWITCHING_PROTOCOLS: 101,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.1
   *
   * This code indicates that the server has received and is processing the request, but no response is available yet.
   */
  PROCESSING: 102,

  // -------------------------------------------------------------------------
  // 2xx Success
  // -------------------------------------------------------------------------

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
   *
   * The request has succeeded. The meaning of a success varies depending on the HTTP method:
   * GET: The resource has been fetched and is transmitted in the message body.
   * HEAD: The entity headers are in the message body.
   * POST: The resource describing the result of the action is transmitted in the message body.
   * TRACE: The message body contains the request message as received by the server
   */
  OK: 200,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
   *
   * The request has succeeded and a new resource has been created as a result of it.
   * This is typically the response sent after a PUT request.
   */
  CREATED: 201,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
   *
   * The request has been received but not yet acted upon.
   * It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response
   * indicating the outcome of processing the request.
   *
   * It is intended for cases where another process or server handles the request, or for batch processing.
   */
  ACCEPTED: 202,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.4
   *
   * This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response.
   */
  NON_AUTHORITATIVE_INFORMATION: 203,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
   *
   * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
   */
  NO_CONTENT: 204,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.6
   *
   * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
   */
  RESET_CONTENT: 205,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.1
   *
   * This response code is used because of range header sent by the client to separate download into multiple streams.
   */
  PARTIAL_CONTENT: 206,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.2
   *
   * A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.
   */
  MULTI_STATUS: 207,

  // -------------------------------------------------------------------------
  // 3xx Redirection
  // -------------------------------------------------------------------------

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.1
   *
   * The request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
   */
  MULTIPLE_CHOICES: 300,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.2
   *
   * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
   */
  MOVED_PERMANENTLY: 301,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
   *
   * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
   */
  MOVED_TEMPORARILY: 302,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.4
   *
   * Server sent this response to directing client to get requested resource to another URI with an GET request.
   */
  SEE_OTHER: 303,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
   *
   * This is used for caching purposes. It is telling to client that response has not been modified.
   * So, client can continue to use same cached version of response.
   */
  NOT_MODIFIED: 304,
  /**
   * @deprecated
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.6
   *
   * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
   */
  USE_PROXY: 305,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.7
   *
   * Server sent this response to directing client to get requested resource to another URI with same method that used prior request.
   * This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used:
   *  if a POST was used in the first request, a POST must be used in the second request.
   */
  TEMPORARY_REDIRECT: 307,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7538#section-3
   *
   * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header.
   * This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used:
   * if a POST was used in the first request, a POST must be used in the second request.
   */
  PERMANENT_REDIRECT: 308,

  // -------------------------------------------------------------------------
  // 4xx Client Errors
  // -------------------------------------------------------------------------

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
   *
   * This response means that server could not understand the request due to invalid syntax.
   */
  BAD_REQUEST: 400,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
   *
   * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
   */
  UNAUTHORIZED: 401,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.2
   *
   * This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
   */
  PAYMENT_REQUIRED: 402,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
   *
   * The client does not have access rights to the content,
   * i.e. they are unauthorized, so server is rejecting to give proper response.
   * Unlike 401, the client's identity is known to the server.
   */
  FORBIDDEN: 403,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
   *
   * The server can not find requested resource.
   * In the browser, this means the URL is not recognized.
   * In an API, this can also mean that the endpoint is valid but the resource itself does not exist.
   * Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client.
   * This response code is probably the most famous one due to its frequent occurence on the web.
   */
  NOT_FOUND: 404,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
   *
   * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
   */
  METHOD_NOT_ALLOWED: 405,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.6
   *
   * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
   */
  NOT_ACCEPTABLE: 406,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.2
   *
   * This is similar to 401 but authentication is needed to be done by a proxy.
   */
  PROXY_AUTHENTICATION_REQUIRED: 407,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.7
   *
   * This response is sent on an idle connection by some servers, even without any previous request by the client.
   * It means that the server would like to shut down this unused connection.
   * This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9,
   * use HTTP pre-connection mechanisms to speed up surfing.
   * Also note that some servers merely shut down the connection without sending this message.
   */
  REQUEST_TIMEOUT: 408,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
   *
   * This response is sent when a request conflicts with the current state of the server.
   */
  CONFLICT: 409,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.9
   *
   * This response would be sent when the requested content has been permenantly deleted from server, with no forwarding address.
   * Clients are expected to remove their caches and links to the resource.
   * The HTTP specification intends this status code to be used for "limited-time, promotional services".
   * APIs should not feel compelled to indicate resources that have been deleted with this status code.
   */
  GONE: 410,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.10
   *
   * The server rejected the request because the Content-Length header field is not defined and the server requires it.
   */
  LENGTH_REQUIRED: 411,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.2
   *
   * The client has indicated preconditions in its headers which the server does not meet.
   */
  PRECONDITION_FAILED: 412,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.11
   *
   * Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
   */
  REQUEST_TOO_LONG: 413,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.12
   *
   * The URI requested by the client is longer than the server is willing to interpret.
   */
  REQUEST_URI_TOO_LONG: 414,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.13
   *
   * The media format of the requested data is not supported by the server, so the server is rejecting the request.
   */
  UNSUPPORTED_MEDIA_TYPE: 415,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.4
   *
   * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
   */
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.14
   *
   * This response code means the expectation indicated by the Expect request header field can't be met by the server.
   */
  EXPECTATION_FAILED: 417,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc2324#section-2.3.2
   *
   * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
   */
  IM_A_TEAPOT: 418,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
   *
   * The 507 (Insufficient Storage) status code means the method could not be performed on the resource because the server
   * is unable to store the representation needed to successfully complete the request.
   * This condition is considered to be temporary.
   * If the request which received this status code was the result of a user action,
   * the request MUST NOT be repeated until it is requested by a separate user action.
   */
  INSUFFICIENT_SPACE_ON_RESOURCE: 419,
  /**
   * @deprecated
   * Official Documentation @ https://tools.ietf.org/rfcdiff?difftype=--hwdiff&url2=draft-ietf-webdav-protocol-06.txt
   *
   * A deprecated response used by the Spring Framework when a method has failed.
   */
  METHOD_FAILURE: 420,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
   *
   * The request was well-formed but was unable to be followed due to semantic errors.
   */
  UNPROCESSABLE_ENTITY: 422,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.4
   *
   * The resource that is being accessed is locked.
   */
  LOCKED: 423,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.5
   *
   * The request failed due to failure of a previous request.
   */
  FAILED_DEPENDENCY: 424,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-3
   *
   * The origin server requires the request to be conditional.
   * Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server,
   * when meanwhile a third party has modified the state on the server, leading to a conflict.
   */
  PRECONDITION_REQUIRED: 428,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
   *
   * The user has sent too many requests in a given amount of time ("rate limiting").
   */
  TOO_MANY_REQUESTS: 429,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-5
   *
   * The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7725
   *
   * The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.
   */
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,

  // -------------------------------------------------------------------------
  // 5xx Server Errors
  // -------------------------------------------------------------------------

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
   *
   * The server encountered an unexpected condition that prevented it from fulfilling the request.
   */
  INTERNAL_SERVER_ERROR: 500,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
   *
   * The request method is not supported by the server and cannot be handled.
   * The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
   */
  NOT_IMPLEMENTED: 501,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
   *
   * This error response means that the server,
   * while working as a gateway to get a response needed to handle the request, got an invalid response.
   */
  BAD_GATEWAY: 502,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.4
   *
   * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.
   * Note that together with this response, a user-friendly page explaining the problem should be sent.
   * This responses should be used for temporary conditions and the Retry-After: HTTP header should,
   *  if possible, contain the estimated time before the recovery of the service.
   * The webmaster must also take care about the caching-related headers that are sent along with this response,
   *  as these temporary condition responses should usually not be cached.
   */
  SERVICE_UNAVAILABLE: 503,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
   *
   * This error response is given when the server is acting as a gateway and cannot get a response in time.
   */
  GATEWAY_TIMEOUT: 504,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.6
   *
   * The HTTP version used in the request is not supported by the server.
   */
  HTTP_VERSION_NOT_SUPPORTED: 505,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
   *
   * The server has an internal configuration error:
   *  the chosen variant resource is configured to engage in transparent content negotiation itself,
   *  and is therefore not a proper end point in the negotiation process.
   */
  INSUFFICIENT_STORAGE: 507,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-6
   *
   * The 511 status code indicates that the client needs to authenticate to gain network access.
   */
  NETWORK_AUTHENTICATION_REQUIRED: 511,
};

// ============================================================================
// Storage Keys (Base keys - extended in globalConstant.js)
// ============================================================================

export const appStorage = {
  // Authentication
  AUTH_CODE: 'code',
  AUTH_CODE_VERIFIER: 'code-verifirer',
  AUTH_SESSION_STATE: 'session-state',
  AUTH_TOKEN: 'access-token',
  AUTH_REFRESH_TOKEN: 'refresh-token',
  USER_AUTH_DATA: 'auth-data',
  APP_ROUTE_STATE: 'app-route-state',
  USER_FORBIDDEN: 'is-user-forbidden',
  PAYMENT_TOKEN: 'payment-token',
  PAYMENT_REFRESH_TOKEN:'payment-refresh-token',
  FIRST_LOGIN: 'first-login',
  EMAIL: 'email',
  ACTIVATION_TOKEN: 'activation-token',

  // Language
  i18n: 'i18n',
  DEFAULT_LANGUAGE: 'de',
}

// ============================================================================
// Alert Types (Base types - extended in globalConstant.js)
// ============================================================================

export const appAlert = {
  DEFAUT_TIMEOUT: 5000,
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  DARK: 'dark',
  SUCCESS: 'success',
  ERROR: 'danger',
  DISABLED: 'disabled',
  DEFAULT: 'default'
};

// ============================================================================
// Validation Types & Messages
// ============================================================================

export const DEFAULT_FIELD_VALIDATION_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  ARRAY: 'array',
  OBJECT: 'object',
  MIXED: 'mixed',
  EMAIL: 'email',
  URL: 'url',
  LOWER_CASE: 'lowercase',
  UPPER_CASE: 'uppercase'
};

export const DEFAULT_ERROR_MESSAGE = {
  fieldValidation: {
    REQUIRED: 'This field is required',
    MIN_LENGTH: 'Value is too short',
    MAX_LENGTH: 'Value is too long',
    INVALID: 'Invalid value',
    EMAIL: 'Invalid email address',
    URL: 'Invalid URL'
  }
};

// ============================================================================
// Regex Patterns (Base patterns - extended in globalConstant.js)
// ============================================================================

export const appRegex = {
  validateStringLength: /^[\x21-\xFF]{8,64}$/,
  validateUpperCase: /(?=.*[A-Z])/,
  validateLowerCase: /(?=.*[a-z])/,
  validateNumbers: /(?=.*\d)/,
  validateSpecialChar: /(?=.*[?!"§$%&#_()\[\]{}@*;:,\\/<>|~+-])/,
  validateEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  validatePhone: /^[0-9]{4,15}$/
};

// ============================================================================
// Routes (Base routes - extended in globalConstant.js)
// ============================================================================

export const appRoute = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '/404'
};

// ============================================================================
// SIM Lock Status
// ============================================================================

export const simLockStatus = {
  ACTIVE: 'ACTIVE',
  SIM_LOCK_INPROGRESS: 'SIM_LOCK_INPROGRESS',
  SIM_LOCKED: 'SIM_LOCKED',
  SIM_UNLOCK_REQUESTED: 'SIM_UNLOCK_REQUESTED',
  ACTIVATION_INPROGRESS: 'ACTIVATION_INPROGRESS'
};

export const simLockStatusTitle = {
  ACTIVE: 'ACTIVE',
  SIM_LOCK_INPROGRESS: 'SIM_LOCK_INPROGRESS',
  SIM_LOCKED: 'SIM_LOCKED',
  SIM_UNLOCK_REQUESTED: 'SIM_UNLOCK_REQUESTED',
  DEFAULT: 'DEFAULT'
};

// ============================================================================
// Auto TopUp Types
// ============================================================================

export const appAutoTopUpType = {
  UNIQUE: 'UNIQUE',
  AUTOMATIC: 'AUTOMATIC'
};

// ============================================================================
// Payment Utility Functions
// ============================================================================

/**
 * Product type constants for payment
 */
const PAYMENT_PRODUCT_TYPE = {
  RECURRING: 'RECURRING',
  LOW_BALANCE: 'LOW_BALANCE',
  DIRECT: 'DIRECT'
};

/**
 * Period type constants for auto top-up
 */
const AUTO_TOPUP_PERIOD_TYPE = {
  LOW_BALANCE: 'LOW_BALANCE',
  ONCE_PER_MONTH: 'ONCE_PER_MONTH',
  RATE: 'FIXED_RATE'
};

/**
 * Get top-up product without amount - finds a matching product from payment products
 * @param {string} type - Top-up type (UNIQUE, AUTOMATIC, DIRECT)
 * @param {string} periodType - Period type for automatic top-ups
 * @param {Array} paymentProducts - Array of payment product objects
 * @returns {Object} Product object with minAmount, maxAmount, etc.
 */
export const getTopUpWithoutAmount = (type, periodType, paymentProducts) => {
  if (!paymentProducts || paymentProducts.length === 0) {
    return { minAmount: 0, maxAmount: 0 };
  }

  let productType = PAYMENT_PRODUCT_TYPE.DIRECT;

  if (type === appAutoTopUpType.AUTOMATIC) {
    if (periodType === AUTO_TOPUP_PERIOD_TYPE.LOW_BALANCE || periodType === AUTO_TOPUP_PERIOD_TYPE.RATE) {
      productType = PAYMENT_PRODUCT_TYPE.LOW_BALANCE;
    } else if (periodType === AUTO_TOPUP_PERIOD_TYPE.ONCE_PER_MONTH) {
      productType = PAYMENT_PRODUCT_TYPE.RECURRING;
    }
  }

  // Find product where minAmount !== maxAmount (variable amount product)
  const product = paymentProducts.find(
    (p) => p.productType === productType && p.minAmount !== p.maxAmount
  );

  return product || { minAmount: 0, maxAmount: 0 };
};

/**
 * Get low balance top-up without amount
 * @param {string} type - Top-up type
 * @param {string} periodType - Period type
 * @param {Array} paymentProducts - Array of payment products
 * @returns {Object} Product object
 */
export const getLowBalanceTopUpWithoutAmount = (type, periodType, paymentProducts) =>
  getTopUpWithoutAmount(type, periodType, paymentProducts);

/**
 * Generate parameters for add to cart API call
 * @param {string} type - Top-up type (UNIQUE, AUTOMATIC)
 * @param {string|number} amount - Top-up amount
 * @param {Object} data - Data object with productId and option details
 * @param {string} periodType - Period type for automatic top-ups
 * @param {string|number} directAmount - Direct product amount
 * @param {Object|string} days - Days object with value property or empty string
 * @param {boolean} isAutoLowEnabled - Whether auto low balance is enabled
 * @returns {Object} Parameters for add to cart API
 */
export const generateParamsForAddToCart = (
  type,
  amount,
  data,
  periodType,
  directAmount,
  days,
  isAutoLowEnabled
) => {
  const params = {
    productId: data.productId,
    option: {
      ...data.option
    }
  };

  // Add amount if provided
  if (amount) {
    params.option.amount = parseFloat(amount);
  } else if (directAmount) {
    params.option.amount = parseFloat(directAmount);
  }

  // Handle automatic top-up options
  if (type === appAutoTopUpType.AUTOMATIC) {
    if (periodType === AUTO_TOPUP_PERIOD_TYPE.ONCE_PER_MONTH && days && days.value) {
      params.option.recurringOption = {
        dayOfMonth: parseInt(days.value, 10)
      };
    }

    if (isAutoLowEnabled || periodType === AUTO_TOPUP_PERIOD_TYPE.LOW_BALANCE || periodType === AUTO_TOPUP_PERIOD_TYPE.RATE) {
      params.option.lowBalanceOption = {
        ...data.option.lowBalanceOption,
        tariffEnabled: isAutoLowEnabled
      };
    }
  }

  return params;
};

// ============================================================================
// Default Export
// ============================================================================

export default {
  AppConfigProvider,
  useAppConfig,
  StatusCodes,
  appStorage,
  appAlert,
  appRegex,
  appRoute,
  simLockStatus,
  simLockStatusTitle,
  appAutoTopUpType,
  DEFAULT_FIELD_VALIDATION_TYPE,
  DEFAULT_ERROR_MESSAGE,
  getTopUpWithoutAmount,
  getLowBalanceTopUpWithoutAmount,
  generateParamsForAddToCart
};
