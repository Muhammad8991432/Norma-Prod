import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
import { StatusCodes } from '@config/AppConfig';
import { useCustomer } from '@context/MobileOne/Customer';
import { appRoute } from '@utils/globalConstant';

export const DataPassContext = createContext({});

export function DataPassContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  // Context
  const { getCustomerData } = useCustomer();
  const { onBookOption } = useMobileOne();
  const navigate = useNavigate();

  // Validations

  // Functions
  // Book data pass if possible
  const bookDataPass = async (datapassId) => {
    try {
      setIsLoading(true);
      const { data, status, success } = await onBookOption(datapassId);
      await getCustomerData();
      navigate(appRoute.TARIFF_OPTION);
      setIsLoading(false);

      return data;
    } catch (error) {
      if (
        !(
          error?.status === StatusCodes.UNAUTHORIZED ||
          error?.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.FORBIDDEN
        )
      ) {
        // pass
      }
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
      bookDataPass
    }),
    [
      // States
      isLoading,
      setIsLoading,
      bookDataPass
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <DataPassContext.Provider value={contextPayload}>{children}</DataPassContext.Provider>;
}
DataPassContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useDataPass = () => useContext(DataPassContext);

export default DataPassContext;
