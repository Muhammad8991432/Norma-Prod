import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export const VoucherContext = createContext({});

export function VoucherContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  // Context

  // Validations

  // Functions

  // Hooks

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading
    }),
    [
      // States
      isLoading,
      setIsLoading
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <VoucherContext.Provider value={contextPayload}>{children}</VoucherContext.Provider>;
}
VoucherContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useVoucher = () => useContext(VoucherContext);

export default VoucherContext;
