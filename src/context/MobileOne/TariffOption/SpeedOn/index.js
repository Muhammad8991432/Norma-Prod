/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
import { useCustomer } from '@context/MobileOne/Customer';
import { StatusCodes } from '@config/AppConfig';
import { useStaticContent } from '@context/StaticContent';
import { appPassCodes, appTariffOptionSuccessType } from '@utils/globalConstant';
import { useTariff } from '../Tariff';

export const SpeedOnContext = createContext({});

export function SpeedOnContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [passOffers, setPassOffers] = useState([]);
  const [dayFlat, setDayFlat] = useState([]);
  const [speedOns, setSpeedOns] = useState([]);
  // Context
    const { staticContentData } = useStaticContent();
    const { onPassoffer, onBookOption } = useMobileOne();
  const { getCustomerData, customerBalance } = useCustomer();
  const { setTariffOptionSuccess } = useTariff();
  
  // Validations

  // Functions
  const onLoad = async () => {
    try {
      setIsLoading(true);
      const { data, success, status } = await onPassoffer();
      if (status === StatusCodes.OK || success) {
        let newData = data;
        for (let elem of newData) {
          let price = elem?.price?.grossAmount ? elem.price.grossAmount / 10000 : 0;
          if (price < customerBalance.totalBalance) {
            elem.hasLowBalance = false;
          } else {
            elem.hasLowBalance = true;
          }
          }
        setPassOffers(newData);
      }
        setIsLoading(false);
      return null;
    } catch (error) {
      setIsLoading(false);
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
      return error;
    }
  };

  // Book speedOn if possible
  const bookSpeedOn = async (speedonId) => {
    try {
      setIsLoading(true);
      const { data, status, success } = await onBookOption(speedonId);

      await getCustomerData();
      if (success) {
        setTariffOptionSuccess({ isSuccessful: true, type: appTariffOptionSuccessType.SPEED_ON });
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
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
      return error;
    }
  };

  const splitPassOffers = () => {
    const { speedOnsPassCodes, dayFlatPassCodes } =
      staticContentData?.nc_passCodesSettings || appPassCodes;
    const findDayFlat = passOffers.filter((offer) => dayFlatPassCodes.includes(offer.passCode));
    if (findDayFlat) {
      setDayFlat(findDayFlat);
    } else {
      setDayFlat([]);
    }

    const findSpeedOns = passOffers.filter((offer) => speedOnsPassCodes.includes(offer.passCode)).sort((a, b) => speedOnsPassCodes.indexOf(a.passCode) - speedOnsPassCodes.indexOf(b.passCode));
    if (findSpeedOns) {
      setSpeedOns(findSpeedOns);
    } else {
      setSpeedOns([]);
    }
  };

  // Hooks
  useEffect(() => {
    const totalBalance = customerBalance.totalBalance ? customerBalance.totalBalance : null;
    if (totalBalance !== null) {
      // onLoad();
    }
  }, [customerBalance]);

  useEffect(() => {
    if (passOffers.length > 0 && staticContentData) {
      splitPassOffers();
    }
  }, [passOffers, staticContentData]);

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading,
      onLoad,
      passOffers,
      setPassOffers,
      dayFlat,
      setDayFlat,
      speedOns,
      setSpeedOns,

      bookSpeedOn
    }),
    [
      // States
      isLoading,
      setIsLoading,
      onLoad,
      passOffers,
      setPassOffers,
      dayFlat,
      setDayFlat,
      speedOns,
      setSpeedOns,

      bookSpeedOn
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <SpeedOnContext.Provider value={contextPayload}>{children}</SpeedOnContext.Provider>;
}
SpeedOnContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useSpeedOn = () => useContext(SpeedOnContext);

export default SpeedOnContext;
