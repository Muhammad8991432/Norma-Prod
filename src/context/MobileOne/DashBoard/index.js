/* eslint-disable prefer-const */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useStaticContent } from '@context/StaticContent';
import { useA11y } from '@context/Utils';
import { Ta11yText } from '@core/index';
import {
  appTariffStatus,
  getDataExpiryTime,
  getTariffStatusKey
} from '@utils/globalConstant';
import { replaceDynamicCmsContent } from '@utils/a11y/a11yHelpers';
import { useCustomer } from '../Customer';
import { useOption, useSpeedOn, useTariff } from '../TariffOption';

export const DashBoardContext = createContext({});

export function DashBoardContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [tariffDetails, setTariffDetails] = useState({});
  const [activeProduct, setActiveProduct] = useState({
    tariff: {},
    status: { id: false },
    endDate: false
  });
  const [pendingProduct, setPendingProduct] = useState({
    tariff: {},
    status: { id: false },
    endDate: false
  });
  
  const [tariffStatus, setTariffStatus] = useState(false); // False | ACTIVE - Display Nothing | PAUSED | Change In progress
  const [isMultiData, setIsMultiData] = useState(false);
  const [dataUsage, setDataUsage] = useState([]);
  const [smsUsage, setSmsUsage] = useState([]);
  const [voiceUsage, setVoiceUsage] = useState([]);
  const [activeOptions, setActiveOptions] = useState([]);
  const [requestedOptions, setResponseData] = useState([]);
  const [open5GModal, setOpen5GModal] = useState(false);
  const [genericOptionCounterData, setGenericOptionCounterData] = useState([]);
  const [genericTariffCounterData, setGenericTariffCounterData] = useState([]);
  const [transformedOptionCounterData, setTransformedOptionCounterData] = useState([]);
  const [transformedTariffCounterData, setTransformedTariffCounterData] = useState([]);
  const [tariffCounterExpiryTime, setTariffCounterExpiryTime] = useState(null);
  const [notShowTariffOption, setNotShowTariffOption] = useState(false);

  // Context
  const { staticContentData } = useStaticContent();
  const { tA11yTranslate } = useA11y();
  const {
    isLoading: isCustomerLoading,
    customerProductsOriginal,
    customerData,
    customerBalance,
    customerUsage,
    personalData: { firstName = false, lastName = false },
    tariffChangeActive
  } = useCustomer();
  const { isLoading: isTariffLoading, activeTariff } = useTariff();
  const { isLoading: isOptionLoading, bookableOptions, bookedOptions } = useOption();
  const { isLoading: isSpeedOnLoading, passOffers } = useSpeedOn();

  // Validations

  // Functions

  // format remaining volume according to the unit (this uses the transformed data)
  const getRemainingVolume = (findDataCounter) => {
    let remainingValue = findDataCounter?.remainingValue;
    const remainingUnit = findDataCounter?.remainingUnit;

    if (findDataCounter?.remainingUnit === 'MB') {
      remainingValue = Math.floor(remainingValue);
    }
    remainingValue = remainingValue?.toString().replace('.', ',');
    return replaceDynamicCmsContent(
      replaceDynamicCmsContent(
        tA11yTranslate('nc_global_dboard_flat_remaining_vol'),
        '{remainingVolume}',
        remainingValue
      ),
      '{unit}',
      remainingUnit
    );
  };

  // format remaining volume according to the unit (this uses the original api data)
  const getRemainingApiVolume = (counter) => {
    const [remainingValueStr, remainingUnit] = (counter?.remainingVolume ?? '').split(' ');
    let remainingValue = parseFloat(remainingValueStr.replace(',', '.'), 10);
    if (remainingUnit === 'MB') {
      remainingValue = Math.floor(remainingValue);
    }
    remainingValue = remainingValue.toString().replace('.', ',');
    return replaceDynamicCmsContent(
      replaceDynamicCmsContent(
        tA11yTranslate('nc_global_dboard_flat_remaining_vol'),
        '{remainingVolume}',
        remainingValue
      ),
      '{unit}',
      remainingUnit
    );
  };

  // build string showing availability until end date
  const getOptionAvailableUntilDate = (dateUntilAvailable, optionData) => {
    if (!dateUntilAvailable) {
      return '';
    }
    const { expiryDate, expiryTime } = getDataExpiryTime(dateUntilAvailable);
    let dateUntilAvailableContent = replaceDynamicCmsContent(
      replaceDynamicCmsContent(
        tA11yTranslate(optionData.status && optionData.status.id === appTariffStatus.TERMINATION_REQUESTED ? 'nc_global_cncled_options_txt1' : 'nc_global_dboard_opt_available_until_txt1'),
        '{expiryDate}',
        expiryDate
      ),
      '{expiryTime}',
      expiryTime
    );
    if (optionData.status && optionData.status.id === appTariffStatus.TERMINATION_REQUESTED) {
      dateUntilAvailableContent = replaceDynamicCmsContent(
        dateUntilAvailableContent,
        '{ENDDATE}',
        expiryDate || ''
      );
    }
    return (
      <Ta11yText
        textContent={dateUntilAvailableContent}
        tag="span"
      />
    );
  };

  // Hooks

  // Loading Hook
  useEffect(() => {
    setIsLoading(isCustomerLoading || isTariffLoading || isOptionLoading || isSpeedOnLoading);

    // Clean up
    return () => {
      setIsLoading(false);
    };
  }, [isCustomerLoading, isTariffLoading, isOptionLoading, isSpeedOnLoading]);

  // Set tariff details & status for dashboard
  useEffect(() => {
    // Find active tariff to view it on dashboard
    if (
      customerProductsOriginal &&
      customerProductsOriginal.length > 0 &&
      activeTariff &&
      activeTariff.length > 0
    ) {
      let findTariff = null;
      let findPendingTariff = null;
      findPendingTariff = customerProductsOriginal.find(
        ({ status }) => status.id === appTariffStatus.ACTIVATION_PENDING
      );

      findTariff = customerProductsOriginal.find(({ status }) => status.id === appTariffStatus.PAUSED);

      if (!findTariff) {
        findTariff = customerProductsOriginal.find(({ status }) => status.id === appTariffStatus.ACTIVE);
      }

      // Find every remaining tariff with an status id greater than 0. Except PAUSED and ACTIVE (as filtered before)
      // and ACTIVATION_PENDING (which has the value 0 and is filtered separately above with 'findPendingTariff').
      if (!findTariff) {
        findTariff = customerProductsOriginal.find(({ status }) => status.id > 0);
      }

      if (findTariff?.tariff?.id && findTariff?.status) {
        const findCurrentTariff = activeTariff.find(
          ({ tariff }) => tariff.id === findTariff?.tariff?.id
        );
        // Find & Set Status Id
        const statusKey = getTariffStatusKey(findTariff?.status.id);

        setTariffStatus(statusKey);

        // Set tariff for details
        setTariffDetails(findCurrentTariff?.tariff);
        setActiveProduct(findCurrentTariff);
      }
    }

    // Clean up
    return () => {
      setTariffStatus(false);
      setTariffDetails({});
    };
  }, [customerProductsOriginal, activeTariff]);

  // Set customer usage details
  useEffect(() => {
    if (customerUsage) {
      const {
        usage: { counters } = { usage: { counters: [] } },
        counters: { DATA, SMS, VOICE, isMultiData: multiData } = {}
      } = customerUsage;
      if (multiData) {
        setIsMultiData(true);
      }

      if (DATA) setDataUsage(DATA);
      if (SMS) setSmsUsage(SMS);
      if (VOICE) setVoiceUsage(VOICE);

      // handle transformed data in counters (transformed by function 'getUsageResponse' in dom-mo-sdk)
      if (DATA && DATA.length > 0) {
        const transformedCounterData = [];
        const transformedTariffData = [];
        DATA.map((item) => {
          // find tariff data counter
          if (item.passCode && (
            staticContentData?.nc_countersTDM2Settings?.dashboardTariffDataCounterIdentifier?.includes(
              item.name
            ) ||
            staticContentData?.nc_countersTDM2Settings?.dashboardTariffDataCounterIdentifier?.includes(
              item.displayName
            )
          )) {
            transformedTariffData.push(item);
            setTariffCounterExpiryTime(item.originalData.expiryTime);
          } else {
            const findTransformedDataCounter = DATA.find(
              ({ passCode }) => passCode && passCode === item.passCode
            );

            // passCode field exists in transformed data and has a (truthy) value
            if (findTransformedDataCounter) {
              // add type of option card
              findTransformedDataCounter.optionCardType = 'dataCard';
              transformedCounterData.push({ ...item, ...findTransformedDataCounter });
            }
          }
          return item;
        });
        const sortedTransformedCounters = transformedCounterData.sort((a, b) => b.priority - a.priority);
        setTransformedOptionCounterData(sortedTransformedCounters);
        setTransformedTariffCounterData(transformedTariffData);
      }

      // handle original API data in counters
      if (counters && counters.length > 0) {
        const counterData = [];
        const tariffData = [];
        counters.map((item) => {
          // find tariff data counter
          if (
            staticContentData?.nc_countersTDM2Settings?.dashboardTariffDataCounterIdentifier?.includes(
              item.name
            ) ||
            staticContentData?.nc_countersTDM2Settings?.dashboardTariffDataCounterIdentifier?.includes(
              item.displayName
            )
          ) {
            tariffData.push(item);
          } else {
            // comparing original API data (counters) with transformed data by function 'getUsageResponse' in dom-mo-sdk, stored in DATA 
            const findDataCounter = counters.find(
              ({ passCode }) => passCode && passCode === item.passCode
            );

            if (findDataCounter) {
              counterData.push({ ...item, ...findDataCounter });
            } else {
              counterData.push(item);
            }
          }
          return item;
        });
        const sortedCounters = counterData.sort((a, b) => b.priority - a.priority);
        setGenericOptionCounterData(sortedCounters);
        setGenericTariffCounterData(tariffData);
      }
    }

    // Clean up
    return () => {
      setDataUsage({});
      setSmsUsage({});
      setVoiceUsage({});
      setTransformedOptionCounterData([]);
      setTransformedTariffCounterData([]);
      setGenericOptionCounterData([]);
      setGenericTariffCounterData([]);
    };
  }, [customerUsage]);

  useEffect(() => {
    const { msisdn = false, ...restCustomerData } = customerData;
    if (restCustomerData && msisdn && activeTariff) {
      const findTariff = activeTariff.find(({ status }) => status.id);
      if (findTariff) {
        const {
          tariff: { id } = { tariff: { id: false } } // , price, duration
        } = findTariff;
      }
    }
  }, [customerData, activeTariff]);

  useEffect(() => {
    if (
      activeProduct?.tariff &&
      activeProduct?.tariff.id &&
      staticContentData &&
      staticContentData?.nc_noDisplayInTariffCard
    ) {
      setNotShowTariffOption((staticContentData.nc_noDisplayInTariffCard || []).includes(activeProduct?.tariff?.id));
    }
  }, [staticContentData, activeProduct]);

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading,
      tariffDetails,
      setTariffDetails,
      activeProduct,
      setActiveProduct,
      pendingProduct, 
      setPendingProduct,
      tariffStatus,
      setTariffStatus,
      customerUsage,
      open5GModal,
      setOpen5GModal,
      genericOptionCounterData,
      setGenericOptionCounterData,
      genericTariffCounterData,
      setGenericTariffCounterData,
      transformedOptionCounterData,
      setTransformedOptionCounterData,
      transformedTariffCounterData,
      setTransformedTariffCounterData,
      tariffCounterExpiryTime,
      setTariffCounterExpiryTime,
      tariffChangeActive,
      notShowTariffOption, 
      setNotShowTariffOption,

      customerData,
      customerBalance,

      isMultiData,
      dataUsage,
      setDataUsage,
      voiceUsage,
      setVoiceUsage,
      smsUsage,
      setSmsUsage,
      activeOptions,
      setActiveOptions,
      bookableOptions,
      bookedOptions,
      passOffers,

      // functions
      getRemainingVolume,
      getRemainingApiVolume,
      getOptionAvailableUntilDate,
    }),
    [
      // States
      isLoading,
      setIsLoading,
      tariffDetails,
      setTariffDetails,
      activeProduct,
      setActiveProduct,
      pendingProduct, 
      setPendingProduct,
      tariffStatus,
      setTariffStatus,
      customerUsage,
      open5GModal,
      setOpen5GModal,
      genericOptionCounterData,
      setGenericOptionCounterData,
      genericTariffCounterData,
      setGenericTariffCounterData,
      tariffCounterExpiryTime,
      transformedOptionCounterData,
      setTransformedOptionCounterData,
      transformedTariffCounterData,
      setTransformedTariffCounterData,
      setTariffCounterExpiryTime,
      tariffChangeActive,
      notShowTariffOption, 
      setNotShowTariffOption,

      customerData,
      customerBalance,

      isMultiData,
      dataUsage,
      setDataUsage,
      voiceUsage,
      setVoiceUsage,
      smsUsage,
      setSmsUsage,
      requestedOptions,
      setResponseData,
      activeOptions,
      setActiveOptions,
      bookableOptions,
      bookedOptions,
      passOffers,

      // functions
      getRemainingVolume,
      getRemainingApiVolume,
      getOptionAvailableUntilDate,
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <DashBoardContext.Provider value={contextPayload}>{children}</DashBoardContext.Provider>;
}
DashBoardContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useDashBoard = () => useContext(DashBoardContext);

export default DashBoardContext;
