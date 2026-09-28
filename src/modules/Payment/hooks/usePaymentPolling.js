// For results polling after initiating payment
// https://dom.openproject.eu/projects/tdm-14x-mps-umsetzung/wiki/result-call
// Purpose: Continuously polls the backend /result/{lookup_key} endpoint until the payment is completed, fails, unauthorized, or times out.
// NOTE: usePaymentPolling does not itself initiate a payment; it just keeps checking the status after a payment has been started.

import { useEffect, useRef, useState, useCallback } from 'react';
import paymentService from '@services/payment';
import { usePayment } from '@context/Payment';

const DEFAULT_INTERVAL = 3000; // 3s
const DEFAULT_TIMEOUT = 60000; // 60s

/**
 * usePaymentPolling
 *
 * Polls /result/{lookup_key} until:
 * - completed
 * - error
 * - timeout
 *
 * @param {string} lookupKey
 * @param {object} options
 */
export function usePaymentPolling(lookupKey, options = {}) {
  const { interval = DEFAULT_INTERVAL, timeout = DEFAULT_TIMEOUT } = options;
  const { setMpsPaymentResult, setMpsPaymentStatus } = usePayment();

  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [enablePolling, setEnablePolling] = useState(false);

  const isActiveRef = useRef(false);
  const timeoutRef = useRef(null);

  // ----------------------------
  // Stop polling
  // ----------------------------
  const stopPolling = useCallback(() => {
    isActiveRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  // ----------------------------
  // Poll loop (updated for backend contract)
  // ----------------------------
  const pollLoop = useCallback(async () => {
    if (!lookupKey || !isActiveRef.current) return;

    try {
      const res = await paymentService.getPaymentResult(lookupKey);

      // Interpret HTTP status codes directly
      const statusCode = res.statusCode || res.status; // adapt to your fetch/axios/etc.

      if (statusCode === 200) {
        // Validate result (checks state when completed=true)
        const validatedResult = paymentService.validatePaymentResult(res.data);

        // Check for error in validation
        if (validatedResult?.error) {
          setStatus('error');
          setError(validatedResult.message || 'Payment error');
          setResult(validatedResult);
          setMpsPaymentStatus('error');
          setMpsPaymentResult(validatedResult);
          stopPolling();
          return;
        }

        // Check completed flag in response body
        if (validatedResult?.completed) {
          setStatus('completed');
          setResult(validatedResult);
          setMpsPaymentStatus('completed');
          setMpsPaymentResult(validatedResult);
          stopPolling();
          return;
        }
        // Still processing
        setStatus('pending');
        setResult(validatedResult);
        setMpsPaymentStatus('pending');
        setMpsPaymentResult(validatedResult);
        timeoutRef.current = setTimeout(pollLoop, interval);
        return;
      }

      // MPS: 401 handling is intentionally skipped here. Token refresh is automatically handled
      // by the HTTP interceptor in Payment context (mpsApiClient), which catches 401 errors,
      // exchanges refresh token for new access token, and retries the request.
      // See: src/context/Payment/index.js (mpsApiClient.interceptors.response)
      // // Token missing, invalid, or cannot be verified.
      // if (statusCode === 401) {
      //   setStatus('unauthorized');
      //   setError('Session expired or invalid token');
      //   setMpsPaymentStatus('error');
      //   setMpsPaymentResult({ error: true, message: 'Session expired or invalid token' });
      //   stopPolling();
      //   return;
      // }

      // Token is valid but does not belong to the user that owns the payment context.
      if (statusCode === 403) {
        setStatus('forbidden');
        setError('Token does not match payment context user');
        setMpsPaymentStatus('error');
        setMpsPaymentResult({ error: true, message: 'Token does not match payment context user' });
        stopPolling();
        return;
      }

      // No payment context exists for this lookup_key (not initiated yet, not received yet, or expired in Redis).
      if (statusCode === 404) {
        setStatus('not_found');
        setError('Payment context not found or expired');
        setMpsPaymentStatus('error');
        setMpsPaymentResult({ error: true, message: 'Payment context not found or expired' });
        stopPolling();
        return;
      }

      // Any other non-200
      setStatus('error');
      setError(res.data?.message || `Error: ${statusCode}`);
      setMpsPaymentStatus('error');
      setMpsPaymentResult({ error: true, message: res.data?.message || `Error: ${statusCode}` });
      stopPolling();
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Polling failed');
      setMpsPaymentStatus('error');
      setMpsPaymentResult({ error: true, message: err.message || 'Polling failed' });
      stopPolling();
    }
  }, [lookupKey, interval, stopPolling, setMpsPaymentStatus, setMpsPaymentResult]);

  // ----------------------------
  // Start polling
  // ----------------------------
  const startPolling = useCallback(() => {
    if (!lookupKey) return;

    setStatus('pending');
    setResult(null);
    setError(null);

    isActiveRef.current = true;

    // global timeout (single source of truth)
    const timeoutId = setTimeout(() => {
      setStatus('timeout');
      setError('Polling timed out');
      setMpsPaymentStatus('error');
      setMpsPaymentResult({ error: true, message: 'Polling timed out' });
      stopPolling();
    }, timeout);

    timeoutRef.current = timeoutId;

    // NOTE: here we can implement timeframe between individual polls if needed
    // start loop
    pollLoop();
  }, [lookupKey, timeout, pollLoop, stopPolling]);

  // ----------------------------
  // Auto start
  // ----------------------------
  useEffect(() => {
    if (enablePolling && lookupKey) {
      startPolling();
    }

    return () => stopPolling();
  }, [enablePolling, lookupKey, startPolling, stopPolling]);

  return {
    status, // 'idle' | 'pending' | 'completed' | 'unauthorized' | 'forbidden' | 'not_found' | 'timeout' | 'error'
    result, // backend PaymentStatus
    error, // string | null
    isPolling: status === 'pending',
    startPolling,
    stopPolling,
    enablePolling,
    setEnablePolling
  };
}

export default usePaymentPolling;
