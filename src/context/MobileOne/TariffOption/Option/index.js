/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
import { StatusCodes } from '@config/AppConfig';
import { useCustomer } from '@context/MobileOne/Customer';
import {
  appOptionIds,
  appTariffOptionSuccessType,
  appUsageMeasurementsUnits,
  appRoute
} from '@utils/globalConstant';
import { replaceDynamicCmsContent } from '@utils/a11y/a11yHelpers';
import { useA11y } from '@context/Utils';

import { useTariff } from '@context/MobileOne/TariffOption/Tariff';
import { useStaticContent } from '@context/StaticContent';

export const OptionContext = createContext({});

export function OptionContextProvider({ children }) {
  // Context
  const { staticContentData } = useStaticContent();
  const { tA11yTranslate } = useA11y();
  const { getCustomerData, customerBalance, customerUsage, tariffChangeActive } = useCustomer();

  const { onAllOptions, onBookableOptions, onBookedOptions, onBookOption, onTerminateOption } =
    useMobileOne();
  const { setTariffOptionSuccess } = useTariff();
  const navigate = useNavigate();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [bookOptionSuccess, setBookOptionSuccess] = useState(false);
  const [allOptions, setAllOptions] = useState([]);
  const [bookableOptions, setBookableOptions] = useState([]);
  const [bookedOptions, setBookedOptions] = useState([]);
  const [bookedOptionsWithCounters, setBookedOptionsWithCounters] = useState([]);
  const [bookOptionError, setBookOptionError] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [optionCancellationSuccess, setOptionCancellationSuccess] = useState(false);
  const [optionCancellationFailed, setOptionCancellationFailed] = useState(false);
  const [showOptionBookingCreditReminderModal, setShowOptionBookingCreditReminderModal] =
    useState(false);

  // Validations
  const termsValidations = Yup.object().shape({
    terms: Yup.boolean().isTrue('please_select_terms_and_conditions')
  });

  const popupCancelData = {
    id: 1,
    startDate: '',
    endDate: '',
    topClose: true,
    intialMonthDays: '',
    label: '',
    content: [
      {
        type: 'image',
        image: '',
        imageWeb: 'nc_icon_cancel_content1'
      },
      {
        type: 'headline',
        tag: 'h3',
        txt: 'nc_pop_up_cncl_options_hdl1'
      },
      {
        type: 'button',
        buttonTitle: 'nc_pop_up_cncl_options_btn1',
        buttonBackgroundcolor: '',
        buttonBackgroundcolorDark: '',
        buttonTitleColor: '',
        buttonTitleColorDark: '',
        variantWeb: 'mint',
        redirectionLink: '',
        redirectionLinkWeb: () => {
          cancelAnOption(showCancelModal.id);
        }
      },
      {
        type: 'link',
        txt: 'nc_pop_up_cncl_options_lnk1',
        action: 'closePopup'
      }
    ]
  };

  // Insufficient credit popup for option booking ("Dein Guthaben reicht leider nicht aus")
  const popupCampaignDataOptionBooking = {
    id: 1,
    startDate: '',
    endDate: '',
    intialMonthDays: '',
    label: '',
    content: [
      {
        type: 'image',
        image: '',
        imageWeb: 'nc_icon_sad_content1'
      },
      {
        type: 'headline',
        tag: 'h2',
        txt: 'nc_tariff_options_detail_popup_err_hdl1'
      },
      {
        type: 'copy',
        tag: 'p',
        txt: 'nc_tariff_options_detail_popup_err_txt1'
      },
      {
        type: 'button',
        buttonTitle: 'nc_tariff_options_detail_popup_err_btn1',
        buttonBackgroundcolor: '',
        buttonBackgroundcolorDark: '',
        buttonTitleColor: '',
        buttonTitleColorDark: '',
        variantWeb: 'mint',
        redirectionLink: '',
        redirectionLinkWeb: () => {
          setShowOptionBookingCreditReminderModal(false);
          // MPS: Note: changed to new MPS topup overview page
          navigate(appRoute.MPS_TOPUP_OVERVIEW);
        }
      },
      {
        type: 'link',
        txt: 'nc_tariff_options_detail_popup_err_lnk1',
        action: 'closePopup'
      }
    ]
  };

  // Functions

  // Generates a dynamic name for an option by replacing the placeholder
  // For tariff name please use getTariffName() from TariffContext
  const getOptionName = (optionName, optionNameCmsKey) => {
    let nameOfOption = tA11yTranslate(optionNameCmsKey);
    const shownName = tA11yTranslate(optionName).content;
    nameOfOption = replaceDynamicCmsContent(nameOfOption, '{OPTIONNAME}', shownName);
    return nameOfOption;
  };

  const onOptionfilteredData = (data) => {
    let finalFiltered = [];
    let comingData = [...data];

    for (let [index, value] of comingData.entries()) {
      // Main Array for Whole Data

      let currentGroupID = value?.group?.id;

      if (currentGroupID) {
        // Checking conditions for avilablibily for Group ID

        if (
          finalFiltered.length > 0 &&
          !finalFiltered.find((elem) => {
            return elem.id == value?.group?.id;
          })
        ) {
          let NewData = comingData.filter((elem, index) => {
            return value.group.id === elem.group.id;
          });

          finalFiltered[finalFiltered.length] = {
            ...NewData[0].group,
            ListData: NewData
          };
        } else if (finalFiltered.length === 0) {
          let NewData = comingData.filter((elem, index) => {
            return value.group.id === elem.group.id;
          });

          finalFiltered[finalFiltered.length] = {
            ...NewData[0].group,
            ListData: NewData
          };
        }
      }
    }
    return finalFiltered;
  };

  // Get all options and storing it in state
  const getAllOptions = async () => {
    try {
      const { data } = await onAllOptions();
      // if (data) setAllOptions(data);
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

  // Get bookable options and storing it in state
  const getBookableOptions = async () => {
    let bookableData = [];
    try {
      const { data } = await onBookableOptions();
      if (data) {
        const { etcOptions } = staticContentData.nc_etcOptionSettings;
        const findEtcOptions = data
          .filter((bookable) => etcOptions.includes(bookable.id))
          .sort((a, b) => etcOptions.indexOf(a.id) - etcOptions.indexOf(b.id));
        setBookableOptions(findEtcOptions);
        bookableData = onOptionfilteredData(findEtcOptions);
        for (let elem of bookableData) {
          for (let elem2 of elem.ListData) {
            if (elem2.price < customerBalance.totalBalance) {
              elem2.hasLowBalance = false;
            } else {
              elem2.hasLowBalance = true;
            }
          }
        }
      }
      setAllOptions(bookableData);
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

  // Get booked options and storing it in state
  const getBookedOptions = async () => {
    try {
      setIsLoading(true);
      const { data } = await onBookedOptions();
      if (data) {
        const { etcOptions = [] } = staticContentData?.nc_etcOptionSettings || appOptionIds;
        const bookedOptionsData = data.filter((item) => item && etcOptions.includes(item.id));
        setBookedOptions(bookedOptionsData);
      }
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

  // Function loads after we get customer data, and returns all options, bookable and booked options
  const afterLoad = async () => {
    try {
      setIsLoading(true);
      await getBookedOptions();
      setIsLoading(false);
      return null;
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  // Book an option if possible
  const bookAnOption = async (optionId) => {
    try {
      setIsLoading(true);
      const { data, status, success } = await onBookOption(optionId);
      if (data && data.success) {
        setTariffOptionSuccess({ isSuccessful: true, type: appTariffOptionSuccessType.OPTION });
        setBookOptionError(false);
        await getCustomerData();
        setIsLoading(false);
      } else {
        setBookOptionError(true);
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
        setBookOptionError(true);
      }

      return error;
    }
  };

  // Cancel an option if possible
  const cancelAnOption = async (optionId) => {
    try {
      setIsLoading(true);
      const { data, status, success } = await onTerminateOption(optionId);
      if (data && data.success) {
        setOptionCancellationSuccess(true);
      } else {
        setOptionCancellationFailed(true);
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
        setOptionCancellationFailed(true);
      }

      return error;
    }
  };

  const isCounterOrFreeUnitsAvailable = (option) => {
    const {
      usage: { counters: allCounters = [], freeUnits = [] }
    } = customerUsage;

    const findCountersAvailable = allCounters.filter(
      (item) => item && option && item.productId === option.id
    );
    const findFreeUnitsAvailable = freeUnits.filter(
      (item) => item && option && item.productId === option.id
    );

    return findCountersAvailable.length > 0 || findFreeUnitsAvailable.length > 0;
  };

  const findCounters = (option) => {
    const {
      usage: { counters: allCounters = [], freeUnits = [] }
    } = customerUsage;

    const findCountersAvailable = allCounters
      .filter((item) => item && option && item.productId === option.id)
      .map((item) => ({
        ...item,
        optionCardType: 'dataCardETCOne'
      }));

    const { additionalInfo } = staticContentData?.nc_etcOptionSettings || appOptionIds;

    // priority is set to -1 for minutes and -2 for sms
    const findFreeUnitsAvailable = freeUnits
      .filter((item) => item && option && item.productId === option.id)
      .map((item) => ({
        ...item,
        priority: item.unit === appUsageMeasurementsUnits.Minuten ? -1 : -2,
        optionCardType: 'noDataCard'
      }));

    const allCountersList = [...findCountersAvailable, ...findFreeUnitsAvailable];

    return allCountersList.map((item) => ({
      ...item,
      ...option,
      flatrate: additionalInfo[option.id]?.flatrate || false
    }));
  };

  // Hooks
  // to check the all options, bookable and booked options
  useEffect(() => {
    const totalBalance = customerBalance.totalBalance ? customerBalance.totalBalance : null;
    if (totalBalance !== null) {
      afterLoad();
    }
  }, [customerBalance]);

  useEffect(() => {
    let allBookedOptions = [];

    // one or more ETC One options do exist (call /option/booked)
    if (bookedOptions && bookedOptions.length > 0) {
      bookedOptions.forEach((option, index) => {
        const { etcOptions = [], additionalInfo } =
          staticContentData?.nc_etcOptionSettings || appOptionIds;
        // do not use the booked options that are not in the ETC One options whitelist
        if (etcOptions && etcOptions.length > 0 && etcOptions.includes(option.id)) {
          // check if ETC One option from /option/booked call is listed in /usage/countersTDM2
          // either in counters (data) or freeUnits (min / sms)
          if (isCounterOrFreeUnitsAvailable(option)) {
            const findCountersListData = findCounters(option);
            allBookedOptions = [
              ...allBookedOptions,
              ...findCountersListData.map((item) => ({
                ...item,
                flatrate: additionalInfo[option.id]?.flatrate,
                name: additionalInfo[option.id]?.additionalTitle
                  ? `${option.name} ${additionalInfo[option.id]?.additionalTitle}`
                  : option.name
              }))
            ];
          } else {
            // handles Allnet Flat (which has no entry in freeUnits list)
            allBookedOptions = [
              ...allBookedOptions,
              {
                ...option,
                flatrate: additionalInfo[option.id]?.flatrate,
                name: additionalInfo[option.id]?.additionalTitle
                  ? `${option.name} ${additionalInfo[option.id]?.additionalTitle}`
                  : option.name,
                // add type of option card
                optionCardType: 'noDataCard'
              }
            ];
          }
        }
      });
    }

    setBookedOptionsWithCounters(
      allBookedOptions.sort((a, b) => {
        return (b?.priority || 0) - (a?.priority || 0);
      })
    );
  }, [staticContentData, customerUsage, bookedOptions]);

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading,
      allOptions,
      bookableOptions,
      bookedOptions,
      bookOptionSuccess,
      setBookOptionSuccess,
      bookedOptionsWithCounters,
      setBookedOptionsWithCounters,
      bookOptionError,
      setBookOptionError,
      tariffChangeActive,
      bookAnOption,
      termsValidations,
      getAllOptions,
      getBookableOptions,
      getBookedOptions,
      getOptionName,
      showCancelModal,
      setShowCancelModal,
      optionCancellationSuccess,
      setOptionCancellationSuccess,
      optionCancellationFailed,
      setOptionCancellationFailed,
      popupCancelData,
      popupCampaignDataOptionBooking,
      showOptionBookingCreditReminderModal,
      setShowOptionBookingCreditReminderModal,
    }),
    [
      // States
      isLoading,
      setIsLoading,
      allOptions,
      bookableOptions,
      bookedOptions,
      bookOptionSuccess,
      setBookOptionSuccess,
      bookedOptionsWithCounters,
      setBookedOptionsWithCounters,
      bookOptionError,
      setBookOptionError,
      tariffChangeActive,
      bookAnOption,
      termsValidations,
      getAllOptions,
      getBookableOptions,
      getBookedOptions,
      getOptionName,
      showCancelModal,
      setShowCancelModal,
      optionCancellationSuccess,
      setOptionCancellationSuccess,
      optionCancellationFailed,
      setOptionCancellationFailed,
      popupCancelData,
      showOptionBookingCreditReminderModal,
      setShowOptionBookingCreditReminderModal,
      popupCampaignDataOptionBooking
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <OptionContext.Provider value={contextPayload}>{children}</OptionContext.Provider>;
}
OptionContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useOption = () => useContext(OptionContext);

export default OptionContext;
