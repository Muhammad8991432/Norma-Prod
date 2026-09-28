/**
 * Public Online TopUp Context
 * Manages state for the 3-step public online top-up flow (cross-origin iframe safe)
 *
 * State:
 * - msisdn: phone number
 * - amount: selected top-up amount
 * - email: contact email for confirmation
 * - selectedPayment: chosen payment method
 * - consent: user consent/agreement
 *
 * Uses context-only state (no storage) for cross-origin iframe compatibility.
 * State persists within the flow but is lost on page refresh.
 */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const PublicOnlineTopUpContext = createContext({});

export function PublicOnlineTopUpProvider({ children }) {
  const initialPublicOnlineTopupPayment = {
    msisdn: '',
    amount: '',
    email: '',
    selectedPayment: '',
    consent: false
  };

  const [publicOnlineTopupPayment, setPublicOnlineTopupPayment] = useState(initialPublicOnlineTopupPayment);

  // Reset payment state (context-only; no storage)
  const resetPublicOnlineTopupPayment = useCallback(() => {
    setPublicOnlineTopupPayment(initialPublicOnlineTopupPayment);
  }, []);

  // Memoized context value
  const value = useMemo(
    () => ({
      publicOnlineTopupPayment,
      setPublicOnlineTopupPayment,
      resetPublicOnlineTopupPayment
    }),
    [publicOnlineTopupPayment, resetPublicOnlineTopupPayment]
  );

  return (
    <PublicOnlineTopUpContext.Provider value={value}>
      {children}
    </PublicOnlineTopUpContext.Provider>
  );
}

PublicOnlineTopUpProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Hook to access PublicOnlineTopUp context
 * @returns {Object} PublicOnlineTopUp context value with state and actions
 */
export function usePublicOnlineTopUp() {
  const context = useContext(PublicOnlineTopUpContext);
  if (!context) {
    throw new Error('usePublicOnlineTopUp must be used within PublicOnlineTopUpProvider');
  }
  return context;
}

export default PublicOnlineTopUpProvider;
