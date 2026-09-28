/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';

import { useAuth } from '@dom-digital-online-media/dom-auth-sdk';
import { useStaticContent } from '@context/StaticContent';
import { useA11y } from '@context/Utils/A11y';
import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
// import { useAlert } from '@context/Utils';
import {
  appCustomerStatusName,
  appPdfList,
  appRoute,
  appStorage,
  appTariffs,
  appTariffStatus,
  birthdayBonus,
  appMpsPaymentStatus,
  appMpsPaymentMethodType,
  appMpsCreditCardMapping
} from '@utils/globalConstant';
import { appAPIUri, appAPIHeaders, HTTP_REQUEST_METHODS, getErrorMessageBody } from '@utils/apiConstants';
import { getDeviceInfo } from '@utils/deviceInfo';
import { useAppConfig, StatusCodes } from '@config/AppConfig';
import { useNavigate } from 'react-router-dom';

export const CustomerContext = createContext({});

export function CustomerContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [personalData, setPersonalData] = useState({});
  const [customerProducts, setCustomerProducts] = useState([]);
  const [customerProductsOriginal, setCustomerProductsOriginal] = useState([]);
  const [customerBalance, setCustomerBalance] = useState({});
  const [customerUsage, setCustomerUsage] = useState({ usage: { counters: [] } });
  const [customerComfortTopup, setCustomerComfortTopup] = useState({});
  const [tariffChangeActive, setTariffChangeActive] = useState(false); // eslint-disable-line no-unused-vars
  // new as of 2025-10-15 during TDM-137-deeplinks-tariff-change
  const [tariffChangeToTheEndActive, setTariffChangeToTheEndActive] = useState(false);
  const [tariffChangeToTheEndAllowed, setTariffChangeToTheEndAllowed] = useState(false);
  const [mediaPdfs, setMediaPdfs] = useState([]);
  const [productInfoPdfs, setProductInfoPdfs] = useState();
  const [termsInfoPdfs, setTermsInfoPdfs] = useState();
  const [privacyInfoPdfs, setPrivacyInfoPdfs] = useState();
  const [evnPdfs, setEvnPdfs] = useState();
  const [mnpPdfs, setMnpPdfs] = useState();
  const [explainerVideos, setExplainerVideos] = useState();
  const [mediaImages, setMediaImages] = useState([]);
  const [appPopupImage, setAppPopupImage] = useState();
  const [loginBgImage, setLoginBgImage] = useState({});
  const [dashboardModalImage, setDashboardModalImage] = useState({});
  const [birthdayBonusStatus, setBirthdayBonusStatus] = useState();
  const [isBirthdayBonus, setIsBirthdayBonus] = useState(true);
  const [screenSize, setScreenSize] = useState(
    window && window.innerWidth ? window.innerWidth : 1080
  );
  const [logoutPopupImage, setLogoutPopupImage] = useState({});
  const [evnData, setEvnData] = useState({});
  const [evnPdfData, setEvnPdfData] = useState([]);
  const [testVideo, setTestVideo] = useState({});
  const [isCounterAPIError, setIsCounterAPIError] = useState(false);
  const [isCustomerAPIError, setIsCustomerAPIError] = useState(false);
  const [isForcePasswordReset, setIsForcePasswordReset] = useState(false);

  const autoTopupCardBenefitInitialValue = {
    visible: true,                            // this value only needs to be set once, always visible
    icon: 'renew',                            // this value only needs to be set once
    label: 'nc_benefit_autotopup_txt1',       // this value only needs to be set once
    rightVariant: 'dash',
    linkText: 'nc_benefit_autotopup_lnk1',    // this value only needs to be set once
    onLinkClick: null,
    onPillClick: null,
  };

  const paymentMethodCardBenefitInitialValue = {
    visible: true,                            // this value only needs to be set once, always visible
    icon: 'iconCard',                         // this value only needs to be set once
    label: 'nc_benefit_pymnt_mthd_txt1',      // this value only needs to be set once
    rightVariant: 'dash',
    linkText: 'nc_benefit_pymnt_mthd_lnk1',   // this value only needs to be set once
    onLinkClick: null,
    onPillClick: null,
  };

  const employeeBonusCardBenefitInitialValue = {
    visible: false,                           // DYNAMIC VALUE, employee bonus benefit card can be invisible
    icon: 'iconPercentage',                   // this value only needs to be set once
    label: 'nc_benefit_employee_bonus_txt1',  // this value only needs to be set once
    rightVariant: 'dash',
    linkText: '',                             // this value only needs to be set once
    onLinkClick: null,
    onPillClick: null,
  };

  const [autoTopupCardBenefitConfig, setAutoTopupCardBenefitConfig] = useState(autoTopupCardBenefitInitialValue);
  const [paymentMethodCardBenefitConfig, setPaymentMethodCardBenefitConfig] = useState(paymentMethodCardBenefitInitialValue);
  const [employeeBonusCardBenefitConfig, setEmployeeBonusCardBenefitConfig] = useState(employeeBonusCardBenefitInitialValue);
  const [hasMpsAutoTopup, setHasMpsAutoTopup] = useState(false);
  const [hasMpsPaymentMethod, setHasMpsPaymentMethod] = useState(false);
  const [isMpsAutoTopupAmountLowerThanTariffPrice, setIsMpsAutoTopupAmountLowerThanTariffPrice] = useState(false);

  const cardPaymentMethodsInitialValue = {
    method: '',                   // e.g. 'creditcard', 'paypal', used in METHOD_LOGO in CardPaymentMethods component
    creditCardOption: 'generic',  // e.g. 'visa', 'Mastercard', 'amex', 'generic' only relevant if method is credit card, used in CREDITCARD_LOGO in CardPaymentMethods component
    title: '',                    // e.g. 'Visa', 'PayPal'
    subtitle: '',                 // e.g. '**** 1234'
    date: '',                     // e.g. '12/2025'
    isError: false,
    isWarning: false,
    isActive: false,
    onClick: null,
  };

  const [cardPaymentMethodsConfig, setCardPaymentMethodsConfig] = useState(cardPaymentMethodsInitialValue);

  const tariffPriceDetailsInitialValue = {
    tariffId: null,
    tariffPrice: 0,
    isStartTariff: null,
    tariffName: '',
    speedName: '',
  };

  const [tariffPriceDetails, setTariffPriceDetails] = useState(tariffPriceDetailsInitialValue);

  // Context
  const navigate = useNavigate();
  const { tA11yTranslate } = useA11y();
  const { staticContentData, onCampaignContentCall } = useStaticContent();
  const { isUserLoggedIn } = useAuth();
  const { env } = useAppConfig();

  // ---------------------
  // calls from dom-mo-sdk
  // ---------------------
  const {
    onDOMWithProductCall,
    onUsagesCall,
    onBirthdayBonusStatusCall,
    setDomWithProductData,
    onEvnCall,
    onEvnPdfCall,
    onReducedCustomerDataCall,
    onDeleteComfortTopUpCall
  } = useMobileOne();

  // ------------------------------------------------------
  // calls locally implemented here without usage of an SDK
  // ------------------------------------------------------
  const onCustomerSaveLoginDataCall = async (data) => {
    // request url and axios headers and config
    const url = `${env.REACT_APP_MO_URL}${appAPIUri.MO.CUSTOMER.SAVE_LOGIN_DATA}`;
    const headers = { ...appAPIHeaders.DEFAULT_BASE_JSON };
    const config = {
      url,
      data,
      method: HTTP_REQUEST_METHODS.POST,
      headers,
    };
    // make call
    try {
      const response = await axios(config);
      return {
        "success": true,
        // NOTE: deliberately omitted these elements of the answer used in the SDK in order to reduce and simplify the code
        // "settings": {
        //   "container": settingsContainer.ETC,
        //   "type": settingsType.SUCCESS,
        // },
        "status": StatusCodes.OK,
        "data": response.data
      };
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      throw { // Error Response for other Error
        "success": false,
        // NOTE: deliberately omitted these elements of the answer used in the SDK in order to reduce and simplify the code
        // "settings": {
        //   "type": settingsType.ERROR,
        //   "errorType": settingsErrorType.ON_API_CALL,
        //   "errorFrom": settingsErrorFrom.API_CALL,
        //   "triggerType": settingsTriggerType.ON_SUBMIT,
        //   "messageType": settingsMessageType.TEXT,
        // },
        "status": error?.data?.status || error?.status || error?.response?.status || StatusCodes.NOT_ACCEPTABLE,
        "data": [],
        "error": [{
          // NOTE: deliberately omitted these elements of the answer used in the SDK in order to reduce and simplify the code
          // "errorType": settingsErrorType.ON_API_CALL,
          // "messageType": settingsMessageType.TEXT,

          // changed message body extraction to a separate function to avoid code duplication
          "messageBody": getErrorMessageBody(error)
        }]
      };
    }
  };

  // Validations

  // Functions

  // save user statistics for ETC One
  // NOTE: currently, this call is used separately from the dashboard calls to avoid resending on reload of dashboard.
  const customerSaveLoginData = async () => {
    try {
      const dateTimeFormatted = formatInTimeZone(new Date(), "Europe/Berlin", "dd.MM.yyyy HH:mm");
      const deviceInfo = getDeviceInfo();
      const payload = {
        "OS": "WEB",
        "loginTime": dateTimeFormatted,
        ...(deviceInfo.osVersion && { "osVersion": deviceInfo.osVersion }),
        // "appVersion" and "buildVersion" are deliberately set to empty strings, as requested by ETC One.
        // Please see ticket #2230: https://dom.openproject.eu/projects/tdm-maintenance/work_packages/2230/activity
        // ...(deviceInfo.appVersion && { "appVersion": deviceInfo.appVersion }),
        "appVersion": "",
        // ...(deviceInfo.buildVersion && { "buildVersion": deviceInfo.buildVersion }),
        "buildVersion": "",
        ...(deviceInfo.device && { "device": deviceInfo.device }),
        ...(deviceInfo.deviceBrand && { "deviceBrand": deviceInfo.deviceBrand }),
        ...(deviceInfo.deviceType && { "deviceType": deviceInfo.deviceType }),
      }
      await onCustomerSaveLoginDataCall(payload);
      return true;
    } catch (error) {
      // NOTE: no error handling intended as this should not break the dashboard loading
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

  // Get customer data and storing it in individual state
  const getCustomerData = async () => {
    try {
      setIsLoading(true);
      const {
        data: {
          personalData: { firstName, lastName },
          customerData: { status }
        }
      } = await onReducedCustomerDataCall();

      const {
        data: {
          customerData: resCustomerData = {},
          customerData: { msisdn = false },
          personalData: resPersonalData = {},
          products: resProducts = [],
          productsOriginal: resProductsOriginal = [],
          comfortTopup: resComfortTopup = {}
          // NOTE: changed on 2025-10-15 during TDM-137-deeplinks-tariff-change, please see new handling below
          // tariff_change_active = false
        }
      } = await onDOMWithProductCall();
      if (resCustomerData && msisdn) {
        setCustomerData(resCustomerData);
        setPersonalData({
          ...resPersonalData,
          firstName,
          lastName
        });

        if (status !== appCustomerStatusName.ACTIVE) {
          navigate(appRoute.INACTIVE_CUSTOMER);
        }

        // NOTE: changed on 2025-10-15 during TDM-137-deeplinks-tariff-change
        // setTariffChangeActive(tariff_change_active);
        // NOTE: the new criterion for an active tariff change is now delivered by ETC One API
        // within the field customerData.tariffChangeActive
        let tariffChangeActiveValue = !!resCustomerData?.tariffChangeActive;
        // change the value from the API only for the following conditions
        if (!tariffChangeActiveValue) {
          // check if immediate tariff change flag is set in local storage
          const flagShownTime = localStorage.getItem(appStorage.IMMEDIATE_TARIFF_CHANGE_SHOWN_TIME);
          if (flagShownTime) {
            const currentTime = new Date().getTime();
            // time window has expired
            if (currentTime > flagShownTime) {
              // remove flag from local storage
              localStorage.removeItem(appStorage.IMMEDIATE_TARIFF_CHANGE_SHOWN_TIME);
            }
            // still in time window, set tariff change active depending on number of products
            else {
              // we still have a pending tariff (as ETC One explained, we can only have one pending tariff
              // at a time and only two products max, the old and the new one).
              // eslint-disable-next-line no-lonely-if
              if (resProductsOriginal.length > 1) {
                tariffChangeActiveValue = true;
              }
              // Shorten the time window for showing the tariff change alert if there is no pending tariff.
              else {
                // remove flag from local storage
                localStorage.removeItem(appStorage.IMMEDIATE_TARIFF_CHANGE_SHOWN_TIME);
              }
            }
          }
        }
        setTariffChangeActive(tariffChangeActiveValue);

        setCustomerProducts(resProducts);
        setCustomerProductsOriginal(resProductsOriginal);

        setCustomerComfortTopup(resComfortTopup);

        if (resCustomerData?.forcePasswordReset) {
          setIsForcePasswordReset(true);
        }
        setIsCounterAPIError(false);
        setIsCustomerAPIError(false);
        setIsLoading(false);
      }
      return msisdn;
    } catch (error) {
      setIsCounterAPIError(true);
      setIsCustomerAPIError(true);
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

  // as of 2025-10-15 (TDM-137-deeplinks-tariff-change) a tariff change is considered active
  // if any of the products in productsOriginal has a status of ACTIVATION_PENDING or ACTIVATION_REQUESTED
  //
  // const checkTarifChangeCondition

  const onDOMWithProduct = async () => {
    try {
      setIsLoading(true);

      const { data, success } = await onDOMWithProductCall();
      if (data && success) {
        setPersonalData({ ...personalData, ...data?.personalData });
        setDomWithProductData(data);
      }
      setIsCounterAPIError(false);
      setIsCustomerAPIError(false);
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
        setIsCounterAPIError(true);
        setIsCustomerAPIError(true);
      }
      return error;
    }
  };

  // Get customer usage and storing it in state
  const getCustomerUsage = async () => {
    try {
      const { data } = await onUsagesCall();
      if (data) {
        setCustomerUsage(data);
        const {
          usage: { counters, usageBalances } = { usage: { counters: [] } },
          counters: { DATA, SMS, VOICE } = {}
        } = data;
        const totalBalance =
          usageBalances.find((item) => item.ledgerType === 'BALANCE')?.value || null;
        setCustomerBalance({ totalBalance });
        if (
          Object.keys(DATA).length > 0 ||
          Object.keys(SMS).length > 0 ||
          Object.keys(VOICE).length > 0
        ) {
          setIsCounterAPIError(false);
        } else {
          setIsCounterAPIError(true);
        }
      } else {
        setIsCounterAPIError(true);
      }
      return data;
    } catch (error) {
      setIsLoading(false);

      if (
        !(
          error?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.FORBIDDEN
        )
      ) {
        setIsCounterAPIError(true);
      }
      return error;
    }
  };

  const getBirthBonusStatus = async () => {
    try {
      const { data, success } = await onBirthdayBonusStatusCall();
      if (data && success) {
        setBirthdayBonusStatus(data);
        setIsBirthdayBonus(data?.available !== birthdayBonus.AVAILABLE);
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

  const getEvnPdfData = async () => {
    try {
      setIsLoading(true);
      const { data, success } = await onEvnPdfCall();
      if (success) {
        setEvnPdfData(data);
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
      return false;
    }
  };

  const getEvnData = async () => {
    try {
      setIsLoading(true);
      const { data, success } = await onEvnCall();
      if (success) {
        setEvnData(data);
        if (data && data.evnAllowed) {
          await getEvnPdfData();
        }
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
      return false;
    }
  };

  const getAutoTopupDeletePayload = () => {
    const delOptions = [];
    if (customerComfortTopup?.pendingOptionExtension) {
      delOptions.push('pendingOptionExtension');
    }
    if (customerComfortTopup?.lowCredit) {
      delOptions.push('lowCredit');
    }
    if (customerComfortTopup?.specificDayOfMonth) {
      delOptions.push('specificDayOfMonth');
    }
    return delOptions;
  };

  // To delete auto topup
  const deleteAutoTopup = async () => {
    try {
      setIsLoading(true);
      const payload = {
        comfortTopUpsArray: getAutoTopupDeletePayload()
      };

      const response = await onDeleteComfortTopUpCall(payload);

      if (response && response.success) {
        // Refresh customer data after successful deletion
        await getCustomerData();
      }

      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  // load and save data after login
  const onLoadAfterLogin = async () => {
    try {
      await customerSaveLoginData();
      await onCampaignContentCall(true); // Pass true to indicate this is post-login call
      return true;
    } catch (error) {
      return false;
    }
  };

  // when function loads will return customer data
  const onLoad = async () => {
    try {
      setIsLoading(true);
      await getCustomerData();
      return true;
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  // Function loads after we get customer data, and returns balance & usage
  const afterLoad = async () => {
    try {
      await getCustomerUsage();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getExplainerVideos = () => {
    if (staticContentData) {
      const videoIds = staticContentData.ek_explanationVideos
        ? staticContentData.ek_explanationVideos
        : [];
      const mediaVideo = staticContentData.media_video ? staticContentData.media_video : [];
      const imagePreview = staticContentData.media_image ? staticContentData.media_image : [];
      // eslint-disable-next-line prefer-const
      let finalVideos = [];

      videoIds.forEach((elem, i) => {
        const { image_ref } = elem;
        const videoPreviewId = image_ref;
        let videoPreviewImg;

        imagePreview.forEach((img, j) => {
          // eslint-disable-next-line eqeqeq
          if (videoPreviewId == img.image_ref) {
            videoPreviewImg = img;
          }
        });

        mediaVideo.forEach((vid, k) => {
          if (elem.id === vid.id) {
            finalVideos.push({ ...elem, ...vid, previewImage: videoPreviewImg });
          }
        });
      });

      setExplainerVideos(finalVideos);
    }
  };

  // To get EVN category PDF
  const getEvnPdf = () => {
    if (staticContentData) {
      const evnPdfids = staticContentData.evn ? staticContentData.evn : '';
      const allMediaPdfs = staticContentData.media_pdf ? staticContentData.media_pdf : '';
      const evnPdfsList = [];

      mediaPdfs.forEach((pdf, i) => {
        // eslint-disable-next-line eqeqeq
        if (evnPdfids.id == pdf.id) {
          evnPdfsList.push(pdf);
        }
      });

      setEvnPdfs(evnPdfsList[0]);
    }
  };

  // To get EVN category PDF
  const getMnpPdf = () => {
    if (staticContentData) {
      const mnpPdfids = staticContentData.ek_pdfMnp ? staticContentData.ek_pdfMnp : [];
      const allMediaPdfs = staticContentData.media_pdf ? staticContentData.media_pdf : [];
      const mnpPdfsList = [];

      mediaPdfs.forEach((pdf, i) => {
        // eslint-disable-next-line eqeqeq
        if (mnpPdfids.id == pdf.id) {
          mnpPdfsList.push(pdf);
        }
      });

      setMnpPdfs(mnpPdfsList[0]);
    }
  };

  // To get different category PDFs
  const getPdfs = () => {
    if (staticContentData) {
      const pdfsList = staticContentData.nr_pdfList ? staticContentData.nr_pdfList : [];
      const allMediaPdfs = staticContentData.media_pdf ? staticContentData.media_pdf : [];
      let productPdfs = [];
      let privacyPdfs = [];
      let termsPdfs = [];
      let productPdfIds = [];
      let termsPdfIds = [];
      let privacyPdfIds = [];

      pdfsList?.forEach((elem, i) => {
        if (elem.listName === appPdfList.PRODUCT_SHEET) {
          elem.listContent.forEach((id, j) => {
            productPdfIds.push(id.id);
          });
        } else if (elem.listName === appPdfList.TERMS) {
          elem.listContent.forEach((id, j) => {
            termsPdfIds.push(id.id);
          });
        } else if (elem.listName === appPdfList.PRIVACY) {
          elem.listContent.forEach((id, j) => {
            privacyPdfIds.push(id.id);
          });
        }
      });

      allMediaPdfs.forEach((pdf, i) => {
        productPdfIds.forEach((id, j) => {
          // eslint-disable-next-line eqeqeq
          if (id == pdf.id) {
            productPdfs.push(pdf);
          }
        });
        privacyPdfIds.forEach((id, j) => {
          // eslint-disable-next-line eqeqeq
          if (id == pdf.id) {
            privacyPdfs.push(pdf);
          }
        });
        termsPdfIds.forEach((id, j) => {
          // eslint-disable-next-line eqeqeq
          if (id == pdf.id) {
            termsPdfs.push(pdf);
          }
        });
      });

      setMediaPdfs(allMediaPdfs);
      setProductInfoPdfs(productPdfs);
      setTermsInfoPdfs(termsPdfs);
      setPrivacyInfoPdfs(privacyPdfs);
    }
  };

  const getMediaImgs = () => {
    if (staticContentData) {
      if (staticContentData.media_image) {
        const images = staticContentData.media_image ? staticContentData.media_image : '';
        if (images) {
          setMediaImages(images);
          const appImage = images.find((img) => img.image_ref === 'ek_web_popup_app_bg');
          const bgimg = images.find(({ image_ref }) => image_ref === 'ek_web_login_bg');
          const dashboardmodalimg = images.find(
            // ({ image_ref }) => image_ref === 'ek_web_popup_new_tariff_image'
            ({ image_ref }) => image_ref === 'ek_web_popup_new-tariff_content-1'
          );
          setLoginBgImage(bgimg);
          setAppPopupImage(appImage);
          setDashboardModalImage(dashboardmodalimg);
        }
      }
    }
  };

  const getLogoutPopupImage = () => {
    if (staticContentData) {
      const images = staticContentData.media_image ? staticContentData.media_image : [];
      const logoutImage = images.find((img) => img.image_ref === 'nc-img-modal-woman');

      setLogoutPopupImage(logoutImage);
    }
  };

  const getVideoPreview = (imageRef) => {
    let videoPreview = '';
    if (staticContentData) {
      if (staticContentData.media_image) {
        const images = staticContentData.media_image;
        const videoImg = images.find((img) => img.image_ref === imageRef);
        videoPreview = videoImg?.media_url_display;
      }
    }
    return videoPreview;
  };

  const downloadDocPDF = (link) => {
    window.location.href = link;
  };

  const getTestVideo = () => {
    if (staticContentData && staticContentData.media_video) {
      const videos = staticContentData.media_video;
      const video = videos.find(({ name }) => name === 'test_video_for_player_component');
      setTestVideo(video || {});
    }
  };

  // To set immediate tariff change time window in local storage
  const setImmediateTariffChangeWindow = () => {
    const currentTime = new Date().getTime();
    const windowInMinutes = parseInt(tA11yTranslate('nc_tarrif_change_local_storage').content, 10) || 5;
    const flagShownTime = currentTime + windowInMinutes * 60 * 1000; // converting minutes to milliseconds
    localStorage.setItem(appStorage.IMMEDIATE_TARIFF_CHANGE_SHOWN_TIME, flagShownTime);
  };

  // Hooks
  // when user logged in get customer data
  useEffect(() => {
    if (isUserLoggedIn) {
      onLoadAfterLogin();
      onLoad();
    }
  }, [isUserLoggedIn]);

  // to check the customerBalance and customerUsage
  useEffect(() => {
    const { msisdn = false, ...restCustomerData } = customerData;
    if (restCustomerData && msisdn) {
      afterLoad();
    }
  }, [customerData]);

  // check if we currently have a tariff change at the end of the term active and
  // check if a tariff change at the end of the term is allowed 
  useEffect(() => {
    // do we have a tariff change at the end of the term active?
    let tariffChangeToTheEndActiveCheck = false;
    if (customerProductsOriginal.length === 2 && !tariffChangeActive) {
      const pendingTariffStatus = customerProducts.find(
        ({ status }) =>
          // BFSG: appTariffStatus.IN_CHANGE is not documented in ETC One API documentation (PDF-file)
          // BFSG: is it safe to delete this line? Has to be checked in a tariff change process.
          status.id === appTariffStatus.IN_CHANGE ||
          status.id === appTariffStatus.ACTIVATION_PENDING ||
          status.id === appTariffStatus.ACTIVATION_REQUESTED
      );
      if (pendingTariffStatus) {
        tariffChangeToTheEndActiveCheck = true;
        setTariffChangeToTheEndActive(true);
      }
    }

    // Check if a tariff change at the end of the term is allowed (active & endDate has value)
    // while no tariff change regardless of its type is active
    if (
      customerProductsOriginal.length === 1 &&
      customerProductsOriginal[0].status.id === appTariffStatus.ACTIVE &&
      customerProductsOriginal[0].endDate &&
      !tariffChangeActive &&
      !tariffChangeToTheEndActiveCheck
    ) {
      setTariffChangeToTheEndAllowed(true);
    } else {
      setTariffChangeToTheEndAllowed(false);
    }

    // Clean up
    return () => {
      setTariffChangeToTheEndActive(false);
      setTariffChangeToTheEndAllowed(false);
    };
  }, [customerProductsOriginal]);

  // Check whether a MPS auto top-up or payment method is currently set up.
  // Set the status info for the benefit cards (active/warning/error)
  // and set the corresponding state to show/hide the benefit cards
  useEffect(() => {
    let sharedConfig = {
      visible: true,
      rightVariant: 'dash',
      onLinkClick: null,
      onPillClick: null,
    };

    // set link targets
    const autoTopUpManageLink = appRoute.ACCOUNT_MANAGE_AUTO_TOPUP;
    const autoTopupSetupLink = appRoute.MPS_TOPUP_AMOUNT;
    const paymentMethodManageLink = appRoute.ACCOUNT_PAYMENT_METHODS;
    const paymentMethodSetupLink = appRoute.ACCOUNT_ADD_PAYMENT_METHODS;

    // CardBenefit components Auto Topup and Payment Method in case of API error or
    // empty or missing data in customerComfortTopup
    if (
      isCounterAPIError ||
      isCustomerAPIError ||
      // customerComfortTopup is empty object
      (Object.keys(customerComfortTopup).length === 0 && customerComfortTopup.constructor === Object) ||
      // one of the following keys does not exist in customerComfortTopup
      !('lowCredit' in customerComfortTopup) ||
      !('pendingOptionExtension' in customerComfortTopup) ||
      !('specificDayOfMonth' in customerComfortTopup) ||
      !('payment' in customerComfortTopup) ||
      !('paymentStatusId' in customerComfortTopup)
    ) {
      setAutoTopupCardBenefitConfig({ ...autoTopupCardBenefitConfig, ...sharedConfig });
      setPaymentMethodCardBenefitConfig({ ...paymentMethodCardBenefitConfig, ...sharedConfig });

      // in every above cases we do not know the states of Auto Top and Payment Method
      setHasMpsAutoTopup(false);
      setHasMpsPaymentMethod(false);
    } else {
      // CardBenefit components Auto Topup and Payment Method in case of no API error and data in customerComfortTopup

      // check auto topup
      let autoTopupConfig = {
        visible: true,
        rightVariant: 'dash',
        onLinkClick: null,
        onPillClick: null,
      };
      if (!customerComfortTopup?.lowCredit && !customerComfortTopup?.pendingOptionExtension && !customerComfortTopup?.specificDayOfMonth) {
        // no auto topup set up
        autoTopupConfig = {
          visible: true,
          rightVariant: 'link',
          onLinkClick: () => {
            navigate(autoTopupSetupLink);
          },
          onPillClick: null,
        };
        setHasMpsAutoTopup(false);
      } else {
        // auto topup has been set up
        setHasMpsAutoTopup(true);

        if (customerComfortTopup?.paymentStatusId === appMpsPaymentStatus.INACTIVE) {
          // Payment method is invalid / inactive, as a result auto topup is also automatically invalid (red pill).
          autoTopupConfig = {
            visible: true,
            rightVariant: 'error',
            onLinkClick: null,
            onPillClick: () => {
              navigate(autoTopUpManageLink);
            },
          }
        } else if (
          'lowCredit' in customerComfortTopup &&
          'pendingOptionExtension' in customerComfortTopup &&
          // auto topup objects are not empty
          !(Object.keys(customerComfortTopup.lowCredit).length === 0 && customerComfortTopup.lowCredit.constructor === Object) &&
          !(Object.keys(customerComfortTopup.pendingOptionExtension).length === 0 && customerComfortTopup.pendingOptionExtension.constructor === Object) &&
          // each amount key does exist in auto topup objects
          'amount' in customerComfortTopup.lowCredit &&
          'amount' in customerComfortTopup.pendingOptionExtension &&
          // amount objects are not empty
          !(Object.keys(customerComfortTopup.lowCredit.amount).length === 0 && customerComfortTopup.lowCredit.amount.constructor === Object) &&
          !(Object.keys(customerComfortTopup.pendingOptionExtension.amount).length === 0 && customerComfortTopup.pendingOptionExtension.amount.constructor === Object) &&
          // each amount has plausible values
          customerComfortTopup.lowCredit.amount !== null &&
          customerComfortTopup.lowCredit.amount >= 0 &&
          customerComfortTopup.pendingOptionExtension.amount !== null &&
          customerComfortTopup.pendingOptionExtension.amount >= 0
        ) {
          // Cases with auto top being set up

          // Read tariff price from products field
          let tariffPrice = 0;
          let activeTariff = null;
          if (
            customerProducts.length === 1 &&
            (
              customerProducts[0].status.id === appTariffStatus.ACTIVE ||
              customerProducts[0].status.id === appTariffStatus.PAUSED
            )
          ) {
            [activeTariff] = customerProducts;
          } else if (customerProducts.length === 2) {
            activeTariff = customerProducts.find(
              ({ status }) => status.id === appTariffStatus.ACTIVE
            );
          }
          // The tariff amount is enabled by ETC One; it must and should be passed as, for example, 9.99 in Comfort Top-up and Activate SIM call.
          // Thus, float values are possible for tariff price and for auto topup amount.
          tariffPrice = activeTariff?.tariff?.price;
          // tariffPrice = Math.ceil(activeTariff?.tariff?.price);


          // Read amount from auto topup
          let autoTopupAmount = 0;
          if (customerComfortTopup.lowCredit.amount === customerComfortTopup.pendingOptionExtension.amount) {
            // Float values are possible for auto topup amount (please see comment for tariff price above).
            autoTopupAmount = customerComfortTopup.lowCredit.amount;
          }

          if (
            activeTariff !== null &&
            tariffPrice !== undefined &&
            autoTopupAmount !== undefined &&
            autoTopupAmount < tariffPrice
          ) {
            // In case of auto topup amount is lower than current tariff price (yellow pill)
            setIsMpsAutoTopupAmountLowerThanTariffPrice(true);
            autoTopupConfig = {
              visible: true,
              rightVariant: 'warning',
              onLinkClick: null,
              onPillClick: () => {
                navigate(autoTopUpManageLink);
              },
            }
          } else {
            // In case of auto topup amount is higher than or equal to current tariff price (green pill)
            setIsMpsAutoTopupAmountLowerThanTariffPrice(false);
            autoTopupConfig = {
              visible: true,
              rightVariant: 'active',
              onLinkClick: null,
              onPillClick: () => {
                navigate(autoTopUpManageLink);
              },
            }
          }
        }
      }
      setAutoTopupCardBenefitConfig({ ...autoTopupCardBenefitConfig, ...autoTopupConfig });

      // check payment method
      let paymentMethodConfig = {
        visible: true,
        rightVariant: 'dash',
        onLinkClick: null,
        onPillClick: null,
      };
      // intialise config for CardPaymentMethods component on topup overview page
      let customerPaymentMethodConfig = { ...cardPaymentMethodsInitialValue };
      // check if payment method has been set up at all
      if (!customerComfortTopup?.payment && !customerComfortTopup?.paymentStatusId) {
        // no payment method set up
        paymentMethodConfig = {
          visible: true,
          rightVariant: 'link',
          onLinkClick: () => {
            navigate(paymentMethodSetupLink);
          },
          onPillClick: null,
        };
        setHasMpsPaymentMethod(false);
      } else {
        // payment method has been set up
        setHasMpsPaymentMethod(true);

        if (customerComfortTopup?.paymentStatusId === appMpsPaymentStatus.ACTIVE) {
          // Payment method is active (green pill).
          paymentMethodConfig = {
            visible: true,
            rightVariant: 'active',
            onLinkClick: null,
            onPillClick: () => {
              navigate(paymentMethodManageLink);
            },
          };
          // set green pill also for CardPaymentMethods component on topup overview page
          customerPaymentMethodConfig.isActive = true;
        } else if (customerComfortTopup?.paymentStatusId === appMpsPaymentStatus.INACTIVE) {
          // Payment method is invalid / inactive (red pill).
          paymentMethodConfig = {
            visible: true,
            rightVariant: 'error',
            onLinkClick: null,
            onPillClick: () => {
              navigate(paymentMethodManageLink);
            },
          };
          // set red pill also for CardPaymentMethods component on topup overview page
          customerPaymentMethodConfig.isError = true;
        }

        // set remaining config for CardPaymentMethods component on topup overview page
        const customerMethod = appMpsPaymentMethodType.find(
          ({ apiValue }) => apiValue === customerComfortTopup?.payment
        );
        customerPaymentMethodConfig.method = customerMethod?.methodMapping || '';
        customerPaymentMethodConfig.title = customerComfortTopup?.payment || '';
        customerPaymentMethodConfig.subtitle = customerComfortTopup?.paymentDetails || '';
        if (customerMethod?.methodMapping === 'creditcard') {
          // define credit card icon and more specific title
          if ('ccBrand' in customerComfortTopup) {
            // set correct icon
            const cardType = appMpsCreditCardMapping.find(
              ({ apiValue }) => apiValue === customerComfortTopup?.ccBrand
            );
            customerPaymentMethodConfig.creditCardOption = cardType?.iconMapping || 'generic';
            // set more specific title
            // customerPaymentMethodConfig.title = customerComfortTopup?.ccBrand || '';
            customerPaymentMethodConfig.title = cardType?.nameMapping || '';
          }
          // shorten payment details for credit card to show only last 8 digits
          const shortenedPaymentDetails = customerComfortTopup?.paymentDetails
            ? customerComfortTopup.paymentDetails.length >= 8
              ? `${customerComfortTopup.paymentDetails.slice(-8, -4)} ${customerComfortTopup.paymentDetails.slice(-4)}`
              : customerComfortTopup.paymentDetails
            : '';
          customerPaymentMethodConfig.subtitle = shortenedPaymentDetails;
          // set valid until date for credit card
          if ('expiryDate' in customerComfortTopup) {
            customerPaymentMethodConfig.date = `${customerComfortTopup?.expiryDate?.slice(0, 2)}/${customerComfortTopup?.expiryDate?.slice(2)}`;
          }
        }
        customerPaymentMethodConfig.onClick = () => {
          navigate(paymentMethodManageLink);
        };
      }
      setCardPaymentMethodsConfig(customerPaymentMethodConfig);
      setPaymentMethodCardBenefitConfig({ ...paymentMethodCardBenefitConfig, ...paymentMethodConfig });
    }

    // CardBenefit component Employee Bonus in case of API error or
    // empty or missing data in personalData
    if (
      isCounterAPIError ||
      isCustomerAPIError ||
      // personalData is empty object
      (Object.keys(personalData).length === 0 && personalData.constructor === Object) ||
      // this key does not exist in personalData
      !('flags' in personalData) ||
      // personalData.flags is empty object
      (Object.keys(personalData.flags).length === 0 && personalData.flags.constructor === Object) ||
      // this key does not exist in personalData.flags
      !('employee' in personalData.flags)
    ) {
      setEmployeeBonusCardBenefitConfig({ ...employeeBonusCardBenefitConfig, ...sharedConfig });
    } else {
      // CardBenefit components Auto Topup and Payment Method in case of no API error and data in personalData

      // check employee bonus
      let employeeBonusConfig = {
        visible: false,
        rightVariant: 'dash',
        onLinkClick: null,
        onPillClick: null,
      };
      if (personalData?.flags?.employee) {
        employeeBonusConfig = {
          visible: true,
          rightVariant: 'active',
          onLinkClick: null,
          onPillClick: () => {
            navigate(appRoute.ACCOUNT_EMPLOYEE_BONUS_DETAILS);
          },
        };
      }
      setEmployeeBonusCardBenefitConfig({ ...employeeBonusCardBenefitConfig, ...employeeBonusConfig });
    }

    // Clean up
    // return () => {

    // };
  }, [customerComfortTopup, personalData, isCounterAPIError, isCustomerAPIError, customerProducts]);

  // Set tariff price details (used in topup amount for box with tariff price)
  useEffect(() => {
    // Read tariff price from products field
    let tariffPrice = 0;
    let currentTariff = null;
    if (customerProducts.length === 1) {
      [currentTariff] = customerProducts;
    } else if (customerProducts.length === 2) {
      currentTariff = customerProducts.find(
        ({ status }) => status.id === appTariffStatus.ACTIVE
      );
    }
    tariffPrice = currentTariff?.tariff?.price;
    const tariffPriceData = {
      tariffId: currentTariff?.tariff?.id,
      tariffPrice,
      isStartTariff: currentTariff?.tariff?.id === appTariffs.START_LTE || false,
      tariffName: currentTariff?.tariff?.name || '',
      speedName: currentTariff?.tariff?.nameSpeed || '',
    };
    setTariffPriceDetails(tariffPriceData);
  }, [customerProducts]);

  useEffect(() => {
    if (staticContentData) {
      getMnpPdf();
      getPdfs();
      getMediaImgs();
      getLogoutPopupImage();
    }
  }, [staticContentData]);

  useEffect(() => {
    if (window) {
      window.addEventListener('resize', () => {
        setScreenSize(window.innerWidth);
      });
    }
  }, []);

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading,
      customerData,
      personalData,
      customerProducts,
      customerProductsOriginal,
      customerBalance,
      customerUsage,
      customerComfortTopup,
      productInfoPdfs,
      termsInfoPdfs,
      privacyInfoPdfs,
      evnPdfs,
      screenSize,
      setEvnPdfs,
      explainerVideos,
      mnpPdfs,
      setMnpPdfs,
      mediaImages,
      appPopupImage,
      loginBgImage,
      dashboardModalImage,
      logoutPopupImage,
      birthdayBonusStatus,
      isBirthdayBonus,
      evnData,
      evnPdfData,
      testVideo,
      setTestVideo,
      mediaPdfs,
      setMediaPdfs,
      tariffChangeActive,
      setTariffChangeActive,
      tariffChangeToTheEndActive,
      setTariffChangeToTheEndActive,
      tariffChangeToTheEndAllowed,
      setTariffChangeToTheEndAllowed,
      isCounterAPIError,
      setIsCounterAPIError,
      isForcePasswordReset,
      setIsForcePasswordReset,

      autoTopupCardBenefitConfig,
      setAutoTopupCardBenefitConfig,
      paymentMethodCardBenefitConfig,
      setPaymentMethodCardBenefitConfig,
      employeeBonusCardBenefitConfig,
      setEmployeeBonusCardBenefitConfig,
      hasMpsAutoTopup,
      setHasMpsAutoTopup,
      hasMpsPaymentMethod,
      setHasMpsPaymentMethod,
      isMpsAutoTopupAmountLowerThanTariffPrice,
      setIsMpsAutoTopupAmountLowerThanTariffPrice,
      cardPaymentMethodsConfig,
      setCardPaymentMethodsConfig,
      tariffPriceDetails,
      setTariffPriceDetails,

      // API Calls
      customerSaveLoginData,
      getCustomerData,
      getCustomerUsage,
      onDOMWithProduct,
      getPdfs,
      getEvnPdf,
      getExplainerVideos,
      getVideoPreview,
      downloadDocPDF,
      getEvnData,
      getEvnPdfData,
      getTestVideo,

      // Functions
      setImmediateTariffChangeWindow,
      getAutoTopupDeletePayload,
      deleteAutoTopup
    }),
    [
      // States
      isLoading,
      setIsLoading,
      customerData,
      personalData,
      customerProducts,
      customerProductsOriginal,
      customerBalance,
      customerUsage,
      customerComfortTopup,
      productInfoPdfs,
      termsInfoPdfs,
      privacyInfoPdfs,
      evnPdfs,
      screenSize,
      setEvnPdfs,
      explainerVideos,
      mnpPdfs,
      setMnpPdfs,
      mediaImages,
      appPopupImage,
      loginBgImage,
      dashboardModalImage,
      logoutPopupImage,
      birthdayBonusStatus,
      isBirthdayBonus,
      evnData,
      evnPdfData,
      testVideo,
      setTestVideo,
      mediaPdfs,
      setMediaPdfs,
      tariffChangeActive,
      setTariffChangeActive,
      tariffChangeToTheEndActive,
      setTariffChangeToTheEndActive,
      tariffChangeToTheEndAllowed,
      setTariffChangeToTheEndAllowed,
      isCounterAPIError,
      setIsCounterAPIError,
      isForcePasswordReset,
      setIsForcePasswordReset,

      autoTopupCardBenefitConfig,
      setAutoTopupCardBenefitConfig,
      paymentMethodCardBenefitConfig,
      setPaymentMethodCardBenefitConfig,
      employeeBonusCardBenefitConfig,
      setEmployeeBonusCardBenefitConfig,
      hasMpsAutoTopup,
      setHasMpsAutoTopup,
      hasMpsPaymentMethod,
      setHasMpsPaymentMethod,
      isMpsAutoTopupAmountLowerThanTariffPrice,
      setIsMpsAutoTopupAmountLowerThanTariffPrice,
      cardPaymentMethodsConfig,
      setCardPaymentMethodsConfig,
      tariffPriceDetails,
      setTariffPriceDetails,

      // API Calls
      customerSaveLoginData,
      getCustomerData,
      getCustomerUsage,
      onDOMWithProduct,
      getPdfs,
      getEvnPdf,
      getExplainerVideos,
      getVideoPreview,
      downloadDocPDF,
      getEvnData,
      getEvnPdfData,
      getTestVideo,

      // Functions
      setImmediateTariffChangeWindow,
      getAutoTopupDeletePayload,
      deleteAutoTopup
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return (
    <CustomerContext.Provider value={contextPayload}>
      {children}
    </CustomerContext.Provider>
  );
}

CustomerContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useCustomer = () => useContext(CustomerContext);

export default CustomerContext;
