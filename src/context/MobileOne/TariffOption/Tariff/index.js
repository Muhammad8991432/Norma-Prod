/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { useStaticContent } from '@context/StaticContent';
import { useCustomer } from '@context/MobileOne/Customer';
import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
import { appRoute, appTariffStatus, appTariffOptionSuccessType } from '@utils/globalConstant';
import {
  appAPIUri,
  appAPIHeaders,
  HTTP_REQUEST_METHODS,
  getErrorMessageBody
} from '@utils/apiConstants';
import { replaceDynamicCmsContent } from '@utils/a11y/a11yHelpers';
import { useAlert, useA11y } from '@context/Utils';
import { useAppConfig, StatusCodes } from '@config/AppConfig';

export const TariffContext = createContext({});

export function TariffContextProvider({ children }) {
  // Context
  const navigate = useNavigate();

  const { setIsGenericError } = useAlert();
  const { tA11yTranslate } = useA11y();
  const { staticContentData } = useStaticContent();
  const {
    customerData,
    getCustomerData,
    // customerProducts,
    customerProductsOriginal,
    tariffChangeActive,
    setTariffChangeActive,
    setImmediateTariffChangeWindow
  } = useCustomer();
  const { env } = useAppConfig();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [allTariff, setAllTariff] = useState([]);
  const [activeTariff, setActiveTariff] = useState([]);
  const [bookableTariff, setBookableTariff] = useState([]);
  const [bookableTariffEtcOne, setBookableTariffEtcOne] = useState([]);
  const [activeTariffProducts, setActiveTariffProducts] = useState([]);
  const [pendingTariffProducts, setPendingTariffProducts] = useState([]);
  const [tariffOptionSuccess, setTariffOptionSuccess] = useState({ isSuccessful: false, type: '' });
  const [showTariffBanner, setShowTariffBanner] = useState(false);
  const [changeTariffName, setChangeTariffName] = useState('');
  const [vviDocuments, setVviDocuments] = useState([]);
  const [selectedTariff, setSelectedTariff] = useState({});

  const [selectedAdditionalOption, setSelectedAdditionalOption] = useState({});
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedBookableOption, setSelectedBookableOption] = useState({});
  const [selectedSpeedOn, setSelectedSpeedOn] = useState({});

  const [tariffFailModal, setTariffFailModal] = useState('');
  const [tarifPdfModal, setTariffPdfModal] = useState(false);
  const [showPdfs, setShowPdfs] = useState(false);
  const [changeTariffLoading, setChangeTariffLoading] = useState(false);
  const [changeTariffError, setChangeTariffError] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showTariffDetailsExpireModal, setShowTariffDetailsExpireModal] = useState(false);
  const [showCancelTarifftoTheEndModal, setShowCancelTarifftoTheEndModal] = useState(false);
  const [showTariffChangeCreditReminderModal, setShowTariffChangeCreditReminderModal] =
    useState(false);
  const [closedTariffChangeCreditReminderModal, setClosedTariffChangeCreditReminderModal] =
    useState(false);

  const [tariffChangeToTheEndSelected, setTariffChangeToTheEndSelected] = useState(false);
  const [cancelTariffChangeToTheEndError, setCancelTariffChangeToTheEndError] = useState(false);
  const [cancelTariffChangeToTheEndLoading, setCancelTariffChangeToTheEndLoading] = useState(false);
  const [cancelledOnContractDetailsPage, setCancelledOnContractDetailsPage] = useState(false);

  // ---------------------
  // calls from dom-mo-sdk
  // ---------------------

  // NOTE: as of 2025-10-15 during TDM-137-deeplinks-tariff-change, the function
  // 'onChangeTariffCall' is now locally implemented here, for details please see below.
  // Please do not import this function any more from the SDK.
  const { onActiveProductCall, onBookableTariffCall, onVviDocuments } = useMobileOne();

  // ------------------------------------------------------
  // calls locally implemented here without usage of an SDK
  // ------------------------------------------------------
  const onTariffCancelOrAcceptByCustomerCall = async (data) => {
    // request url and axios headers and config
    const url = `${env.REACT_APP_MO_URL}${appAPIUri.MO.TARIFF.PRODUCT_CANCEL_OR_ACCEPT_BY_CUSTOMER}`;
    const headers = { ...appAPIHeaders.DEFAULT_BASE_JSON };
    const config = {
      url,
      params: data,
      method: HTTP_REQUEST_METHODS.POST,
      headers
    };
    // make call
    try {
      const response = await axios(config);
      if (response.data?.success) {
        return {
          success: true,
          // NOTE: deliberately omitted these elements of the answer used in the SDK in order to reduce and simplify the code
          // "settings": {
          //   "container": settingsContainer.ETC,
          //   "type": settingsType.SUCCESS,
          // },
          status: StatusCodes.OK,
          data: response.data
        };
      }
      // REFACTOR: (?) this object could possibly moved to a common function
      // for error handling if status code = 200 but field success = false
      return {
        success: false,
        status: StatusCodes.METHOD_NOT_ALLOWED,
        data: [],
        error: [
          {
            messageBody: response?.data?.errorMessage
          }
        ]
      };
    } catch (error) {
      // TODO: refactor this to use Error Object
      // eslint-disable-next-line no-throw-literal
      throw {
        // Error Response for other Error
        success: false,
        // NOTE: deliberately omitted these elements of the answer used in the SDK in order to reduce and simplify the code
        // "settings": {
        //   "type": settingsType.ERROR,
        //   "errorType": settingsErrorType.ON_API_CALL,
        //   "errorFrom": settingsErrorFrom.API_CALL,
        //   "triggerType": settingsTriggerType.ON_SUBMIT,
        //   "messageType": settingsMessageType.TEXT,
        // },
        status:
          error?.data?.status ||
          error?.status ||
          error?.response?.status ||
          StatusCodes.NOT_ACCEPTABLE,
        data: [],
        error: [
          {
            // NOTE: deliberately omitted these elements of the answer used in the SDK in order to reduce and simplify the code
            // "errorType": settingsErrorType.ON_API_CALL,
            // "messageType": settingsMessageType.TEXT,

            // changed message body extraction to a separate function to avoid code duplication
            messageBody: getErrorMessageBody(error)
          }
        ]
      };
    }
  };

  // NOTE this function is implemented locally now as of 2025-10-15 during TDM-137-deeplinks-tariff-change
  // because of an additional parameter necessary to be passed to ETC One via the API call.
  // This move of the function from the SKD is here is not really necessary, as we use JavaScript in this
  // project, but to avoid incorrect type definitions in TypeScript in the SDK and possibly confusion, this
  // function is now implemented here locally.
  // Please see below in the 'onSubmit' function for the the defintion of the new parameter.
  const onChangeTariffCall = async (data) => {
    // request url and axios headers and config
    const url = `${env.REACT_APP_MO_URL}${appAPIUri.MO.TARIFF.CHANGE_TARIFF}`;
    const headers = { ...appAPIHeaders.DEFAULT_BASE_JSON };
    const config = {
      url,
      params: data,
      method: HTTP_REQUEST_METHODS.POST,
      headers
    };
    // make call
    try {
      const response = await axios(config);
      if (response.data?.success) {
        return {
          success: true,
          status: StatusCodes.OK,
          data: response.data
        };
      }
      // REFACTOR: (?) this object could possibly moved to a common function
      // for error handling if status code = 200 but field success = false
      return {
        success: false,
        status: StatusCodes.METHOD_NOT_ALLOWED,
        data: [],
        error: [
          {
            messageBody: response?.data?.errorMessage
          }
        ]
      };
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      throw {
        // Error Response for other Error
        success: false,
        status:
          error?.data?.status ||
          error?.status ||
          error?.response?.status ||
          StatusCodes.NOT_ACCEPTABLE,
        data: [],
        error: [
          {
            messageBody: getErrorMessageBody(error)
          }
        ]
      };
    }
  };

  // Validations
  const termsValidations = Yup.object().shape({
    terms: Yup.boolean().isTrue('please_select_terms_and_conditions')
  });

  // Functions

  const getTariffName = (
    tariffName,
    tariffNameSpeed,
    tariffNameCmsKey = 'nc_dboard_dts_tariff'
  ) => {
    let nameOfTariff = tA11yTranslate(tariffNameCmsKey);
    const shownName = tA11yTranslate(tariffName).content;
    nameOfTariff = replaceDynamicCmsContent(nameOfTariff, '{TARIFFNAME}', shownName);
    const shownSpeed = tA11yTranslate(tariffNameSpeed).content;
    if (shownSpeed) {
      nameOfTariff = replaceDynamicCmsContent(nameOfTariff, '{SPEEDNAME}', shownSpeed);
    } else {
      nameOfTariff = replaceDynamicCmsContent(nameOfTariff, '{SPEEDNAME}', '');
    }
    return nameOfTariff;
  };

  // eslint-disable-next-line consistent-return
  const staticTariffManipulation = (tariffApiData) => {
    if (
      staticContentData &&
      staticContentData.nc_tariff &&
      staticContentData.nc_tariff.length > 0
    ) {
      const filteredStaticContent = staticContentData.nc_tariff.filter(
        (staticContentTariffItem) => {
          const tariff = tariffApiData.find(
            (tariffItem) => tariffItem.id === staticContentTariffItem.id
          );
          if (tariff) {
            return tariff;
          }
          return false;
        }
      );
      const tariffWithShowInCsc = filteredStaticContent.map((staticTariff) => ({
        ...staticTariff,
        showInCsc: tariffApiData.find((tariffData) => tariffData?.id === staticTariff.id)?.showInCsc
      }));
      return tariffWithShowInCsc;
    }
  };

  const tariffManipulationUnsort = (tariffApiData) => {
    const staticApiData = staticContentData;
    let filterArray = [];

    if (staticApiData != null) {
      if (staticApiData.nc_tariff != null && staticApiData.nc_tariff.length > 0) {
        const staticContentTariff = staticApiData.nc_tariff;
        const apiTariffData = tariffApiData;

        filterArray = staticContentTariff.filter((staticContentTariffItem) =>
          apiTariffData.some(
            (apiTariffDataitem) => staticContentTariffItem.id === apiTariffDataitem.id
          )
        );
        return filterArray;
      }
      return filterArray;
    }
    return filterArray;
  };

  // Manipulate the single tariff data.
  const staticTariffManipulate = (tariffApiData) => {
    const staticApiData = staticContentData;

    if (staticApiData != null) {
      if (staticApiData.nc_tariff != null && staticApiData.nc_tariff.length > 0) {
        const staticContentTariff = staticApiData.nc_tariff;
        const apiTariffData = tariffApiData;
        let filterArray = [];

        filterArray = staticContentTariff.find(
          (staticContentTariffItem) => staticContentTariffItem.id === apiTariffData.id
        );

        return filterArray;
      }
      return tariffApiData;
    }
    return tariffApiData;
  };

  const getStaticContentTariff = (tariffId) => {
    // const { tariff_norma: tariffNorma = [] } = staticContentData;
    const { nc_tariff: tariffNorma = [] } = staticContentData;
    return tariffNorma.find((tariff) => tariff.id === tariffId);
  };

  // Get customer active tariff and storing it in state
  const getActiveProductCall = async () => {
    try {
      let activeTariffDetails = [];
      if (customerProductsOriginal && staticContentData && staticContentData.nc_tariff) {
        customerProductsOriginal.forEach((elem, i) => {
          let localTariff = elem;
          let { tariff: apiTariffData } = localTariff;
          let tariffDetails = getStaticContentTariff(elem?.tariff?.id);
          localTariff.tariff = tariffDetails;
          localTariff.apiTariffData = apiTariffData;
          activeTariffDetails.push(localTariff);
        });
        setActiveTariff(activeTariffDetails);
      }
      return true;
      // return customerProductsOriginal;
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  // Get customer bookable tariff and storing it in state
  const getBookableTariffCall = async () => {
    try {
      const { data } = await onBookableTariffCall();
      setBookableTariff(staticTariffManipulation(data));
      setBookableTariffEtcOne(data);
      return data;
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  // Function loads after we get customer data, and returns active and bookable tariff
  const afterLoad = async () => {
    try {
      setIsLoading(true);
      await getBookableTariffCall();
      setIsLoading(false);
      return null;
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  // Find tariff status name to display in tariff product card.
  const getTariffStatusName = (tariffId) => {
    const tariff = activeTariff.find((trf) => trf.tariff.id.toString() === tariffId.toString());
    if (tariff) {
      return tariff.status.name;
    }
    return false;
  };

  // Switch active tariff
  const onSubmit = async ({ tariffId }) => {
    try {
      setChangeTariffLoading(true);
      const selectedTariffObj = bookableTariff.find(
        ({ id }) => parseInt(id, 10) === parseInt(tariffId, 10)
      );
      let tariffchangeType = 0;
      // tariff change to the end of the contract
      if (tariffChangeToTheEndSelected) {
        tariffchangeType = 1;
      }
      const params = {
        tariffId: tariffId,
        tariffchangeType: tariffchangeType
      };
      const { data, success, status } = await onChangeTariffCall(params);
      if (data && data.success) {
        setTariffOptionSuccess({
          isSuccessful: true,
          type: tariffChangeToTheEndSelected
            ? appTariffOptionSuccessType.TARIFF_TO_THE_END
            : appTariffOptionSuccessType.TARIFF
        });
        // Set value in local storage to guarantee that 'tariffChangeActive' is set to
        // true for a specific amount of time (value is stored in CMS as a minute value)
        // while ETC One is processing its workflow.
        if (!tariffChangeToTheEndSelected) {
          setImmediateTariffChangeWindow();
          setTariffChangeActive(true);
        }
        // reload customer data but changes are mostly like not reflected,
        // as the workflow at ETC One takes some time (here it should be some minutes).
        // The tariff change itself can take up to several hours, but the delivery
        // of two tariffs instead of one in the response of /customer/dom-with-products
        // can take several minutes (it should be less than 5 minutes).
        await getCustomerData();
        setChangeTariffLoading(false);
        setChangeTariffError(false);
        return data;
      }
      setChangeTariffLoading(false);
      setChangeTariffError(true);
    } catch (error) {
      // BFSG: TODO: handle error here that active tariff could not be switched! (API call involved)
      setChangeTariffLoading(false);
      if (
        !(
          error?.status === StatusCodes.UNAUTHORIZED ||
          error?.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.FORBIDDEN
        )
      ) {
        setChangeTariffError(true);
      }
      return error;
    }
  };

  // Cancel pending tariff change to the end of the contract by customer
  const cancelTariffChangeToTheEnd = async () => {
    try {
      setTariffOptionSuccess({ isSuccessful: false, type: null });
      setCancelTariffChangeToTheEndLoading(true);
      // payload values for cancelling tariff change at the end of the term by customer
      const payload = {
        action: 'cancel',
        workflowID: 13000,
        workflowItemID: 100119
      };
      const { data, success, status } = await onTariffCancelOrAcceptByCustomerCall(payload);
      if (data && data.success) {
        setTariffOptionSuccess({
          isSuccessful: true,
          type: appTariffOptionSuccessType.CANCEL_TARIFF_TO_THE_END
        });
        // reload customer data but changes are mostly like not reflected,
        // as the workflow at ETC One takes some time (here it should be some minutes)
        await getCustomerData();
        setCancelTariffChangeToTheEndLoading(false);
        setCancelTariffChangeToTheEndError(false);
        return data;
      }
      setCancelTariffChangeToTheEndLoading(false);
      setCancelTariffChangeToTheEndError(true);
    } catch (error) {
      setCancelTariffChangeToTheEndLoading(false);
      if (
        !(
          error?.status === StatusCodes.UNAUTHORIZED ||
          error?.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.FORBIDDEN
        )
      ) {
        setCancelTariffChangeToTheEndError(true);
      }
      return error;
    }
  };

  // Call this function to get VVI documents for tariff change page.
  const getVviDocuments = async (id) => {
    try {
      // setIsLoading(true);
      const { data, success } = await onVviDocuments({ tariffId: id, mnp: true });
      if (success) {
        setVviDocuments(data);
      }
      // setIsLoading(false);
      return false;
    } catch (error) {
      // BFSG: TODO: handle error here that vvi documents could not be fetched! (API call involved)
      // setIsGenericError(true);
      return error;
    }
  };

  const getingReplacementContent = (textContent) => {
    textContent = replaceDynamicCmsContent(
      textContent,
      '{OPTIONNAME}',
      selectedAdditionalOption.name
    );
    textContent = replaceDynamicCmsContent(
      textContent,
      '{PRICE_EUR}',
      selectedAdditionalOption?.price?.formattedValue
    );
    textContent = replaceDynamicCmsContent(
      textContent,
      '{VOLUME_DATA}',
      selectedAdditionalOption?.volumeData?.volume?.formattedValue
    );
    return textContent;
  };

  const getDayFlatCMSText = (type = 'copy') => {
    const { additionalInfo } = staticContentData.nc_passCodesSettings;
    const cmsKey = additionalInfo[selectedAdditionalOption.passCode]?.[type];
    if (cmsKey) {
      if (Array.isArray(cmsKey)) {
        const contentArray = [];
        cmsKey.forEach((keys) => {
          contentArray.push(getingReplacementContent(tA11yTranslate(keys)));
        });
        return contentArray;
      }
      return getingReplacementContent(tA11yTranslate(cmsKey));
    }
    return null;
  };

  const getCMSText = (key, value, pattern) => {
    let textContent = tA11yTranslate(key);
    if (Array.isArray(value)) {
      value.map((val, index) => {
        textContent = replaceDynamicCmsContent(textContent, pattern[index], val);
      });
    } else {
      textContent = replaceDynamicCmsContent(textContent, pattern, value);
    }
    return textContent;
  };

  const parseGermanPrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr; // If it's already a number, return it
    const cleanedPrice = priceStr.replace(/[^\d,.-]/g, ''); // Remove non-numeric characters
    const priceWithDot = cleanedPrice.replace(',', '.'); // Replace comma with dot
    return parseFloat(priceWithDot); // Parse to number
  };

  const formattedSelectedTariffAmount = tA11yTranslate(selectedTariff?.price)?.content || '';
  const popupCopyTxt = tA11yTranslate('nc_tariff_change_amount_popup_txt1');
  const popupCopyWithAmount = replaceDynamicCmsContent(
    popupCopyTxt,
    '{amount}',
    formattedSelectedTariffAmount
  );

  const popupCampaignDataTariffContentsExpire = {
    id: 1,
    startDate: '',
    endDate: '',
    intialMonthDays: '',
    label: '',
    content: [
      {
        type: 'image',
        image: '',
        imageWeb: 'nc_icon_info_content1'
      },
      {
        type: 'headline',
        tag: 'h2',
        txt: 'nc_tariff_change_popup_hdl1'
      },
      {
        type: 'copy',
        tag: 'p',
        txt: 'nc_tariff_change_popup_txt1'
      },

      {
        type: 'button',
        buttonTitle: 'nc_tariff_change_popup_btn1',
        buttonBackgroundcolor: '',
        buttonBackgroundcolorDark: '',
        buttonTitleColor: '',
        buttonTitleColorDark: '',
        variantWeb: 'mint',
        redirectionLink: '',
        redirectionLinkWeb: () => {
          setShowTariffDetailsExpireModal(false);
          onSubmit({ tariffId: selectedTariff.id });
        }
      },
      {
        type: 'link',
        txt: 'nc_global_tariff_change_close_popup_lnk1',
        action: 'closePopup'
      }
    ]
  };

  const popupCampaignDataCancelTariffToTheEnd = {
    id: 1,
    startDate: '',
    endDate: '',
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
        tag: 'h2',
        txt: 'nc_global_cancel_tariff_change_popup_hdl1'
      },
      {
        type: 'copy',
        tag: 'p',
        txt: 'nc_global_cancel_tariff_change_popup_txt1'
      },

      {
        type: 'button',
        buttonTitle: 'nc_global_cancel_tariff_change_popup_btn1',
        buttonBackgroundcolor: '',
        buttonBackgroundcolorDark: '',
        buttonTitleColor: '',
        buttonTitleColorDark: '',
        variantWeb: 'mint',
        redirectionLink: '',
        redirectionLinkWeb: () => {
          setShowCancelTarifftoTheEndModal(false);
          if (cancelledOnContractDetailsPage) {
            navigate(appRoute.TARIFF_OVERVIEW);
            setCancelledOnContractDetailsPage(false);
          }
          cancelTariffChangeToTheEnd();
        }
      },
      {
        type: 'link',
        txt: 'nc_global_tariff_change_close_popup_lnk1',
        action: 'closePopup'
      }
    ]
  };

  // Insufficient credit reminder popup for tariff change ("Denk daran, dein Guthaben aufzuladen")
  const popupCampaignDataTariffChange = {
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
        txt: 'nc_tariff_change_amount_popup_hdl1'
      },
      {
        type: 'copy',
        tag: 'p',
        // txt: 'nc_tariff_change_amount_popup_txt1'
        txt: popupCopyWithAmount.content
      },
      {
        type: 'button',
        buttonTitle: 'nc_tariff_change_amount_popup_btn1',
        buttonBackgroundcolor: '',
        buttonBackgroundcolorDark: '',
        buttonTitleColor: '',
        buttonTitleColorDark: '',
        variantWeb: 'mint',
        redirectionLink: '',
        redirectionLinkWeb: () => {
          setShowTariffChangeCreditReminderModal(false);
          setClosedTariffChangeCreditReminderModal(true); // NEW
        }
      },
      {
        type: 'link',
        txt: 'nc_tariff_change_amount_popup_lnk1',
        // action: 'closePopup',
        redirectionLinkWeb: () => {
          setShowTariffChangeCreditReminderModal(false);
          // MPS: Note: changed to new MPS topup overview page
          navigate(appRoute.MPS_TOPUP_OVERVIEW);
        }
      }
    ]
  };

  // Hooks

  useEffect(() => {
    const { msisdn, ...restCustomerData } = customerData;
    if (restCustomerData && msisdn && staticContentData) {
      // afterLoad();
    }
  }, [customerData, staticContentData]);

  useEffect(() => {
    if (bookableTariff && customerProductsOriginal) {
      const originalProducts = customerProductsOriginal.map(({ tariff }) => tariff).flat(1);
      const bookableProduct = bookableTariff;
      // Get unique bookable tariffs
      const bookableTariffs = bookableProduct.filter(
        (bookable) => !originalProducts.some((active) => active.id === bookable.id)
      );

      // Get unique original tariffs
      const allTariffs = [
        ...customerProductsOriginal.map(({ tariff }) => ({
          ...tariff,
          additionalInfo: tariff.additionalInfo || {
            primaryColor: '#fff',
            secondaryColor: '#fff',
            bullets: tariff.additionalInfo?.bullets || []
          }
        })),
        ...bookableTariffs.map((tariff) => ({
          ...tariff,
          additionalInfo: tariff.additionalInfo || {
            primaryColor: '#fff',
            secondaryColor: '#fff',
            bullets: tariff.bullets || []
          }
        }))
      ];

      // Get final unique active tariffs
      const finalAllTariff = allTariffs.filter(
        (tariff, index, self) => index === self.findIndex((ta) => ta.id === tariff.id)
      );
      setAllTariff(finalAllTariff);
    }

    return () => {
      setAllTariff([]);
    };
  }, [bookableTariff, customerProductsOriginal]);

  useEffect(() => {
    if (customerProductsOriginal && customerProductsOriginal.length > 0) {
      // Splitt active and pending tariff products
      let findActiveTariffProducts = [];
      let findPendingTariffProducts = [];
      customerProductsOriginal.forEach((product) => {
        if (
          product.status.id === appTariffStatus.ACTIVE ||
          product.status.id === appTariffStatus.PAUSED
        ) {
          findActiveTariffProducts.push(product);
        } else if (product.status.id === appTariffStatus.ACTIVATION_PENDING) {
          findPendingTariffProducts.push(product);
        }
      });
      setActiveTariffProducts(findActiveTariffProducts);
      setPendingTariffProducts(findPendingTariffProducts);
    }

    return () => {
      setActiveTariffProducts([]);
      setPendingTariffProducts([]);
    };
  }, [customerProductsOriginal]);

  useEffect(() => {
    getActiveProductCall();
  }, [staticContentData, customerProductsOriginal]);

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading,
      tariffOptionSuccess,
      setTariffOptionSuccess,
      showTariffBanner,
      changeTariffName,
      setChangeTariffName,
      vviDocuments,

      allTariff,
      setAllTariff,
      activeTariff,
      bookableTariff,
      bookableTariffEtcOne,
      activeTariffProducts,
      pendingTariffProducts,
      termsValidations,
      selectedTariff,
      setSelectedTariff,
      selectedAdditionalOption,
      setSelectedAdditionalOption,
      selectedOption,
      setSelectedOption,
      selectedSpeedOn,
      setSelectedSpeedOn,
      tariffFailModal,
      setTariffFailModal,
      tarifPdfModal,
      setTariffPdfModal,
      selectedBookableOption,
      setSelectedBookableOption,
      showPdfs,
      setShowPdfs,
      changeTariffLoading,
      setChangeTariffLoading,
      changeTariffError,
      setChangeTariffError,
      showTopupModal,
      setShowTopupModal,
      showTariffDetailsExpireModal,
      setShowTariffDetailsExpireModal,
      showCancelTarifftoTheEndModal,
      setShowCancelTarifftoTheEndModal,
      tariffChangeToTheEndSelected,
      setTariffChangeToTheEndSelected,
      cancelTariffChangeToTheEndError,
      setCancelTariffChangeToTheEndError,
      cancelTariffChangeToTheEndLoading,
      setCancelTariffChangeToTheEndLoading,
      cancelledOnContractDetailsPage,
      setCancelledOnContractDetailsPage,
      showTariffChangeCreditReminderModal,
      setShowTariffChangeCreditReminderModal,
      closedTariffChangeCreditReminderModal,
      setClosedTariffChangeCreditReminderModal,

      // Functions
      getTariffName,
      getStaticContentTariff,
      getTariffStatusName,
      getVviDocuments,
      onSubmit,
      staticTariffManipulation,
      tariffManipulationUnsort,
      staticTariffManipulate,
      afterLoad,
      getDayFlatCMSText,
      getCMSText,
      parseGermanPrice,
      tariffChangeActive,

      // popupCampaignData
      popupCampaignDataTariffContentsExpire,
      popupCampaignDataCancelTariffToTheEnd,
      popupCampaignDataTariffChange
    }),
    [
      // States
      isLoading,
      setIsLoading,
      tariffOptionSuccess,
      setTariffOptionSuccess,
      showTariffBanner,
      changeTariffName,
      setChangeTariffName,
      vviDocuments,

      allTariff,
      setAllTariff,
      activeTariff,
      bookableTariff,
      bookableTariffEtcOne,
      activeTariffProducts,
      pendingTariffProducts,
      termsValidations,
      selectedTariff,
      setSelectedTariff,
      selectedAdditionalOption,
      setSelectedAdditionalOption,
      selectedOption,
      setSelectedOption,
      selectedSpeedOn,
      setSelectedSpeedOn,
      tariffFailModal,
      setTariffFailModal,
      tarifPdfModal,
      setTariffPdfModal,
      selectedBookableOption,
      setSelectedBookableOption,
      showPdfs,
      setShowPdfs,
      changeTariffLoading,
      setChangeTariffLoading,
      changeTariffError,
      setChangeTariffError,
      showTopupModal,
      setShowTopupModal,
      showTariffDetailsExpireModal,
      setShowTariffDetailsExpireModal,
      showCancelTarifftoTheEndModal,
      setShowCancelTarifftoTheEndModal,
      tariffChangeToTheEndSelected,
      setTariffChangeToTheEndSelected,
      cancelTariffChangeToTheEndError,
      setCancelTariffChangeToTheEndError,
      cancelTariffChangeToTheEndLoading,
      setCancelTariffChangeToTheEndLoading,
      cancelledOnContractDetailsPage,
      setCancelledOnContractDetailsPage,
      showTariffChangeCreditReminderModal,
      setShowTariffChangeCreditReminderModal,
      closedTariffChangeCreditReminderModal,
      setClosedTariffChangeCreditReminderModal,

      // Functions
      getTariffName,
      getStaticContentTariff,
      getTariffStatusName,
      getVviDocuments,
      onSubmit,
      tariffChangeActive,
      staticTariffManipulation,
      tariffManipulationUnsort,
      staticTariffManipulate,
      afterLoad,
      getDayFlatCMSText,
      getCMSText,
      parseGermanPrice,

      // popupCampaignData
      popupCampaignDataTariffContentsExpire,
      popupCampaignDataCancelTariffToTheEnd,
      popupCampaignDataTariffChange
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <TariffContext.Provider value={contextPayload}>{children}</TariffContext.Provider>;
}
TariffContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useTariff = () => useContext(TariffContext);

export default TariffContext;
