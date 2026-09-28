import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
import { StatusCodes } from '@config/AppConfig';
import { useCustomer } from '@context/MobileOne/Customer';
import { appTariffOptionSuccessType } from '@utils/globalConstant';
import { useAlert } from '@context/Utils';
import { useTariff } from '../Tariff';
// import { useOption } from '../Option';

export const PassOfferContext = createContext({});

export function PassOfferContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [bookPassSuccess, setBookPassSuccess] = useState(false);
  const [bookPassError, setBookPassError] = useState(false);

  // Context
  const { getCustomerData } = useCustomer();
  const { setIsGenericError } = useAlert();
  const { onBookingPass } = useMobileOne();
  const { setTariffOptionSuccess } = useTariff();
  
  // Validations

  // Functions
  // Book pass offer if possible function for book option
  const bookPassOffer = async (Code) => {
    try {
      setIsLoading(true);
      const { data, success } = await onBookingPass({ passCode: Code });
      if (data && data.success) {
        setTariffOptionSuccess({ isSuccessful: true, type: appTariffOptionSuccessType.OPTION });
      }
      await getCustomerData();
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
        setIsGenericError(true);
      }
      setIsLoading(false);
      return error;
    }
  };

  // Book pass offer if possible function for book option
  // NOTE: this is used for multiple tariff options (not just SpeedOns)
  // REFACTOR: rename to generic function name
  const bookPassOfferSpeedOn = async (Code, isAdditionalOption = false) => {
    try {
      setIsLoading(true);
      const { data, success } = await onBookingPass({ passCode: Code });
      if (success) {
        setTariffOptionSuccess({
          isSuccessful: true,
          type: isAdditionalOption
            ? appTariffOptionSuccessType.ADDITIONAL_OPTION
            : appTariffOptionSuccessType.SPEED_ON
        });
        setBookPassError(false);
        await getCustomerData();
        setIsLoading(false);
      } else {
        setBookPassError(true);
        setIsLoading(false);
      }
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
        setBookPassError(true);
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
      bookPassOffer,
      bookPassSuccess,
      setBookPassSuccess,
      bookPassError,
      setBookPassError,
      bookPassOfferSpeedOn
    }),
    [
      // States
      isLoading,
      setIsLoading,
      bookPassOffer,
      bookPassSuccess,
      setBookPassSuccess,
      bookPassError,
      setBookPassError,
      bookPassOfferSpeedOn
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <PassOfferContext.Provider value={contextPayload}>{children}</PassOfferContext.Provider>;
}
PassOfferContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const usePassOffer = () => useContext(PassOfferContext);

export default PassOfferContext;
