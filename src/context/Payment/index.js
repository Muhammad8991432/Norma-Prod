/* eslint-disable no-nested-ternary */
/**
 * // MPS
 * Payment Context - Simplified
 * Uses BraintreeProvider for SDK lifecycle
 * Heavy lifting moved to usePaymentFlow hook in @modules/Payment
 *
 * This context now provides:
 * - Access to Braintree context
 * - Direct service methods for simple use cases
 * - Payment configuration
 *
 * For complex flows, use usePaymentFlow() hook instead
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useAuth } from '@dom-digital-online-media/dom-auth-sdk';
import { useBraintree } from '@context/Braintree';
import paymentService from '@services/payment';
import { paymentConfig } from '@config/Payment';
import {
  appStorage,
  appMpsPaymentStatus,
  appMpsPaymentMethodType,
  appMpsCreditCardMapping,
  PAYMENT_METHODS,
  generateRandomValue,
  storageKeys
} from '@utils/globalConstant';
import { mpsApiClient, mpsContentApiClient, etcOneApiClient } from '@services/payment/api';
import { appAPIUri } from '@utils/apiConstants';
import { StatusCodes } from '@config/AppConfig';
import axios from 'axios';

const PaymentContext = createContext({});

export function PaymentProvider({ children, config }) {
  // Get Braintree context
  const braintree = useBraintree();

  // Get Auth context for token management in interceptors
  const { isUserLoggedIn, onLogout, onTokenExpire, setIsUserLogoutProcessing } = useAuth();

  // Centralized payment state with storage sync
  const STORAGE_KEY = 'mpsTopUpState';
  const initialMpsTopupPayment = {
    amount: '',
    type: '',
    chargeTo: '',
    otherNumber: '',
    paymentMethod: '',
    isAutoTopUp: false
  };
  // Hydrate from storage on mount
  const [mpsTopupPayment, setMpsTopupPayment] = useState(initialMpsTopupPayment);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mpsActivationTopupPayment, setActivationMpsTopupPayment] =
    useState(initialMpsTopupPayment);

  // whether a payment method is stored in /{mandate}/methods call
  const [hasMpsStoredPaymentMethod, setHasMpsStoredPaymentMethod] = useState(false);
  // the actual stored payment method details
  const [storedCardPaymentMethod, setStoredCardPaymentMethod] = useState({});

  // UI selection state: whether the user has selected the stored card option
  const [useStoredCard, setUseStoredCard] = useState(false);

  // Additional state for legacy compatibility
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  // Updated amount for auto top-up for display in account success page after amount change
  const [updatedAmount, setUpdatedAmount] = useState(null);

  // Action: select stored card as payment method (UI state)
  const selectStoredCard = useCallback((method = PAYMENT_METHODS.CREDIT_CARD) => {
    setUseStoredCard(true);
    setMpsTopupPayment((prev) => ({ ...prev, paymentMethod: method }));
  }, [setMpsTopupPayment]);

  const clearStoredCard = useCallback(() => {
    setUseStoredCard(false);
    setMpsTopupPayment((prev) => ({ ...prev, paymentMethod: '' }));
  }, [setMpsTopupPayment]);

  const storedCardPaymentMethodsInitialValue = {
    method: '', // e.g. 'creditcard', 'paypal', used in METHOD_LOGO in CardPaymentMethods component
    creditCardOption: 'generic', // e.g. 'visa', 'Mastercard', 'amex', 'generic' only relevant if method is credit card, used in CREDITCARD_LOGO in CardPaymentMethods component
    title: '', // e.g. 'Visa', 'PayPal'
    subtitle: '', // e.g. '**** 1234'
    date: '', // e.g. '12/2025'
    isError: false,
    isWarning: false,
    isActive: false
  };
  const [storedCardPaymentMethodsConfig, setStoredCardPaymentMethodsConfig] = useState(
    storedCardPaymentMethodsInitialValue
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMpsTopupPayment(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mpsTopupPayment));
    } catch {
      // REMOVE: remove console.warn
      // console.warn('Failed to read/write localStorage');
      // pass
    }
  }, [mpsTopupPayment, isHydrated]);

  // Check whether a MPS stored payment method is currently set up.
  // Set the configuration details for the CardPaymentMethods component
  // (active/error) based on the state of 'storedCardPaymentMethod'.
  // Additionally sets the corresponding state 'hasMpsStoredPaymentMethod'
  // to show/hide the CardPaymentMethods component.
  useEffect(() => {
    setIsLoading(true);
    // REMOVE: remove console.logs
    // console.log('Checking MPS stored payment method status...');
    // console.log('storedCardPaymentMethod:', storedCardPaymentMethod);

    // CardPaymentMethods components in case of API error or
    // empty or missing data in storedCardPaymentMethod
    if (
      // storedCardPaymentMethod is empty object
      (Object.keys(storedCardPaymentMethod).length === 0 &&
        storedCardPaymentMethod.constructor === Object) ||
      // one of the following keys does not exist in storedCardPaymentMethod
      !('payment' in storedCardPaymentMethod) ||
      !('paymentStatusId' in storedCardPaymentMethod)
    ) {
      // REMOVE: remove console.log
      // console.log(
      //   'isStoredAPIError API error or missing keys in JSON of storedCardPaymentMethod ...'
      // );
      // in every above cases we do not know the state of stored Payment Method
      setStoredCardPaymentMethodsConfig(storedCardPaymentMethodsInitialValue);
      setHasMpsStoredPaymentMethod(false);
    } else {
      // CardPaymentMethods component in case of no API error and data in storedCardPaymentMethod

      // intialise config for CardPaymentMethods component
      // eslint-disable-next-line prefer-const
      let paymentMethodConfig = { ...storedCardPaymentMethodsInitialValue };
      // REMOVE: remove console.log
      // console.log('initial paymentMethodConfig', paymentMethodConfig);
      // check if stored payment method has been set up at all
      if (!storedCardPaymentMethod?.payment && !storedCardPaymentMethod?.paymentStatusId) {
        // no stored payment method set up
        // REMOVE: remove console.log
        // console.log('No stored payment method set up!');
        setHasMpsStoredPaymentMethod(false);
      } else {
        // stored payment method has been set up
        setHasMpsStoredPaymentMethod(true);

        if (storedCardPaymentMethod?.paymentStatusId === appMpsPaymentStatus.ACTIVE) {
          // Stored payment method is active (green pill).
          // REMOVE: remove console.log
          // console.log('Stored payment method is active!');
          paymentMethodConfig.isActive = true;
        } else if (storedCardPaymentMethod?.paymentStatusId === appMpsPaymentStatus.INACTIVE) {
          // Stored payment method is invalid / inactive (red pill).
          // REMOVE: remove console.log
          // console.log('Stored payment method is INACTIVE!');
          paymentMethodConfig.isError = true;
        }

        // set remaining config for CardPaymentMethods component on topup overview page
        const customerMethod = appMpsPaymentMethodType.find(
          ({ apiValue }) => apiValue === storedCardPaymentMethod?.payment
        );
        paymentMethodConfig.method = customerMethod?.methodMapping || '';
        paymentMethodConfig.title = storedCardPaymentMethod?.payment || '';
        paymentMethodConfig.subtitle = storedCardPaymentMethod?.paymentDetails || '';
        if (customerMethod?.methodMapping === 'creditcard') {
          // define credit card icon and more specific title
          if ('ccBrand' in storedCardPaymentMethod) {
            // set correct icon
            const cardType = appMpsCreditCardMapping.find(
              ({ apiValue }) => apiValue === storedCardPaymentMethod?.ccBrand
            );
            paymentMethodConfig.creditCardOption = cardType?.iconMapping || 'generic';
            // set more specific title
            // paymentMethodConfig.title = storedCardPaymentMethod?.ccBrand || '';
            paymentMethodConfig.title = cardType?.nameMapping || '';
          }
          // shorten payment details for credit card to show only last 8 digits
          const shortenedPaymentDetails = storedCardPaymentMethod?.paymentDetails
            ? storedCardPaymentMethod.paymentDetails.length >= 8
              ? `${storedCardPaymentMethod.paymentDetails.slice(
                  -8,
                  -4
                )} ${storedCardPaymentMethod.paymentDetails.slice(-4)}`
              : storedCardPaymentMethod.paymentDetails
            : '';
          paymentMethodConfig.subtitle = shortenedPaymentDetails;
          // set valid until date for credit card
          if ('expiryDate' in storedCardPaymentMethod) {
            paymentMethodConfig.date = `${storedCardPaymentMethod?.expiryDate?.slice(
              0,
              2
            )}/${storedCardPaymentMethod?.expiryDate?.slice(2)}`;
          }
        }

        // REMOVE: remove console.log
        // console.log('Filled stored paymentMethodConfig', paymentMethodConfig);
      }
      setStoredCardPaymentMethodsConfig(paymentMethodConfig);
      setIsLoading(false);
    }
  }, [storedCardPaymentMethod]);

  // Centralized MPS payment outcome - use as single source of truth for result/status
  const [mpsPaymentResult, setMpsPaymentResult] = useState(null);
  const [mpsPaymentStatus, setMpsPaymentStatus] = useState('idle'); // 'idle'|'pending'|'completed'|'error'|'cancelled'

  // Account Payment Method Flow (AddPaymentMethods page) - separate from top-up flow
  const [accountMpsTopupPaymentMethod, setMpsAccountTopupPayment] = useState(null);
  const [accountMpsPaymentStatus, setAccountMpsPaymentStatus] = useState('idle'); // 'idle'|'pending'|'success'|'error'
  const [accountMpsPaymentResult, setAccountMpsPaymentResult] = useState(null);

  /**
   * Update auto top-up amount in account section
   *
   * @param {string} amount - Auto top-up amount to update
   */
  const updateAutoTopupAmount = useCallback(async (amount) => {
    setIsLoading(true);
    try {
      const result = await paymentService.updateAutoTopupAmount(amount);
      // REMOVE: remove console.log
      // console.log('result of payment service call: updateAutoTopupAmount', result);
      return result;
    } catch (error) {
      // REMOVE: remove console.log
      console.error('Failed to update the auto-topup amount');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete payment method in account section
   */
  const deletePaymentMethod = useCallback(async () => {
    try {
      const result = await paymentService.deletePaymentMethod();
      // REMOVE: remove console.log
      // console.log(' ', result);
      return result;
    } catch (error) {
      // REMOVE: remove console.console.log
      console.error('Failed to delete payment method');
      throw error;
    }
  }, []);

  /**
   * Clear payment session
   * Uses BraintreeProvider cleanup
   */
  const clearPaymentSession = useCallback(() => {
    // console.log('🔵 Clearing payment session...');
    braintree.cleanup();
    setPaymentError(null);
    setPaymentResult(null);
    // }, [braintree]);
  }, [braintree.cleanup]); // safer

  const resetPayment = useCallback(() => {
    setMpsTopupPayment(initialMpsTopupPayment);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const resetAllPaymentState = useCallback(() => {
    clearPaymentSession();
    resetPayment();
  }, [clearPaymentSession, resetPayment]);

  // New adaptation to avoid using binding in context, which can cause re-renders
  const processOneTimePayment = useCallback(
    (...args) => paymentService.processOneTimePayment(...args),
    []
  );

  const registerRecurringPayment = useCallback(
    (...args) => paymentService.registerRecurringPayment(...args),
    []
  );

  const isBraintreeMethod = useCallback((...args) => paymentService.isBraintreeMethod(...args), []);

  const isRedirectMethod = useCallback((...args) => paymentService.isRedirectMethod(...args), []);

  // MPS: We have six interceptors (request/response pairs), because of three base URLs.
  // REFACTOR: This should be refactored into one solution which only needs
  // REFACTOR: two interceptors (one request and one response interceptor).
  // REFACTOR: This could be achieved by removing the baseUrls in config or
  // REFACTOR: by using one shared domain as baseUrl and the complete paths
  // REFACTOR: need to be part of the endpoints.

  // Interceptor Flow (request) ----------------------------------------------

  /**
   * Add relevant request headers (e.g. auth token) to axios requests.
   * It is used in request interceptor.
   *
   * @param {object} axiosRequestConfig - Axios request config object
   */
  const addRelevantRequestHeaders = async (axiosRequestConfig) => {
    // REMOVE: remove console.log
    // console.log('axiosRequestConfig', axiosRequestConfig)
    const requestConfig = {
      ...axiosRequestConfig,
      headers: {
        ...axiosRequestConfig.headers
      }
    };
    // REMOVE: remove console.log
    // console.log('requestConfig', requestConfig)
    // Fetch token from storage
    const token = await config.storage.encryptedGetItem(appStorage.AUTH_TOKEN);
    // REMOVE: remove console.logs
    // console.log('token', token);
    // console.log('url', requestConfig.url);
    // console.log('baseURL', requestConfig.baseURL);
    // console.log('config.env.REACT_APP_MO_URL', config.env.REACT_APP_MO_URL);
    // console.log('config.env.REACT_APP_MO_USER_URL', config.env.REACT_APP_MO_USER_URL);
    // console.log('config.env.REACT_APP_MPS_PROXY_URL', config.env.REACT_APP_MPS_PROXY_URL);
    // console.log('config.env.REACT_APP_BACKEND_URL', config.env.REACT_APP_BACKEND_URL);

    const completeURL = requestConfig.baseURL
      ? `${requestConfig.baseURL}${requestConfig.url}`
      : requestConfig.url;
    // REMOVE: remove console.log
    // console.log('completeURL', completeURL);

    if (
      token &&
      (completeURL.includes(config.env.REACT_APP_MO_URL) ||
        completeURL.includes(config.env.REACT_APP_MO_USER_URL) ||
        completeURL.includes(config.env.REACT_APP_MPS_PROXY_URL) ||
        completeURL.includes(config.env.REACT_APP_BACKEND_URL))
    ) {
      // REMOVE: remove console.log
      // console.log('Adding Authorization header to request');
      // Assign token to request
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${token}`
      };
    }
    // REMOVE: remove console.log
    // console.log('requestConfig with Bearer token?', requestConfig);

    // #50218 - Use interceptor to inject the custom headers for log tags
    let headerTag = await config.storage.getItem(storageKeys.X_LOG_TAG);
    if (!headerTag) {
      headerTag = generateRandomValue();
      await config.storage.setItem(storageKeys.X_LOG_TAG, headerTag);
    }
    requestConfig.headers['X-Log-Tag'] = headerTag;

    return requestConfig;
  };

  // Interceptor Flow (response) ---------------------------------------------
  let isRefreshing = false;
  let failedQueue = [];

  /**
   * Process queue for failed requests
   *
   * This method will execute all failed requests added to queue after a new
   * access token has been obtained using the refresh token.
   * It is used in response interceptor when a 401 or 404 error is encountered.
   */
  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  /**
   *
   * @returns {Promise<{data: {access_token: string|boolean, refresh_token?: string}}>} data object with access_token and refresh_token if successful, or access_token false if failed
   */
  const getRefreshAccessToken = async () => {
    try {
      const {
        data: { access_token: accessToken, refresh_token: refreshToken, ...restData },
        success
      } = await onTokenExpire();
      if (success) {
        // REMOVE: remove console.logs
        // console.log('getRefreshAccessToken (payment context) --> accessToken', accessToken);
        // console.log('getRefreshAccessToken (payment context) --> refreshToken', refreshToken);
        // console.log('getRefreshAccessToken (payment context) --> restData', restData);
        await config.storage.encryptedSetItem(appStorage.AUTH_TOKEN, accessToken);
        await config.storage.encryptedSetItem(appStorage.AUTH_REFRESH_TOKEN, refreshToken);
        await config.storage.encryptedSetItem(appStorage.USER_AUTH_DATA, JSON.stringify(restData));
        // REMOVE: remove console.log
        // console.log('getRefreshAccessToken (payment context) --> success return value', {
        //   data: { access_token: accessToken, refresh_token: refreshToken }
        // });
        return { data: { access_token: accessToken, refresh_token: refreshToken } };
      }
      return { data: { access_token: false } };
    } catch (error) {
      return { data: { access_token: false } };
    }
  };

  const handleLogout = async () => {
    await config.storage.encryptedSetItem(appStorage.AUTH_TOKEN, '');
    await config.storage.encryptedSetItem(appStorage.AUTH_REFRESH_TOKEN, '');
    await config.storage.encryptedSetItem(appStorage.USER_AUTH_DATA, '');
    await config.storage.encryptedSetItem(appStorage.USER_FORBIDDEN, '');
    setIsUserLogoutProcessing(true);
    // REMOVE: remove console.log
    // console.log('using local handleLogout (payment context), redirecting to home ...');
    window.location.href = '/';
  };

  /**
   * Request interceptor - log outgoing requests (MPS Payment Proxy) and add relevant headers (e.g. auth token)
   */
  mpsApiClient.interceptors.request.use(
    async (requestConfig) => {
      // add headers if necessary
      const requestConfigWithHeaders = await addRelevantRequestHeaders(requestConfig);
      // REMOVE: remove console.log
      // console.log(
      //   `🔵 MPS Payment Proxy Request: ${requestConfigWithHeaders.method?.toUpperCase()} ${
      //     requestConfigWithHeaders.url
      //   }`,
      //   {
      //     data: requestConfigWithHeaders.data,
      //     headers: requestConfigWithHeaders.headers,
      //     params: requestConfigWithHeaders.params
      //   }
      // );
      return requestConfigWithHeaders;
    },
    (error) => {
      console.error('Payment Proxy Request Error');
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor - log responses and handle errors (MPS Payment Proxy)
   */
  mpsApiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      let isRefreshTokenFlow = false;

      if (error.response) {
        // Server responded with error status
        // REMOVE: remove console.log
        // console.error(`🔴 MPS Payment Proxy Error: ${error.response.status} ${error.config?.url}`, {
        //   status: error.response.status,
        //   data: error.response.data
        //   // headers: error.response.headers
        // });
        // console.error(`Payment Proxy Error: ${error.response.status} ${error.config?.url}`);
        console.error('Payment Proxy Error');
      } else if (error.request) {
        // Request made but no response received
        // REMOVE: remove console.log
        console.error('Payment Proxy Network Error');
      } else {
        // Something else happened
        // REMOVE: remove console.log
        console.error('Payment Proxy Error');
      }

      // start refresh token flow
      const originalRequest = error.config;

      const token = await config.storage.encryptedGetItem(appStorage.AUTH_TOKEN);
      const refreshToken = await config.storage.encryptedGetItem(appStorage.AUTH_REFRESH_TOKEN);
      const isUserForbidden = await config.storage.encryptedGetItem(appStorage.USER_FORBIDDEN);
      // REMOVE: remove console.logs
      // console.log('interceptors Error 0 isRefreshTokenFlow', isRefreshTokenFlow);
      // console.log('interceptors Error 1 token', token);
      // console.log('interceptors Error 1.5 isUserLoggedIn', isUserLoggedIn);
      // console.log('interceptors Error 2 isUserForbidden', isUserForbidden);
      // console.log('interceptors Error 3 refreshToken', refreshToken);
      // console.log('interceptors Error 4 Url', error?.response?.config?.url);
      // console.log('interceptors Error 4.5 BaseURL', error?.response?.config?.baseURL);
      // console.log('interceptors Error 5 paymentConfig', paymentConfig);
      // console.log('interceptors Error 6 status', error?.status);
      // console.log('interceptors Error 7 error?.response?.status', error?.response?.status);
      // console.log('interceptors Error 8 originalRequest', originalRequest);
      // console.log('interceptors Error 9 failedQueue', failedQueue);

      // Check for 401 or 403 error and retry is true or not
      if (
        isUserLoggedIn &&
        (error?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.FORBIDDEN) &&
        !originalRequest?._retry &&
        (error?.response?.config?.baseURL.includes(config.env?.REACT_APP_MO_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_MO_USER_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_DEEPLINK_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_MPS_PROXY_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_BACKEND_URL)) &&
        !(
          // Do not intercept if 401 comes from token and logout API
          (
            error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.TOKEN) ||
            error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.LOGOUT) ||
            error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.SILENT_LOGIN)
          )
        )
      ) {
        // REMOVE: remove console.log
        // console.log('mpsApiClient.interceptors.response.use --> starting refresh token flow ...');
        isRefreshTokenFlow = true;

        // add request to queue which will be called later once new access token is obtained.
        if (isRefreshing) {
          // REMOVE: remove console.log
          // console.log('interceptors Flow --> isRefreshing -->', isRefreshing);
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              // REMOVE: remove console.log
              // console.log('interceptors Flow --> isRefreshing --> then token -->', token);
              // REMOVE: remove console.log
              // console.log(
              //   'interceptors Flow --> isRefreshing --> then token --> originalRequest',
              //   originalRequest
              // );
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        if (originalRequest) {
          // REMOVE: remove console.log
          // console.log('interceptors Flow --> if originalRequest -->', originalRequest);
          originalRequest._retry = true; // setting retry to true so it wil not render agains
          isRefreshing = true;
        }

        if (token && refreshToken) {
          // Checking with Token for user and login
          // REMOVE: remove console.log
          // console.log(
          //   'interceptors Flow --> if token && refreshToken --> refreshToken',
          //   refreshToken
          // );
          try {
            // RefreshToken after login
            const { data } = await getRefreshAccessToken();
            // REMOVE: remove console.log
            // console.log('interceptors Flow --> if token && refreshToken --> data', data);

            if (data) {
              // REMOVE: remove console.log
              // console.log('interceptors Flow --> if token && refreshToken --> if data', data);
              processQueue(null, data.access_token);
              originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
              return axios(originalRequest);
            }
          } catch (error) {
            // REMOVE: remove console.log
            // console.log('interceptors Flow --> if token && refreshToken --> error', error);
            // console.log('interceptors Flow --> if token && refreshToken --> error');
            processQueue(error, null);
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
            // REMOVE: remove console.log
            // console.log('interceptors Flow --> finally --> isRefreshing -->', isRefreshing);
          }
        }
      }

      // The below call is necessary if we get an error 401 or 403 in logout and Token API
      if (
        (error.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.FORBIDDEN ||
          error.status === StatusCodes.INTERNAL_SERVER_ERROR ||
          error?.response?.status === StatusCodes.INTERNAL_SERVER_ERROR ||
          error.status === StatusCodes.BAD_REQUEST ||
          error?.response?.status === StatusCodes.BAD_REQUEST) &&
        (error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.TOKEN) ||
          error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.LOGOUT)) &&
        token &&
        refreshToken
      ) {
        if (
          error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.LOGOUT) ||
          error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.TOKEN)
        ) {
          if (isUserForbidden) {
            handleLogout();
          } else {
            await config.storage.encryptedSetItem(appStorage.USER_FORBIDDEN, 'true');
            await onLogout();
            handleLogout();
          }
        }
      }

      if (!isRefreshTokenFlow) {
        return Promise.reject(error);
      }
      throw error; // Throwing error if again there is an not error related to temp-token
      // return Promise.reject(error);
    }
  );

  /**
   * Request interceptor - log outgoing requests (MPS Content Proxy) and add relevant headers (e.g. auth token)
   */
  mpsContentApiClient.interceptors.request.use(
    async (requestConfig) => {
      // add headers if necessary
      const requestConfigWithHeaders = await addRelevantRequestHeaders(requestConfig);
      // REMOVE: remove console.log
      // console.log(
      //   `🔵 MPS Content Proxy Request: ${requestConfigWithHeaders.method?.toUpperCase()} ${
      //     requestConfigWithHeaders.url
      //   }`,
      //   {
      //     data: requestConfigWithHeaders.data,
      //     headers: requestConfigWithHeaders.headers,
      //     params: requestConfigWithHeaders.params
      //   }
      // );
      // console.log(
      //   `🔵 MPS Content Proxy Request: ${requestConfigWithHeaders.method?.toUpperCase()} ${
      //     requestConfigWithHeaders.url
      //   }`
      // );
      return requestConfigWithHeaders;
    },
    (error) => {
      // REMOVE: remove console.log
      // console.error('🔴 MPS Content Proxy Request Error:', error);
      console.error('🔴 MPS Content Proxy Request Error');
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor - log responses and handle errors (MPS Content Proxy)
   */
  mpsContentApiClient.interceptors.response.use(
    (response) => {
      // REMOVE: remove console.log
      // console.log(
      //   `🟢 MPS Content Proxy Response: ${response.config.method?.toUpperCase()} ${
      //     response.config.url
      //   }`,
      //   {
      //     status: response.status,
      //     data: response.data
      //   }
      // );
      // console.log(
      //   `🟢 MPS Content Proxy Response: ${response.config.method?.toUpperCase()} ${
      //     response.config.url
      //   } [${response.status}]`
      // );

      return response;
    },
    async (error) => {
      let isRefreshTokenFlow = false;

      if (error.response) {
        // Server responded with error status
        // REMOVE: remove console.log
        // console.error(`🔴 MPS Content Proxy Error: ${error.response.status} ${error.config?.url}`, {
        //   status: error.response.status,
        //   data: error.response.data
        //   // headers: error.response.headers
        // });
        // console.error(`🔴 MPS Content Proxy Error: ${error.response.status} ${error.config?.url}`);
      } else if (error.request) {
        // Request made but no response received
        // REMOVE: remove console.log
        console.error('🔴 MPS Content Proxy Network Error:', error.message);
      } else {
        // Something else happened
        // REMOVE: remove console.log
        console.error('🔴 MPS Content Proxy Error:', error.message);
      }

      // start refresh token flow
      const originalRequest = error.config;

      const token = await config.storage.encryptedGetItem(appStorage.AUTH_TOKEN);
      const refreshToken = await config.storage.encryptedGetItem(appStorage.AUTH_REFRESH_TOKEN);
      const isUserForbidden = await config.storage.encryptedGetItem(appStorage.USER_FORBIDDEN);
      // REMOVE: remove console.logs
      // console.log('interceptors Error 0 isRefreshTokenFlow', isRefreshTokenFlow);
      // console.log('interceptors Error 1 token', token);
      // console.log('interceptors Error 1.5 isUserLoggedIn', isUserLoggedIn);
      // console.log('interceptors Error 2 isUserForbidden', isUserForbidden);
      // console.log('interceptors Error 3 refreshToken', refreshToken);
      // console.log('interceptors Error 4 Url', error?.response?.config?.url);
      // console.log('interceptors Error 4.5 BaseURL', error?.response?.config?.baseURL);
      // console.log('interceptors Error 5 paymentConfig', paymentConfig);
      // console.log('interceptors Error 6 status', error?.status);
      // console.log('interceptors Error 7 error?.response?.status', error?.response?.status);
      // console.log('interceptors Error 8 originalRequest', originalRequest);
      // console.log('interceptors Error 9 failedQueue', failedQueue);

      // Check for 401 or 403 error and retry is true or not
      if (
        isUserLoggedIn &&
        (error?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.FORBIDDEN) &&
        !originalRequest?._retry &&
        (error?.response?.config?.baseURL.includes(config.env?.REACT_APP_MO_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_MO_USER_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_DEEPLINK_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_MPS_PROXY_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_BACKEND_URL)) &&
        !(
          // Do not intercept if 401 comes from token and logout API
          (
            error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.TOKEN) ||
            error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.LOGOUT) ||
            error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.SILENT_LOGIN)
          )
        )
      ) {
        // REMOVE: remove console.log
        // console.log(
        //   'mpsContentApiClient.interceptors.response.use --> starting refresh token flow ...'
        // );
        isRefreshTokenFlow = true;

        // add request to queue which will be called later once new access token is obtained.
        if (isRefreshing) {
          // REMOVE: remove console.log
          // console.log('interceptors Flow --> isRefreshing -->', isRefreshing);
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              // REMOVE: remove console.log
              // console.log('interceptors Flow --> isRefreshing --> then token -->', token);
              // REMOVE: remove console.log
              // console.log(
              //   'interceptors Flow --> isRefreshing --> then token --> originalRequest',
              //   originalRequest
              // );
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        if (originalRequest) {
          // REMOVE: remove console.log
          // console.log('interceptors Flow --> if originalRequest -->', originalRequest);
          originalRequest._retry = true; // setting retry to true so it wil not render agains
          isRefreshing = true;
        }

        if (token && refreshToken) {
          // Checking with Token for user and login
          // REMOVE: remove console.log
          // console.log(
          //   'interceptors Flow --> if token && refreshToken --> refreshToken',
          //   refreshToken
          // );
          try {
            // RefreshToken after login
            const { data } = await getRefreshAccessToken();
            // REMOVE: remove console.log
            // console.log('interceptors Flow --> if token && refreshToken --> data', data);

            if (data) {
              // REMOVE: remove console.log
              // console.log('interceptors Flow --> if token && refreshToken --> if data', data);
              processQueue(null, data.access_token);
              originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
              return axios(originalRequest);
            }
          } catch (error) {
            // REMOVE: remove console.log
            // console.log('interceptors Flow --> if token && refreshToken --> error', error);
            processQueue(error, null);
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
            // REMOVE: remove console.log
            // console.log('interceptors Flow --> finally --> isRefreshing -->', isRefreshing);
          }
        }
      }

      // The below call is necessary if we get an error 401 or 403 in logout and Token API
      if (
        (error.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.FORBIDDEN ||
          error.status === StatusCodes.INTERNAL_SERVER_ERROR ||
          error?.response?.status === StatusCodes.INTERNAL_SERVER_ERROR ||
          error.status === StatusCodes.BAD_REQUEST ||
          error?.response?.status === StatusCodes.BAD_REQUEST) &&
        (error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.TOKEN) ||
          error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.LOGOUT)) &&
        token &&
        refreshToken
      ) {
        if (
          error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.LOGOUT) ||
          error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.TOKEN)
        ) {
          if (isUserForbidden) {
            handleLogout();
          } else {
            await config.storage.encryptedSetItem(appStorage.USER_FORBIDDEN, 'true');
            await onLogout();
            handleLogout();
          }
        }
      }

      if (!isRefreshTokenFlow) {
        return Promise.reject(error);
      }
      throw error; // Throwing error if again there is an not error related to temp-token
      // return Promise.reject(error);
    }
  );

  /**
   * ETC One API interceptors (reuse same pattern as used above for MPS API)
   */
  etcOneApiClient.interceptors.request.use(
    async (requestConfig) => {
      // add headers if necessary
      const requestConfigWithHeaders = await addRelevantRequestHeaders(requestConfig);
      // REMOVE: remove console.log
      // console.log(
      //   `🔵 ETC One API Request: ${requestConfigWithHeaders.method?.toUpperCase()} ${
      //     requestConfigWithHeaders.url
      //   }`,
      //   {
      //     data: requestConfigWithHeaders.data,
      //     headers: requestConfigWithHeaders.headers,
      //     params: requestConfigWithHeaders.params
      //   }
      // );
      // console.log(
      //   `🔵 ETC One API Request: ${requestConfigWithHeaders.method?.toUpperCase()} ${
      //     requestConfigWithHeaders.url
      //   }`
      // );
      return requestConfigWithHeaders;
    },
    (error) => {
      // REMOVE: remove console.log
      // console.error('🔴 ETC One API Request Error:', error);
      console.error('🔴 ETC One API Request Error');
      return Promise.reject(error);
    }
  );

  etcOneApiClient.interceptors.response.use(
    (response) => {
      // REMOVE: remove console.log
      // console.log(
      //   `🟢 ETC One API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      //   {
      //     status: response.status,
      //     data: response.data
      //   }
      // );
      // console.log(
      //   `🟢 ETC One API Response: ${response.config.method?.toUpperCase()} ${
      //     response.config.url
      //   } [${response.status}]`
      // );
      return response;
    },
    async (error) => {
      let isRefreshTokenFlow = false;

      if (error.response) {
        // Server responded with error status
        // REMOVE: remove console.log
        // console.error(`🔴 ETC One API Error: ${error.response.status} ${error.config?.url}`, {
        //   status: error.response.status,
        //   data: error.response.data
        //   // headers: error.response.headers
        // });
        console.error(`🔴 ETC One API Error: ${error.response.status} ${error.config?.url}`);
      } else if (error.request) {
        // Request made but no response received
        // REMOVE: remove console.log
        console.error('🔴 ETC One API Network Error:', error.message);
      } else {
        // Something else happened
        // REMOVE: remove console.log
        console.error('🔴 ETC One API Error:', error.message);
      }

      // start refresh token flow
      const originalRequest = error.config;

      const token = await config.storage.encryptedGetItem(appStorage.AUTH_TOKEN);
      const refreshToken = await config.storage.encryptedGetItem(appStorage.AUTH_REFRESH_TOKEN);
      const isUserForbidden = await config.storage.encryptedGetItem(appStorage.USER_FORBIDDEN);
      // REMOVE: remove console.logs
      // console.log('interceptors Error 0 isRefreshTokenFlow', isRefreshTokenFlow);
      // console.log('interceptors Error 1 token', token);
      // console.log('interceptors Error 1.5 isUserLoggedIn', isUserLoggedIn);
      // console.log('interceptors Error 2 isUserForbidden', isUserForbidden);
      // console.log('interceptors Error 3 refreshToken', refreshToken);
      // console.log('interceptors Error 4 Url', error?.response?.config?.url);
      // console.log('interceptors Error 4.5 BaseURL', error?.response?.config?.baseURL);
      // console.log('interceptors Error 5 paymentConfig', paymentConfig);
      // console.log('interceptors Error 6 status', error?.status);
      // console.log('interceptors Error 7 error?.response?.status', error?.response?.status);
      // console.log('interceptors Error 8 originalRequest', originalRequest);
      // console.log('interceptors Error 9 failedQueue', failedQueue);

      // Check for 401 or 403 error and retry is true or not
      if (
        isUserLoggedIn &&
        (error?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.FORBIDDEN) &&
        !originalRequest?._retry &&
        (error?.response?.config?.baseURL.includes(config.env?.REACT_APP_MO_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_MO_USER_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_DEEPLINK_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_MPS_PROXY_URL) ||
          error?.response?.config?.baseURL.includes(config.env?.REACT_APP_BACKEND_URL)) &&
        !(
          // Do not intercept if 401 comes from token and logout API
          (
            error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.TOKEN) ||
            error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.LOGOUT) ||
            error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.SILENT_LOGIN)
          )
        )
      ) {
        // REMOVE: remove console.log
        // console.log(
        //   'etcOneApiClient.interceptors.response.use --> starting refresh token flow ...'
        // );
        isRefreshTokenFlow = true;

        // add request to queue which will be called later once new access token is obtained.
        if (isRefreshing) {
          // REMOVE: remove console.log
          // console.log('interceptors Flow --> isRefreshing -->', isRefreshing);
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              // REMOVE: remove console.log
              // console.log('interceptors Flow --> isRefreshing --> then token -->', token);
              // REMOVE: remove console.log
              // console.log(
              //   'interceptors Flow --> isRefreshing --> then token --> originalRequest',
              //   originalRequest
              // );
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        if (originalRequest) {
          // REMOVE: remove console.log
          // console.log('interceptors Flow --> if originalRequest -->', originalRequest);
          originalRequest._retry = true; // setting retry to true so it wil not render agains
          isRefreshing = true;
        }

        if (token && refreshToken) {
          // Checking with Token for user and login
          // REMOVE: remove console.log
          // console.log(
          //   'interceptors Flow --> if token && refreshToken --> refreshToken',
          //   refreshToken
          // );
          try {
            // RefreshToken after login
            const { data } = await getRefreshAccessToken();
            // REMOVE: remove console.log
            // console.log('interceptors Flow --> if token && refreshToken --> data', data);

            if (data) {
              // REMOVE: remove console.log
              // console.log('interceptors Flow --> if token && refreshToken --> if data', data);
              processQueue(null, data.access_token);
              originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
              return axios(originalRequest);
            }
          } catch (error) {
            // REMOVE: remove console.log
            // console.log('interceptors Flow --> if token && refreshToken --> error', error);
            // console.log('interceptors Flow --> if token && refreshToken --> error');
            processQueue(error, null);
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
            // REMOVE: remove console.log
            // console.log('interceptors Flow --> finally --> isRefreshing -->', isRefreshing);
          }
        }
      }

      // The below call is necessary if we get an error 401 or 403 in logout and Token API
      if (
        (error.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.FORBIDDEN ||
          error.status === StatusCodes.INTERNAL_SERVER_ERROR ||
          error?.response?.status === StatusCodes.INTERNAL_SERVER_ERROR ||
          error.status === StatusCodes.BAD_REQUEST ||
          error?.response?.status === StatusCodes.BAD_REQUEST) &&
        (error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.TOKEN) ||
          error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.LOGOUT)) &&
        token &&
        refreshToken
      ) {
        if (
          error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.LOGOUT) ||
          error?.response?.config?.url.includes(appAPIUri.OPEN_ID_CONNECT.TOKEN)
        ) {
          if (isUserForbidden) {
            handleLogout();
          } else {
            await config.storage.encryptedSetItem(appStorage.USER_FORBIDDEN, 'true');
            await onLogout();
            handleLogout();
          }
        }
      }

      if (!isRefreshTokenFlow) {
        return Promise.reject(error);
      }
      throw error; // Throwing error if again there is an not error related to temp-token
      // return Promise.reject(error);
    }
  );

  // Context value - memoized to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      // Centralized payment state
      mpsTopupPayment,
      setMpsTopupPayment,
      mpsActivationTopupPayment,
      setActivationMpsTopupPayment,
      hasMpsStoredPaymentMethod,
      setHasMpsStoredPaymentMethod,
      storedCardPaymentMethodsConfig,
      setStoredCardPaymentMethodsConfig,
      storedCardPaymentMethod,
      setStoredCardPaymentMethod,
      useStoredCard,
      setUseStoredCard,
      selectStoredCard,
      clearStoredCard,
      updatedAmount,
      setUpdatedAmount,

      // Braintree state (from BraintreeProvider)
      client: braintree.client,
      clientToken: braintree.clientToken,
      isInitialized: braintree.isInitialized,
      isInitializing: braintree.isInitializing,
      currentPaymentMethod: braintree.currentMethod,

      // Braintree actions (from BraintreeProvider)
      initializeBraintreeSDK: braintree.initialize,

      // Local state
      isLoading,
      paymentError,
      paymentResult,
      // Runtime MPS outcome (centralized)
      mpsPaymentResult,
      setMpsPaymentResult,
      mpsPaymentStatus,
      setMpsPaymentStatus,

      // Account Payment Method Flow (AddPaymentMethods page)
      accountMpsTopupPaymentMethod,
      setMpsAccountTopupPayment,
      accountMpsPaymentStatus,
      setAccountMpsPaymentStatus,
      accountMpsPaymentResult,
      setAccountMpsPaymentResult,

      // Payment processing (direct service methods)
      // processOneTimePayment: paymentService.processOneTimePayment.bind(paymentService),
      // registerRecurringPayment: paymentService.registerRecurringPayment.bind(paymentService),
      processOneTimePayment,
      registerRecurringPayment,

      // handlePaymentCallback,

      updateAutoTopupAmount,
      deletePaymentMethod,

      // Session management
      clearPaymentSession,
      resetPayment,
      resetAllPaymentState,

      // Config access
      paymentConfig,

      // Helpers
      // isBraintreeMethod: paymentService.isBraintreeMethod.bind(paymentService),
      // isRedirectMethod: paymentService.isRedirectMethod.bind(paymentService)
      isBraintreeMethod,
      isRedirectMethod,

      // Refresh token flow helper
      getRefreshAccessToken
    }),
    [
      mpsTopupPayment,
      setMpsTopupPayment,
      mpsActivationTopupPayment,
      setActivationMpsTopupPayment,
      hasMpsStoredPaymentMethod,
      setHasMpsStoredPaymentMethod,
      storedCardPaymentMethodsConfig,
      setStoredCardPaymentMethodsConfig,
      storedCardPaymentMethod,
      setStoredCardPaymentMethod,
      updatedAmount,
      setUpdatedAmount,

      braintree,
      isLoading,
      paymentError,
      paymentResult,
      mpsPaymentResult,
      setMpsPaymentResult,
      mpsPaymentStatus,
      setMpsPaymentStatus,
      accountMpsTopupPaymentMethod,
      setMpsAccountTopupPayment,
      accountMpsPaymentStatus,
      setAccountMpsPaymentStatus,
      accountMpsPaymentResult,
      setAccountMpsPaymentResult,
      updateAutoTopupAmount,
      deletePaymentMethod,
      clearPaymentSession,
      resetPayment,
      resetAllPaymentState,
      processOneTimePayment,
      registerRecurringPayment,
      isBraintreeMethod,
      isRedirectMethod,
      getRefreshAccessToken
    ]
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

PaymentProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Hook to access Payment context
 * @returns {Object} Payment context value
 */
export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
}

export default PaymentProvider;
