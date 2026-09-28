import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
import { useCustomer } from '@context/MobileOne/Customer';
import { appRoute } from '@utils/globalConstant';

export const RoamingContext = createContext({});

export function RoamingContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);

  // Context
  const { getCustomerData } = useCustomer();
  const { onBookOption } = useMobileOne();
  const navigate = useNavigate();

  // Validations

  // Functions
  // Book roaming if possible
  const bookRoming = async (roamingId) => {
    try {
      setIsLoading(true);
      const { data, status, success } = await onBookOption(roamingId);

      await getCustomerData();
      navigate(appRoute.TARIFF_OPTION);
      setIsLoading(false);

      return data;
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  // Hooks

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading,

      bookRoming
    }),
    [
      // States
      isLoading,
      setIsLoading,

      bookRoming
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <RoamingContext.Provider value={contextPayload}>{children}</RoamingContext.Provider>;
}
RoamingContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useRoaming = () => useContext(RoamingContext);

export default RoamingContext;
