/**
 * // MPS
 * BraintreeProvider - SDK lifecycle management
 * Shared across TopUp and Activation flows
 * 
 * Responsibilities:
 * - Get client token from MPS
 * - Initialize Braintree client
 * - Manage SDK lifecycle (init/cleanup)
 * 
 * Does NOT handle:
 * - Hosted fields (that's in usePaymentFlow)
 * - Payment processing (that's in paymentService)
 * 
 * Updated: 2. Mar - Now requires { type, method } for initialization
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { createBraintreeClient, clearBraintreeClient } from '@services/braintree/client';
import paymentService from '@services/payment';

const BraintreeContext = createContext(null);

export function BraintreeProvider({ children }) {
  const [client, setClient] = useState(null);
  const [clientToken, setClientToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [currentMethod, setCurrentMethod] = useState(null);
  const [currentType, setCurrentType] = useState(null);

  // Track initialization to prevent race conditions
  const initPromiseRef = useRef(null);

  /**
   * Initialize Braintree client for a specific payment method
   * Handles duplicate calls gracefully
   * 
   * @param {Object|string} options - Either { type, method } or just method string (legacy)
   * @param {string} options.type - 'onetime' or 'recurring' (default: 'onetime')
   * @param {string} options.method - creditcard, applepay, googlepay
   * @returns {Promise<Object>} Braintree client instance
   */
  const initialize = useCallback(async (options) => {
    // Support both new { type, method } and legacy (method) signature
    const type = typeof options === 'object' ? (options.type || 'onetime') : 'onetime';
    const method = typeof options === 'object' ? options.method : options;

    const cacheKey = `${type}:${method}`;
    const currentCacheKey = `${currentType}:${currentMethod}`;

    // Return existing client if same type+method already initialized
    if (isInitialized && currentCacheKey === cacheKey && client) {
      // console.log(`🔵 Reusing existing Braintree client for ${cacheKey}`);
      return client;
    }

    // Return pending promise if already initializing same type+method
    if (isInitializing && currentCacheKey === cacheKey && initPromiseRef.current) {
      // console.log(`🔵 Waiting for existing initialization of ${cacheKey}...`);
      return initPromiseRef.current;
    }

    // Different type/method requested - cleanup first
    if (currentMethod && currentCacheKey !== cacheKey) {
      // console.log(`🔵 Switching from ${currentCacheKey} to ${cacheKey}, cleaning up...`);
      clearBraintreeClient();
      setClient(null);
      setIsInitialized(false);
    }

    setIsInitializing(true);
    setError(null);
    setCurrentMethod(method);
    setCurrentType(type);

    const promise = (async () => {
      try {
        // console.log(`🔵 Initializing Braintree SDK for ${type}/${method}...`);

        // Get client token from MPS (new API: requires type and method)
        const token = await paymentService.getClientToken({ type, method });
        setClientToken(token);

        // Create Braintree client
        const braintreeClient = await createBraintreeClient(token);
        setClient(braintreeClient);
        setIsInitialized(true);

        // console.log('✅ Braintree SDK initialized successfully');
        return braintreeClient;
      } catch (err) {
        // console.error('❌ Failed to initialize Braintree SDK:', err);
        setError(err.message);
        setIsInitialized(false);
        throw err;
      } finally {
        setIsInitializing(false);
        initPromiseRef.current = null;
      }
    })();

    initPromiseRef.current = promise;
    return promise;
  }, [client, currentMethod, currentType, isInitialized, isInitializing]);

  /**
   * Cleanup Braintree client
   * Call on logout or when leaving payment flow
   */
  const cleanup = useCallback(() => {
    // console.log('🔵 Cleaning up Braintree client...');
    clearBraintreeClient();
    setClient(null);
    setClientToken(null);
    setIsInitialized(false);
    setCurrentMethod(null);
    setCurrentType(null);
    setError(null);
    initPromiseRef.current = null;
  }, []);

  const value = useMemo(() => ({
    // State
    client,
    clientToken,
    isInitialized,
    isInitializing,
    error,
    currentMethod,
    currentType,

    // Actions
    initialize,
    cleanup,
  }), [
    client,
    clientToken,
    isInitialized,
    isInitializing,
    error,
    currentMethod,
    currentType,
    initialize,
    cleanup,
  ]);

  return (
    <BraintreeContext.Provider value={value}>
      {children}
    </BraintreeContext.Provider>
  );
}

BraintreeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to access Braintree context
 * @returns {Object} Braintree context value
 */
export function useBraintree() {
  const context = useContext(BraintreeContext);
  if (!context) {
    throw new Error('useBraintree must be used within BraintreeProvider');
  }
  return context;
}

export default BraintreeProvider;
