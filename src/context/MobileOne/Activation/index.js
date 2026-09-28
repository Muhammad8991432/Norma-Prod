// MPS: Migrate to new provider - Remove AlphaComm, add Payment context

/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { DEFAULT_FIELD_VALIDATION_TYPE, StatusCodes } from '@config/AppConfig';
import { useStaticContent } from '@context/StaticContent';
import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
import paymentService from '@services/payment';
import { replaceDynamicCmsContent, tA11y } from '@utils/a11y/a11yHelpers';
import {
  appRegex,
  appStorage,
  formValidation,
  generateUUID,
  inputValidation,
  validateDOB,
  getGenericErrorMessage,
  validCharRegex,
  validateForbiddenChar
} from '@utils/globalConstant';
// import { useAlert } from '@context/Utils/Alert';

export const ActivationContext = createContext({});

export function ActivationContextProvider({ children, config: { storage } }) {
  // States
  // API Data Storage States

  // stepper and substep stepper states
  const [currentStep, setCurrentStep] = useState(0);

  const [step0SubStep, setStep0SubStep] = useState(0);
  const [step1SubStep, setStep1SubStep] = useState(0);
  const [step2SubStep, setStep2SubStep] = useState(0);
  const [step3SubStep, setStep3SubStep] = useState(0);
  const [step4SubStep, setStep4SubStep] = useState(0);
  const [step5SubStep, setStep5SubStep] = useState(0);
  const [step6SubStep, setStep6SubStep] = useState(0);
  const [step7SubStep, setStep7SubStep] = useState(0);
  const [step8SubStep, setStep8SubStep] = useState(0);
  const [step9SubStep, setStep9SubStep] = useState(0);
  const [step10SubStep, setStep10SubStep] = useState(0);

  // states for handling feedback pages with conditions
  const [withMnp, setWithMnp] = useState(false);
  const [withVoucher, setWithVoucher] = useState(false);
  const [withVoucherNumGB, setWithVoucherNumGB] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  // const [isPaymentProductLoading, setIsPaymentProductLoading] = useState(false);
  // const [isPaymentMethodLoading, setIsPaymentMethodLoading] = useState(false);

  const [bookableTariffs, setBookableTariffs] = useState([]);
  // store original ETC One API response (/activation/validate-sim) for tariffs without CMS manipulation
  // (used in MPS update to get the price as number --> as amount for MPS payment in new Step 8)
  const [bookableTariffsEtcOne, setBookableTariffsEtcOne] = useState([]);
  const [selectedTariffId, setSelectedTariffId] = useState(0);
  const [paymentProducts, setPaymentProducts] = useState([]);
  const [allPaymentProducts, setAllPaymentProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [simProvider, setSimProvider] = useState([]);
  const [areaCode, setAreaCode] = useState([]);
  const [salutations, setSalutations] = useState([]);
  const [countries, setCountries] = useState([]);
  const [identityTypes, setIdentityTypes] = useState([]);
  const [nationality, setNationality] = useState([]);
  const [isChargingClicked, setIsChargingClicked] = useState(false);
  const [isSimInvalid, setIsSimInvalid] = useState(false);
  const [activateSimSuccessPopup, setActivateSimSuccessPopup] = useState(false);
  const [showBackButton, setShowBackButton] = useState(true);
  const [isActivationClicked, setIsActivationClicked] = useState(false);
  const [emailUniqueId, setEmailUniqueId] = useState('');
  const [emailCodeApiError, setEmailCodeApiError] = useState(false);
  const [emailCodeApiErrorMsg, setEmailCodeApiErrorMsg] = useState(null);
  const [emailApiError, setEmailApiError] = useState('');
  const [phoneNumberPUKApiError, setPhoneNumberPUKApiError] = useState('');
  const [addressApiError, setAddressApiError] = useState('');
  const [isAutoLowEnabled, setIsAutoLowEnabled] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isCodeResend, setIsCodeResend] = useState(false);
  const [isPostidentClicked, setIsPostidentClicked] = useState(false);
  // payment status to show success or failure screen
  const [paymentStatus, setPaymentStatus] = useState('');
  const [vviDocuments, setVviDocuments] = useState([]);
  // Special data for some other unique inputs
  const [otherAmount, setOtherAmount] = useState(''); // Input for Direct topup
  // To show address after product selection in payment activation
  const [showAddress, setShowAddress] = useState(false);
  // TODO: Store data in storage for verification once callback / returns.
  const [cartName, setCartName] = useState(null); // Cart ID / Name when added to card.
  // const [paymentAuthData, setPaymentAuthData] = useState({});
  const [orderNumber, setOrderNumber] = useState(null); // order ID / Name when processed with payment.
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [postIdentUrl, setPostIdentUrl] = useState(null);
  const [voucherCodeApiError, setVoucherCodeApiError] = useState('');

  // this state will be set after successful response of dom-activate-sim
  // contains (Vorgangsnummer | process number) which can be copied in step 10
  const [legitimationCode, setLegitimationCode] = useState('');
  // this state will be set after successful response of dom-activate-sim
  // contains url from response
  const [legitimationUrl, setLegitimationUrl] = useState('');

  // Context
  // const { setIsGenericError } = useAlert();
  // const { env } = useAppConfig();
  const { t, staticContentData, getStaticContentValue } = useStaticContent();
  // const navigate = useNavigate();
  const [changePasswordErrorMsg, setChangePasswordErrorMsg] = useState('');
  const [formError, setFormError] = useState(null);
  const [withMNPError, setWithMNPError] = useState(false);

  // const [showActivationHeader, setShowActivationHeader] = useState(false);
  const [showActivationHeader, setShowActivationHeader] = useState(true); // FOR TESTING PURPOSES
  const [showActivationCancelModal, setShowActivationCancelModal] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [showFeedbackError, setShowFeedbackError] = useState(false);

  // Personal Data Validation
  const [validateAddressRes, setValidateAddressRes] = useState(null);
  const [initialAddressParam, setInitialAddressParam] = useState(null);

  // Auto topup
  const [withAutoTopup, setWithAutoTopup] = useState(false);
  const [autoTopupApiError, setAautoTopupApiError] = useState(null);
  const [errorAutoTopup, setErrorAutoTopup] = useState(false);

  const [legitimationMethods, setLegitimationMethods] = useState([]);
  const [legitimationError, setLegitimationError] = useState(null);

  const [countriesError, setCountriesError] = useState(null);
  const [areaCodeError, setAreaCodeError] = useState(null);
  const [simProviderError, setSimProviderError] = useState(null);
  const [overviewError, setOverviewError] = useState(null);

  const {
    onValidateSim,
    oncountriesCall,
    onActivateSim,
    onAreaCode,
    onSimProvider,
    onTwoFactorAuthPinCall,
    onTwoFactorAuthVerificationCall,
    onVviDocuments,
    onValidateCode,
    onValidateAddress,
    onLegitimationMethodsCall
  } = useMobileOne();

  // 🔴 [STATE RECOVERY] Restore legitimationMethods from sessionStorage on mount
  // This handles state loss when PayPal redirect clears React Context
  useEffect(() => {
    // Restore legitimationMethods
    const storedMethods = sessionStorage.getItem('mps_legitimation_methods');
    if (storedMethods && (!legitimationMethods || legitimationMethods.length === 0)) {
      try {
        const parsedMethods = JSON.parse(storedMethods);
        // console.log('🔴 [useEffect - STATE RECOVERY] Restoring legitimationMethods from sessionStorage:', parsedMethods);
        setLegitimationMethods(parsedMethods);
        // console.log('🔴 [useEffect - STATE RECOVERY] ✅ Successfully restored array, length:', parsedMethods?.length);
      } catch (err) {
        // console.error(
        //   '🔴 [useEffect - STATE RECOVERY] Failed to parse legitimationMethods from sessionStorage:',
        //   err
        // );
      }
    }
    // Restore bookableTariffs
    const storedTariffs = sessionStorage.getItem('mps_bookable_tariffs');
    if (storedTariffs && (!bookableTariffs || bookableTariffs.length === 0)) {
      try {
        const parsedTariffs = JSON.parse(storedTariffs);
        // console.log(
        //   '🔴 [useEffect - STATE RECOVERY] Restoring bookableTariffs from sessionStorage'
        // );
        setBookableTariffs(parsedTariffs);
        // console.log(
        //   '🔴 [useEffect - STATE RECOVERY] ✅ Successfully restored bookableTariffs, length:',
        //   parsedTariffs?.length
        // );
      } catch (err) {
        // console.error(
        //   '🔴 [useEffect - STATE RECOVERY] Failed to parse bookableTariffs from sessionStorage:',
        //   err
        // );
      }
    }

    // Restore bookableTariffsEtcOne
    const storedTariffsEtcOne = sessionStorage.getItem('mps_bookable_tariffs_etc_one');
    if (storedTariffsEtcOne && (!bookableTariffsEtcOne || bookableTariffsEtcOne.length === 0)) {
      try {
        const parsedTariffsEtcOne = JSON.parse(storedTariffsEtcOne);
        // console.log(
        //   '🔴 [useEffect - STATE RECOVERY] Restoring bookableTariffsEtcOne from sessionStorage'
        // );
        setBookableTariffsEtcOne(parsedTariffsEtcOne);
        // console.log(
        //   '🔴 [useEffect - STATE RECOVERY] ✅ Successfully restored bookableTariffsEtcOne, length:',
        //   parsedTariffsEtcOne?.length
        // );
      } catch (err) {
        // console.error(
        //   '🔴 [useEffect - STATE RECOVERY] Failed to parse bookableTariffsEtcOne from sessionStorage:',
        //   err
        // );
      }
    }
  }, []); // Run once on mount

  // Generic error message
  const genericErrorMessage = getGenericErrorMessage(tA11y);

  // Step 1 - Phone Number Initial Values & Validations
  const phoneNumberInitialValue = {
    msisdn: '',
    iccid: '',
    puk: '',
    mnp: null,
    email: '',
    emailCode: '',
    currentProvider: '',
    type: '1',
    oldNumber: '',
    oldNumberPrefix: ''
  };

  const verifyEmailInitValues = {
    email: ''
    // code
  };

  // Step 1 validation
  const phoneNumberValidations = Yup.object().shape({
    msisdn: formValidation({
      required: tA11y('nc_global_phone_numbr_err').content,
      regex: /^\d{5,20}$/,
      validErrorMessage: tA11y('nc_global_phone_numbr_err').content
    }),
    puk: formValidation({
      required: tA11y('nc_global_puk_err').content,
      regex: /^\d{4,8}$/,
      validErrorMessage: tA11y('nc_global_puk_err').content
    })
  });

  // Step 3 validation
  const phoneNumberValidationsWithMNP = Yup.object().shape({
    currentProvider: Yup.string().required(tA11y('nc_global_prvdr_err').content),
    oldNumberComplete: Yup.string()
      .required(tA11y('nc_global_mnp_nmbr_err').content)
      .matches(/^\d{5,16}$/, tA11y('nc_global_mnp_nmbr_err').content),
    portingOrder: Yup.bool().oneOf([true], tA11y('nc_reg_with_mnp_chckbox_err').content)
  });

  const validationSchemaEmail = Yup.object().shape({
    email: Yup.string()
      .required(tA11y('nc_global_email_err').content)
      .email(tA11y('nc_global_email_err').content)
      .concat(
        validateForbiddenChar(Yup, validCharRegex.EMAIL, tA11y('nc_global_email_err').content)
      )
  });

  const staticTariffManipulation = (tariffApiData) => {
    const staticApiData = staticContentData;

    if (staticApiData != null) {
      if (staticApiData && staticApiData.nc_tariff != null && staticApiData.nc_tariff.length > 0) {
        let staticContentTariff = staticApiData.nc_tariff.sort((a, b) => a.sortOrder - b.sortOrder);
        let apiTariffData = tariffApiData;
        let filterArray = [];

        filterArray = staticContentTariff.filter((staticContentTariffItem) =>
          apiTariffData.some(
            (apiTariffDataitem) =>
              staticContentTariffItem.id === apiTariffDataitem.id &&
              staticContentTariffItem.showInActivationList
          )
        );

        // eslint-disable-next-line prefer-arrow-callback
        filterArray.sort(function (x, y) {
          return x.sortOrder - y.sortOrder;
        });

        // Find the index of the recommended item
        let recommendedIndex = filterArray.findIndex((item) => item.recommended);

        // If recommended item is found and it's not already at index 0
        if (recommendedIndex !== -1 && recommendedIndex !== 0) {
          // Remove the recommended item from its current index
          let recommendedItem = filterArray.splice(recommendedIndex, 1)[0];
          // Place the recommended item at index 0
          filterArray.unshift(recommendedItem);
        }

        return filterArray;
      }
      return tariffApiData;
    }
    return tariffApiData;
  };

  const validationSchemaCode = Yup.object().shape({
    // changed validation for emailCode to string although wrong and contradictory to API specification
    // which requires a number, project management wanted to make frontend error message disappear for
    // "numbers" with a leading zero --> validation responsibility is shifted to ETC One backend
    emailCode: Yup.string()
      .typeError(tA11y('nc_global_2fa_code_err').content)
      .required(tA11y('nc_global_2fa_code_err').content)
      .test('code', tA11y('nc_global_2fa_code_err').content, (hp) => /^\d{4}$/.test(hp))
  });

  const voucherCodeValidation = Yup.object().shape({
    voucherCode: formValidation({
      required: tA11y('nc_global_voucher_code_err').content
      // Regex check is not necessary because ETC One accepts every string value
    })
  });

  const [phoneNumberActivationForm, setPhoneNumberActivationForm] =
    useState(phoneNumberInitialValue);
  // Step 2 - Tariff Activation Initial Values & Validations
  const tariffActivationInitialValue = {
    chosenTariffId: 0,
    chosenTariffName: '', // as string (CMS key from nc_tariff JSON)
    chosenTariffSpeed: '', // as string (CMS key from nc_tariff JSON)
    tariffColor: '', // as string (hex value, e.g. #12837F, taken from nc_tariff JSON)
    tariffPrice: '', // as string (CMS key from nc_tariff JSON)
    tariffAmount: 0, // as number (taken from original tariff data and stored in activation step 2)
    tariffAmountAsStr: '' // as string (converted from original tariff data and stored in activation step 2)
  };
  const tariffActivationValidation = Yup.object().shape({
    chosenTariffId: formValidation({
      type: DEFAULT_FIELD_VALIDATION_TYPE.NUMBER,
      required: 'required_field'
    })
  });
  const [tariffActivationForm, setTariffActivationForm] = useState(tariffActivationInitialValue);

  // Step 7 - Personal Data Initial Values & Validations
  const personalDataInitialValue = {
    firstName: '',
    lastName: '',
    birthDate: '',
    houseNumber: '',
    street: '',
    zip: '',
    city: '',
    countryCode: 1, // "Deutschland" is selected by default
    emailAddress: '',
    legitimationMethod: 0,
    legitimationName: '',
    title: '7',
    invitationCode: ''
  };

  const personalDataValidations = Yup.object().shape({
    firstName: formValidation({
      required: `${tA11y('nc_global_name_err').content}`,
      regex: /^[a-zA-Z(Ö)(Ä)(Ü)(ü)(ö)(ä)(ß)\s\x2D]{0,25}$/,
      validErrorMessage: tA11y('nc_global_name_err').content
    }),
    lastName: formValidation({
      required: tA11y('nc_global_surname_err').content,
      regex: /^[a-zA-Z(Ö)(Ä)(Ü)(ü)(ö)(ä)(ß)\s\x2D]{0,40}$/,
      validErrorMessage: tA11y('nc_global_surname_err').content
    }),
    // BFSG: check validation of birthdate (differs from EDEKA)
    birthDate: Yup.date()
      .required(tA11y('nc_global_brthdy_err').content)
      .max(validateDOB(), tA11y('nc_global_brthdy_err').content),

    street: formValidation({
      required: tA11y('nc_global_street_err').content,
      regex: /^.{0,100}$/,
      validErrorMessage: tA11y('nc_global_street_err').content
    }),
    houseNumber: formValidation({
      required: tA11y('nc_global_house_number_err').content,
      regex: /^.{0,25}$/,
      validErrorMessage: tA11y('nc_global_house_number_err').content
    }),
    zip: formValidation({
      required: tA11y('nc_global_zip_err').content,
      regex: /^[0-9]{0,25}$/,
      validErrorMessage: tA11y('nc_global_zip_err').content
    }),
    city: formValidation({
      required: tA11y('nc_global_place_err').content,
      regex: /^.{0,75}$/,
      validErrorMessage: tA11y('nc_global_place_err').content
    }),
    countryCode: formValidation({
      required: tA11y('nc_global_country_err').content
    })
  });

  const [personalDataForm, setPersonalDataForm] = useState(personalDataInitialValue);

  // Step 5
  // Login Password Initial Values & Validations
  const loginPasswordInitialValue = {
    cscPassword: '',
    confirmCscPassword: ''
  };

  const [loginPasswordForm, setLoginPasswordForm] = useState(loginPasswordInitialValue);

  // Regex for password validation
  const globalPasswordRegex = tA11y('nc_global_pw_regex').content;
  const stringLengthRegex = tA11y('nc_global_pw_string-length_regex').content;
  const upperOrLowerCaseRegex = tA11y('nc_global_pw_upper-or-lower-case_regex').content;
  const numbersRegex = tA11y('nc_global_pw_numbers_regex').content;
  const specialCharsRegex = tA11y('nc_global_pw_special-chars_regex').content;

  // Global password regex error message
  const errorMessageInvalidChar = tA11y('nc_global_pw_invalid-char_err').content;

  // Password match error message
  const errorMessagePasswordMatch = tA11y('nc_global_pw_match_err').content;

  const validatePwd = (password) => {
    const pattern =
      globalPasswordRegex !== 'nc_global_pw_regex'
        ? new RegExp(`${globalPasswordRegex}`)
        : appRegex.validatePwd;
    return pattern.test(password);
  };

  const validatePwdStringLength = (password) => {
    const pattern =
      stringLengthRegex !== 'nc_global_pw_string-length_regex'
        ? new RegExp(`${stringLengthRegex}`)
        : appRegex.validatePwdStringLength;
    return pattern.test(password);
  };

  const validatePwdUpperOrLowerCase = (password) => {
    const pattern =
      upperOrLowerCaseRegex !== 'nc_global_pw_upper-or-lower-case_regex'
        ? new RegExp(`${upperOrLowerCaseRegex}`)
        : appRegex.validatePwdUpperOrLowerCase;
    return pattern.test(password);
  };

  const validatePwdNumbers = (password) => {
    const pattern =
      numbersRegex !== 'nc_global_pw_numbers_regex'
        ? new RegExp(`${numbersRegex}`)
        : appRegex.validatePwdNumbers;
    return pattern.test(password);
  };

  const validatePwdSpecialChar = (password) => {
    const pattern =
      specialCharsRegex !== 'nc_global_pw_special-chars_regex'
        ? new RegExp(`${specialCharsRegex}`)
        : appRegex.validatePwdSpecialChar;
    return pattern.test(password);
  };

  const validatePasswordWithKeys = (values, firstPasswordKey, confirmPasswordKey) => {
    // string, controlName, password
    const errors = Object.keys(values).map((controlName) => {
      const string = values[controlName];
      if (!string) {
        return {
          [controlName]: 'Pflichtfeld'
        };
      }

      const hasVerified = !validatePwd(values[firstPasswordKey]);
      const hasLength = !validatePwdStringLength(values[firstPasswordKey]);
      const hasUpperCase = !validatePwdUpperOrLowerCase(values[firstPasswordKey]);
      const hasLowerCase = !validatePwdUpperOrLowerCase(values[firstPasswordKey]);
      const hasNumber = !validatePwdNumbers(values[firstPasswordKey]);
      const hasSpecial = !validatePwdSpecialChar(values[firstPasswordKey]);

      let errorMsg = {};

      if (
        // hasVerified ||
        hasLength ||
        hasUpperCase ||
        hasLowerCase ||
        hasNumber ||
        hasSpecial ||
        values[firstPasswordKey] !== values[confirmPasswordKey]
      ) {
        errorMsg = {
          [confirmPasswordKey]: errorMessageInvalidChar,
          otherErrors: {
            // [inputValidation.INVALID]: hasVerified,
            [inputValidation.MIN_MAX_ERROR]: hasLength,
            [inputValidation.UPPER_CASE_ERROR]: hasUpperCase,
            [inputValidation.LOWER_CASE_ERROR]: hasLowerCase,
            [inputValidation.NUMBER_ERROR]: hasNumber,
            [inputValidation.SPECIAL_CASE_ERROR]: hasSpecial,
            [inputValidation.MATCH]: values[firstPasswordKey] !== values[confirmPasswordKey]
          }
        };
      }

      if (
        values[firstPasswordKey] &&
        values[confirmPasswordKey] &&
        values[firstPasswordKey] !== values[confirmPasswordKey]
      ) {
        errorMsg = { ...errorMsg, [confirmPasswordKey]: errorMessagePasswordMatch }; // BFSG: check
      }

      return errorMsg;
    });
    return Object.assign(...errors);
  };

  // Step [] - Overview Initial Values & Validations
  const overviewInitialValue = {
    voucher: '',
    termsAndConditions: false,
    thirdParty: false,
    acceptedCreditCheck: false,
    brandPartnerCustomMarketing: false,
    employee: false,
    marketingMultibrand: false
  };
  const overviewValidation = Yup.object().shape({
    termsAndConditions: Yup.boolean().isTrue(t('ek_ap_overview_text1_error-msg')),
    thirdParty: Yup.boolean(t('ek_ap_overview_text2_error-msg'))
  });
  const [overviewForm, setOverviewForm] = useState(overviewInitialValue);

  const [emailModal, setEmailModal] = useState(false);

  // Main steps stepper Functions
  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  // Substep stepper Functions
  const nextSubStep0 = () => setStep0SubStep(step0SubStep + 1);
  const prevSubStep0 = () => {
    if (step0SubStep === 3) {
      setStep0SubStep(step0SubStep - 2);
    } else {
      setStep0SubStep(step0SubStep - 1);
    }
  };

  const nextSubStep1 = () => setStep1SubStep(step0SubStep + 1);
  const prevSubStep1 = () => setStep1SubStep(step0SubStep - 1);

  // const nextSubStep2 = () => setStep2SubStep(step2SubStep + 1);
  const prevSubStep2 = () => setStep2SubStep(step2SubStep - 1);

  const nextSubStep3 = () => setStep3SubStep(step3SubStep + 1);
  const prevSubStep3 = () => setStep3SubStep(step3SubStep - 1);

  const nextSubStep4 = () => setStep4SubStep(step4SubStep + 1);
  const prevSubStep4 = () => setStep4SubStep(step4SubStep - 1);

  const nextSubStep5 = () => setStep5SubStep(step5SubStep + 1);
  const prevSubStep5 = () => setStep5SubStep(step5SubStep - 1);

  const nextSubStep6 = () => setStep6SubStep(step6SubStep + 1);
  const prevSubStep6 = () => setStep6SubStep(step6SubStep - 1);

  const nextSubStep7 = () => setStep7SubStep(step7SubStep + 1);
  const prevSubStep7 = () => setStep7SubStep(step7SubStep - 1);

  const nextSubStep8 = () => setStep8SubStep(step8SubStep + 1);
  const prevSubStep8 = () => setStep8SubStep(step8SubStep - 1);

  const nextSubStep9 = () => setStep9SubStep(step9SubStep + 1);
  const prevSubStep9 = () => setStep9SubStep(step9SubStep - 1);

  const nextSubStep10 = () => setStep10SubStep(step10SubStep + 1);
  const prevSubStep10 = () => setStep10SubStep(step10SubStep - 1);

  // Step 1 On Phone Number Form Submit
  const phoneNumberSubmit = async (values) => {
    setIsLoading(true);
    try {
      const params = { msisdn: values.msisdn, puk: values.puk };
      const { msisdn, puk } = values;

      const {
        status,
        data: { bookableTariffs: userBookableTariffs = [] }
      } = await onValidateSim(params);

      if (status === 200) {
        setIsLoading(false);
        setPhoneNumberActivationForm({ ...phoneNumberActivationForm, msisdn, puk });
        setBookableTariffs(staticTariffManipulation(userBookableTariffs));
        // store original ETC One API response (/activation/validate-sim) for tariffs without CMS manipulation
        setBookableTariffsEtcOne(userBookableTariffs);
      } else {
        setIsLoading(false);
        throw new Error('Invalid msisdn or puk');
      }
      setPhoneNumberPUKApiError('');
      nextStep();
      return true;
    } catch (error) {
      setIsLoading(false);
      if (
        // validate-sim delivers 403 error and we want to show it, so no check on StatusCodes.FORBIDDEN
        !(
          error?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.UNAUTHORIZED
        )
      ) {
        setPhoneNumberPUKApiError(error?.error?.[0]?.messageBody);
      }
      return false;
    }
  };

  const verifyEmail = async (values) => {
    try {
      setIsLoading(true);
      const uniqueIdEmail = generateUUID();
      setEmailUniqueId(uniqueIdEmail);
      const { data, success } = await onTwoFactorAuthPinCall({
        email: values.email,
        uniqueId: uniqueIdEmail
      });
      if (data && success) {
        setPhoneNumberActivationForm({ ...phoneNumberActivationForm, email: values.email });
        setIsEmailLoading(true);
        nextSubStep0(); // NEW
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setEmailApiError(error?.error?.[0]?.messageBody);
      return false;
    }
  };

  const verifyEmailCode = async (values) => {
    try {
      setIsLoading(true);
      const { data, success } = await onTwoFactorAuthVerificationCall({
        pin: Number(values.emailCode),
        uniqueId: emailUniqueId
      });
      if (data && success) {
        setPhoneNumberActivationForm({ ...phoneNumberActivationForm, emailCode: values.emailCode });
        setPersonalDataForm({ ...personalDataForm, emailAddress: phoneNumberActivationForm.email });
        setStep0SubStep(5); // to feedback success page
      }
      setIsLoading(false);
      setEmailCodeApiErrorMsg(null);
      return true;
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
        setEmailCodeApiError(true);
        setEmailCodeApiErrorMsg(error?.error?.[0]?.messageBody);
      }
      return false;
    }
  };

  // Resend otp code
  const onResendCode = async () => {
    try {
      setIsLoading(true);
      const resendUniqueId = generateUUID();
      setEmailUniqueId(resendUniqueId);
      const { data, success } = await onTwoFactorAuthPinCall({
        email: phoneNumberActivationForm.email,
        uniqueId: resendUniqueId
      });
      if (data && success) {
        setIsLoading(false);
        setIsCodeResend(true);
      }
      setIsLoading(false);
      return true;
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
        // console.log('Error UNAUTHORIZED or FORBIDDEN:', error);
      }
      return false;
    }
  };

  const phoneNumberActivationFormSubmit = (values) => {
    // Validate sim & get tariff & got to next step;
    try {
      const { mnp, currentProvider, oldNumber, oldNumberPrefix } = values;
      setIsLoading(true);
      if (mnp) {
        setPhoneNumberActivationForm({
          ...phoneNumberActivationForm,
          mnp,
          currentProvider,
          oldNumber,
          oldNumberPrefix
        });
      }
      nextStep();
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const getCountries = async () => {
    try {
      const { data = [] } = await oncountriesCall();
      if (data && data.length > 0) {
        setCountriesError(null);
        const sortedCountries = data.sort((a, b) => {
          // 'Deutschland' should show first in the list
          if (a.id === 1 && a.value === 'Deutschland') return -1;
          if (b.id === 1 && b.value === 'Deutschland') return 1;
          // sort alphabetically by country name
          return a.value.localeCompare(b.value);
        });
        setCountries(sortedCountries);

        const findFirst = sortedCountries.find((a) => a.id);
        if (findFirst && findFirst.id) {
          setPersonalDataForm({ ...personalDataForm, countryCode: findFirst.id });
        }
      }
      return data;
    } catch (error) {
      setCountriesError(error?.error?.[0]?.messageBody);
      return false;
    }
  };

  const getAreaCode = async () => {
    try {
      const { data = [] } = await onAreaCode();
      if (data && data.length > 0) {
        setAreaCodeError(null);
        setAreaCode(data);
        const findFirst = data.find((a) => a.id);
        if (findFirst && findFirst.id) {
          setPersonalDataForm({ ...personalDataForm, oldNumberPrefix: findFirst.id });
        }
      }
      return data;
    } catch (error) {
      setAreaCodeError(error?.error?.[0]?.messageBody);
      return false;
    }
  };
  const getSimProvider = async () => {
    try {
      const { data = {} } = await onSimProvider();
      if (data && data.length > 0) {
        setSimProviderError(null);
        setSimProvider(data);
        const findFirst = data.find((a) => a.id);
        if (findFirst && findFirst.id) {
          setPersonalDataForm({ ...personalDataForm, currentProvider: findFirst.id });
          return data;
        }
        return data;
      }
      return data;
    } catch (error) {
      setSimProviderError(error?.error?.[0]?.messageBody);
      return false;
    }
  };
  const getLookup = async () => {
    setIsLoading(true);
    getCountries();
    getAreaCode();
    getSimProvider();
    setIsLoading(false);
  };

  // Step 2 On Tariff Form Submit
  const tariffActivationFormSubmit = (values) => {
    setIsLoading(true);
    setTariffActivationForm(values);
    setIsLoading(false);
    nextStep();
    setStep3SubStep(0);
  };

  // Step 3 on MNP form submit

  // Step 4 on voucher code form submit
  const verifyVoucherCode = async (values) => {
    // Check voucher code
    try {
      setIsLoading(true);
      const { data, status } = await onValidateCode({
        codeForValidation: values.voucherCode
      });
      if (status === 200 && data.valid) {
        setIsLoading(false);
        setVoucherCodeApiError('');
        setPersonalDataForm({ ...personalDataForm, invitationCode: values.voucherCode });
        setWithVoucherNumGB(data.bonusGb);
        setShowActivationHeader(false);
        setStep4SubStep(1);
        return data;
      }
      setIsLoading(false);
      throw new Error('invalid voucher code');
    } catch (error) {
      // error handling in API-Proxy for this call
      setIsLoading(false);
      if (
        !(
          error?.status === StatusCodes.UNAUTHORIZED ||
          error?.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.FORBIDDEN
        )
      ) {
        setVoucherCodeApiError(error?.error?.[0]?.messageBody);
      }
      return false;
    }
  };

  const personalDataCallback = (values) => {
    const updatedValues = { ...values };
    setPersonalDataForm(updatedValues);
    setValidateAddressRes(null);
    setFormError(false);
    setIsLoading(false);
    if (currentStep === 9) {
      // MPS: changed from step 8 to step 9
      setStep9SubStep(0); // MPS: changed from step 8 to step 9
    } else {
      nextStep();
    }
  };

  // Step 7 (former step 3) On Personal Data Form Submit
  const personalDataFormSubmit = async (values) => {
    setAddressApiError('');
    setValidateAddressRes(false);
    setPersonalDataForm({ ...personalDataForm, ...values });
    try {
      if (currentStep === 9) {
        // MPS: changed from step 8 to step 9
        if (step9SubStep === 5) {
          // MPS: changed from step 8 to step 9
          setStep9SubStep(0); // MPS: changed from step 8 to step 9
          return;
        }
      }
      if (step7SubStep === 0) {
        nextSubStep7(); // go to step 7 substep
      } else if (step7SubStep === 1 || step9SubStep === 6) {
        // MPS: changed from step 8 to step 9
        setIsLoading(true);
        const params = {
          houseNumber: values.houseNumber,
          street: values.street,
          city: values.city,
          zip: values.zip,
          countryCode: values.countryCode
        };
        if (initialAddressParam) {
          const differences = Object.keys(initialAddressParam).some((key) => {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              return params[key] !== initialAddressParam[key];
            }
            return false;
          });
          if (!differences) {
            personalDataCallback({ ...values, ...validateAddressRes });
            return;
          }
        }
        const {
          status,
          data: { data }
        } = await onValidateAddress(params);

        if (status === 200) {
          const differences = Object.keys(data).some((key) => {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              return params[key] !== data[key];
            }
            return false;
          });

          if (differences) {
            setValidateAddressRes(data);
            setInitialAddressParam(params);
            // setFormError(false);
            setAddressApiError(true);
            setIsLoading(false);
          } else {
            personalDataCallback(values);
          }
        } else {
          setIsLoading(false);
          throw new Error('Invalid address data');
        }
        return true;
      }
      setIsLoading(false);
      return values;
    } catch (error) {
      setIsLoading(false);
      setAddressApiError(error?.error?.[0]?.messageBody || genericErrorMessage); // BFSG: check which error message to show
      setValidateAddressRes(null);
      setInitialAddressParam(null);
      return false;
    }
  };

  // Step 5 (former step 2) On Login Password Form Submit
  const loginPasswordFormSubmit = (values) => {
    if (!validatePwd(values.cscPassword)) {
      // setChangePasswordErrorMsg(t('nc_password_error_invalid-char'));
      setChangePasswordErrorMsg(errorMessageInvalidChar);
      setIsLoading(false);
      return false;
    }
    setIsLoading(true);
    setPersonalDataForm({
      ...personalDataForm,
      // msisdn: phoneNumberActivationForm.msisdn,
      cscPassword: values.cscPassword
    });
    setLoginPasswordForm(values);
    setOverviewForm({
      ...overviewForm,
      msisdn: phoneNumberActivationForm.msisdn,
      cscPassword: values.cscPassword
      // chosenTariffId: tariffActivationForm.chosenTariffId
    });
    setIsLoading(false);
    nextSubStep5(); // NEW
    return true;
  };

  const getVVIDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await onVviDocuments({
        tariffId: tariffActivationForm.chosenTariffId,
        mnp: phoneNumberActivationForm.mnp
      });
      if (status === 200) {
        setVviDocuments(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onConfirmingLegitimationMethod = (id, name) => {
    setPersonalDataForm({
      ...personalDataForm,
      legitimationMethod: id,
      legitimationName: name
    });
    setStep6SubStep(1);
  };

  const onUpdateLegitimationMethod = (id, name) => {
    setPersonalDataForm({
      ...personalDataForm,
      legitimationMethod: id,
      legitimationName: name
    });
    setStep9SubStep(0); // MPS: changed from step 8 to step 9
  };

  const getLegitimationMethods = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await onLegitimationMethodsCall();
      if (status === 200) {
        setLegitimationError(null);
        const legitimationMethodsInCms = staticContentData.nc_legitimationMethods;
        const updateData = data
          .filter((method) => legitimationMethodsInCms?.find((d) => d.legitimationId === method.id))
          .map((method) => ({
            ...legitimationMethodsInCms?.find((d) => d.legitimationId === method.id)
          }))
          .map((method) => {
            if (method.buttonProps) {
              method.buttonProps = method.buttonProps.map((button) => {
                if (button.onPress === 'chooseLegitimation') {
                  button.onPress = () =>
                    onConfirmingLegitimationMethod(method.legitimationId, method.name);
                }
                return button;
              });
            }
            return method;
          })
          .sort((method) => (method.isRecomended ? -1 : 1));
        setLegitimationMethods(updateData);
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
        setLegitimationError(error?.error?.[0]?.messageBody);
      }
      return false;
    }
  };

  const updateLegitimationMethods = () => {
    let tempMethods = legitimationMethods;
    tempMethods = tempMethods.map((method) => {
      if (method.buttonProps) {
        method.buttonProps = method.buttonProps.map((button) => {
          button.onPress = () => onUpdateLegitimationMethod(method.legitimationId, method.name);
          return button;
        });
      }
      return method;
    });
    setLegitimationMethods(tempMethods);
  };

  // new activate-sim call in MPS-Proxy, used in new step 9 (former step 8 in BFSG)
  const mpsOverviewFormSubmit = async (values) => {
    // console.log('🟣 [Step 9 - mpsOverviewFormSubmit] Function called');
    // console.log('🟣 [Step 9] legitimationMethods FROM CONTEXT:', legitimationMethods);
    // console.log('🟣 [Step 9] Array length:', legitimationMethods?.length);

    // 🔴 [STATE RECOVERY] Fallback: If Context array is empty but sessionStorage has data, restore it
    let methodsToUse = legitimationMethods;
    if (!legitimationMethods || legitimationMethods.length === 0) {
      const sessionStoredMethods = sessionStorage.getItem('mps_legitimation_methods');
      if (sessionStoredMethods) {
        try {
          methodsToUse = JSON.parse(sessionStoredMethods);
          // console.log(
          //   '🟣 [Step 9 - FALLBACK] Context array is empty, restoring from sessionStorage:',
          //   methodsToUse
          // );
          // console.log('🟣 [Step 9 - FALLBACK] Restored array length:', methodsToUse?.length);
        } catch (err) {
          // console.error('🟣 [Step 9 - FALLBACK] Failed to parse sessionStorage:', err);
        }
      } else {
        // console.warn(
        //   '🟣 [Step 9 - FALLBACK] Context array is empty AND sessionStorage is empty - legitimation code extraction may fail'
        // );
      }
    } else {
      // console.log('🟣 [Step 9] Context array is populated, using it directly');
    }

    try {
      setOverviewError(false);
      // console.log('🔵 mpsOverviewFormSubmit started with values:', values);

      const {
        paymentRedisKey, // Extract paymentRedisKey from form params (lookup_key from payment result)
        msisdn,
        puk,
        mnp,
        currentProvider,
        type,
        oldNumber,
        oldNumberPrefix,
        chosenTariffId,
        cscPassword,
        birthDate,
        email,
        firstName,
        lastName,
        title,
        city,
        countryCode,
        houseNumber,
        street,
        zip,
        legitimationMethod,
        invitationCode,
        acceptedCreditCheck,
        brandPartnerCustomMarketing,
        employee,
        marketingMultibrand,
        termsAndConditions,
        thirdParty
      } = values;
      setIsLoading(true);

      // correct birthDate to ISO date format
      const updatedBirthDate = moment(birthDate).format('YYYY-MM-DD');

      // MPS: we have a new top level object 'activation' which encapsulates the activation data
      // paymentRedisKey is attached at the top level for backend's activate-sim endpoint
      const params = mnp
        ? {
            payment_redis_key: paymentRedisKey || '', // Add payment_redis_key for auto-topup setup link
            activation: {
              activationData: {
                msisdn,
                puk
              },
              activationMNPData: {
                currentProvider,
                mnp,
                oldNumber: {
                  number: oldNumber,
                  prefix: oldNumberPrefix.toString()
                },
                type: Number(type)
              },
              chosenTariffId,
              cscPassword,
              legitimationMethod,
              invitationCode,
              personalData: {
                address: {
                  city,
                  countryCode: Number(countryCode),
                  houseNumber,
                  street,
                  zip
                },
                birthDate: updatedBirthDate, // former birthDate value
                emailAddress: email,
                firstName,
                flags: {
                  acceptedCreditCheck,
                  brandPartnerCustomMarketing,
                  employee,
                  marketingMultibrand,
                  termsAndConditions,
                  thirdParty
                },
                lastName,
                salutation: Number(3),
                title: Number(title)
              }
            }
          }
        : {
            payment_redis_key: paymentRedisKey || '', // Add payment_redis_key for auto-topup setup link
            activation: {
              activationData: {
                msisdn,
                puk
              },
              chosenTariffId,
              cscPassword,
              legitimationMethod,
              invitationCode,
              personalData: {
                address: {
                  city,
                  countryCode: Number(countryCode),
                  houseNumber,
                  street,
                  zip
                },
                birthDate: updatedBirthDate, // former birthDate value
                emailAddress: email,
                firstName,
                flags: {
                  acceptedCreditCheck,
                  brandPartnerCustomMarketing,
                  employee,
                  marketingMultibrand,
                  termsAndConditions,
                  thirdParty
                },
                lastName,
                salutation: Number(3),
                title: Number(title)
              }
            }
          };

      // ---------------------Activation Step---------------------

      const {
        data = {},
        data: {
          signupId: clientId = '',
          // legacy value when POSTIDENT was the only legitimation method
          postidentUrl: postidentUrlFromActivateSim = '',
          // handle new response field legitimationUrl
          legitimationUrl: legitimationUrlFromActivateSim = ''
        }
      } = await paymentService.handleActivateSim(params);

      // DEBUG LOGS
      // console.log('🔵 mpsOverviewFormSubmit - Backend Response:', {
      //   signupId: clientId,
      //   postidentUrl: postidentUrlFromActivateSim,
      //   legitimationUrl: legitimationUrlFromActivateSim
      // });
      // console.log('🔵 legitimationMethod being sent:', legitimationMethod);
      // console.log('🔵 Available legitimationMethods array (using recovered data):', methodsToUse);

      if (data) {
        // get legitimation code from legitimation URL
        // console.log('🔵 legitimationMethods (final - after fallback recovery)', methodsToUse);
        let legitimationCodeInUse = '';
        const usedLegitimationMethod = methodsToUse.find(
          (element) => element.legitimationId === legitimationMethod
        );
        // console.log('🔵 Found matching legitimation method?', usedLegitimationMethod);

        if (usedLegitimationMethod) {
          // console.log('🔵 Legitimation method details:', {
          //   codeParameterName: usedLegitimationMethod.codeParameterName,
          //   name: usedLegitimationMethod.name
          // });
        } else {
          // console.warn(
          //   '⚠️ WARNING: No matching legitimation method found in array. legitimationMethod ID:',
          //   legitimationMethod,
          //   'Available IDs:',
          //   legitimationMethods.map((m) => m.legitimationId)
          // );
        }

        const legitimationCodeParameterName = usedLegitimationMethod?.codeParameterName;
        // console.log('🔵 legitimationUrl from backend:', legitimationUrlFromActivateSim);

        if (legitimationCodeParameterName && legitimationUrlFromActivateSim) {
          try {
            let url = new URL(legitimationUrlFromActivateSim);
            legitimationCodeInUse = url.searchParams.get(legitimationCodeParameterName);
            // console.log(
            //   '🔵 Extracted legitimation code parameter:',
            //   legitimationCodeParameterName,
            //   '-> value:',
            //   legitimationCodeInUse
            // );
          } catch (urlError) {
            // console.warn('⚠️ Failed to parse legitimationUrl:', urlError.message);
          }
        } else {
          // console.warn(
          //   '⚠️ Skipping legitimation code extraction. CodeParamName:',
          //   legitimationCodeParameterName,
          //   'URL available:',
          //   !!legitimationUrlFromActivateSim
          // );
        }

        // Set Legitimation & Activation Data To Storage
        await storage.encryptedSetItem(appStorage.ACTIVATION_MSISDN, msisdn);
        await storage.encryptedSetItem(appStorage.ACTIVATION_DATA, JSON.stringify(data));
        await storage.encryptedSetItem(appStorage.ACTIVATION_PERSONAL_DATA, JSON.stringify(values));
        // legacy value when POSTIDENT was the only legitimation method
        await storage.encryptedSetItem(appStorage.POSTIDENT, postidentUrlFromActivateSim);
        await storage.encryptedSetItem(appStorage.LEGITIMATION_URL, legitimationUrlFromActivateSim);
        await storage.encryptedSetItem(appStorage.LEGITIMATION_CODE, legitimationCodeInUse);
        await storage.encryptedSetItem(
          appStorage.LEGITIMATION_NAME,
          personalDataForm.legitimationName
        );
        // legacy value when POSTIDENT was the only legitimation method
        setPostIdentUrl(postidentUrlFromActivateSim);
        setLegitimationUrl(legitimationUrlFromActivateSim);
        setLegitimationCode(legitimationCodeInUse);
      }

      setIsLoading(false);
      setStep9SubStep(3);
      return params;
    } catch (error) {
      setIsLoading(false);
      setOverviewError(true);
      setStep9SubStep(4);
      return false;
    }
  };

  const onClickBack = () => {
    setCurrentStep(0);
    setPhoneNumberActivationForm(phoneNumberInitialValue);
    setTariffActivationForm(tariffActivationInitialValue);
    setPersonalDataForm(personalDataInitialValue);
    // MPS: @Ema --> here we might need to add the reset of the payment form states as well
    setOverviewForm(overviewInitialValue);
    setIsActivationClicked(false);
  };

  const deleteStorage = async () => {
    await storage.encryptedRemoveItem(appStorage.ACTIVATION_MSISDN);
    await storage.encryptedRemoveItem(appStorage.ACTIVATION_DATA);
    await storage.encryptedRemoveItem(appStorage.ACTIVATION_PERSONAL_DATA);
    await storage.encryptedRemoveItem(appStorage.POSTIDENT);
    await storage.encryptedRemoveItem(appStorage.LEGITIMATION_URL);
    await storage.encryptedRemoveItem(appStorage.LEGITIMATION_CODE);

    await storage.encryptedRemoveItem(appStorage.CART_NAME);
    await storage.encryptedRemoveItem(appStorage.ORDER_NUMBER);
    // MPS: @Ema --> here we might need to add the reset of the payment local storage states as well
    // ALPHA: consider to remove all old local storage values related to Alphacomm payment
    await storage.encryptedRemoveItem(appStorage.TOPUP_AMOUNT);
    await storage.encryptedRemoveItem(appStorage.TOPUP_TYPE);
    await storage.encryptedRemoveItem(appStorage.TOPUP_CHARGE_TO);
    // ALPHA: consider to remove all old local storage values related to Alphacomm payment
    await storage.encryptedRemoveItem(appStorage.PAYMENT_TOKEN);
    await storage.encryptedRemoveItem(appStorage.PAYMENT_REFRESH_TOKEN);
  };

  // Clear all activation states
  const clearActivationStates = async (shouldDeleteStorage = false) => {
    setPhoneNumberActivationForm(phoneNumberInitialValue);
    setTariffActivationForm(tariffActivationInitialValue);
    setPersonalDataForm(personalDataInitialValue);
    // MPS: @Ema --> here we might need to add the reset of the payment form states as well
    setOverviewForm(overviewInitialValue);
    setIsActivationClicked(false);
    setWithVoucher(false);
    if (shouldDeleteStorage) {
      await deleteStorage();
    }
    // reset step handling
    setCurrentStep(0);
    setStep0SubStep(0);
  };

  // We wrap it in a useMemo for performance reason

  const contextPayload = useMemo(
    () => ({
      // States
      currentStep,
      setCurrentStep,
      step0SubStep,
      setStep0SubStep,
      step1SubStep,
      setStep1SubStep,
      step2SubStep,
      setStep2SubStep,
      step3SubStep,
      setStep3SubStep,
      step4SubStep,
      setStep4SubStep,
      step5SubStep,
      setStep5SubStep,
      step6SubStep,
      setStep6SubStep,
      step7SubStep,
      setStep7SubStep,
      step8SubStep,
      setStep8SubStep,
      step9SubStep,
      setStep9SubStep,
      step10SubStep,
      setStep10SubStep,

      withMnp,
      setWithMnp,
      withVoucher,
      setWithVoucher,
      withVoucherNumGB,
      setWithVoucherNumGB,

      isLoading,
      setIsLoading,
      bookableTariffs,
      setBookableTariffs,
      bookableTariffsEtcOne,
      setBookableTariffsEtcOne,
      paymentProducts,
      setPaymentProducts,
      allPaymentProducts,
      setAllPaymentProducts,
      otherAmount,
      setOtherAmount,
      showAddress,
      setShowAddress,
      cartName,
      setCartName,
      orderNumber,
      setOrderNumber,
      paymentUrl,
      setPaymentUrl,
      postIdentUrl,
      setPostIdentUrl,
      paymentMethod,
      setPaymentMethod,
      selectedTariffId,
      setSelectedTariffId,
      simProvider,
      countries,
      setCountries,
      identityTypes,
      setIdentityTypes,
      nationality,
      setNationality,
      areaCode,
      setAreaCode,
      salutations,
      setSalutations,
      isSimInvalid,
      setIsSimInvalid,
      emailModal,
      setEmailModal,
      isChargingClicked,
      setIsChargingClicked,
      activateSimSuccessPopup,
      setActivateSimSuccessPopup,
      showBackButton,
      setShowBackButton,
      isActivationClicked,
      setIsActivationClicked,
      isPostidentClicked,
      setIsPostidentClicked,
      paymentStatus,
      setPaymentStatus,
      vviDocuments,
      setVviDocuments,
      withAutoTopup,
      setWithAutoTopup,
      errorAutoTopup,
      setErrorAutoTopup,
      autoTopupApiError,
      setAautoTopupApiError,
      legitimationMethods,
      setLegitimationMethods,

      // Form States
      phoneNumberActivationForm,
      setPhoneNumberActivationForm,
      tariffActivationForm,
      setTariffActivationForm,
      personalDataForm,
      setPersonalDataForm,
      overviewForm,
      setOverviewForm,
      loginPasswordForm,
      emailCodeApiError,
      setEmailCodeApiError,
      emailCodeApiErrorMsg,
      setEmailCodeApiErrorMsg,
      isAutoLowEnabled,
      setIsAutoLowEnabled,
      isEmailLoading,
      setIsEmailLoading,
      isCodeResend,
      setIsCodeResend,
      emailApiError,
      setEmailApiError,
      voucherCodeApiError,
      setVoucherCodeApiError,
      changePasswordErrorMsg,
      setChangePasswordErrorMsg,
      phoneNumberPUKApiError,
      setPhoneNumberPUKApiError,
      addressApiError,
      setAddressApiError,
      legitimationError,
      setLegitimationError,
      countriesError,
      setCountriesError,
      areaCodeError,
      setAreaCodeError,
      simProviderError,
      setSimProviderError,
      overviewError,
      setOverviewError,
      withMNPError,
      setWithMNPError,

      // Form Initial States & Validations
      phoneNumberInitialValue,
      phoneNumberValidations,
      validationSchemaEmail,
      phoneNumberValidationsWithMNP,
      tariffActivationInitialValue,
      tariffActivationValidation,
      personalDataInitialValue,
      personalDataValidations,
      validatePasswordWithKeys,
      overviewInitialValue,
      overviewValidation,
      verifyEmailInitValues,

      // Functions
      phoneNumberSubmit,
      verifyEmail,
      verifyEmailCode,
      validationSchemaCode,
      voucherCodeValidation,
      onResendCode,
      phoneNumberActivationFormSubmit,
      tariffActivationFormSubmit,
      verifyVoucherCode,
      personalDataFormSubmit,
      loginPasswordFormSubmit,
      mpsOverviewFormSubmit,
      getLookup,
      onClickBack,
      getVVIDocuments,
      getCountries,
      staticTariffManipulation,
      getLegitimationMethods,
      updateLegitimationMethods,
      clearActivationStates,

      // Stepper Functions
      nextStep,
      prevStep,
      nextSubStep0,
      prevSubStep0,
      nextSubStep1,
      prevSubStep1,
      // nextSubStep2,
      prevSubStep2,
      nextSubStep3,
      prevSubStep3,
      nextSubStep4,
      prevSubStep4,
      nextSubStep5,
      prevSubStep5,
      nextSubStep6,
      prevSubStep6,
      nextSubStep7,
      prevSubStep7,
      nextSubStep8,
      prevSubStep8,
      nextSubStep9,
      prevSubStep9,
      nextSubStep10,
      prevSubStep10,

      showActivationHeader,
      setShowActivationHeader,
      showActivationCancelModal,
      setShowActivationCancelModal,

      // TODO: remove if not needed anymore
      showFeedbackSuccess,
      setShowFeedbackSuccess,
      showFeedbackError,
      setShowFeedbackError,
      validateAddressRes,
      setValidateAddressRes,

      legitimationCode,
      setLegitimationCode,
      legitimationUrl,
      setLegitimationUrl
    }),
    [
      // States
      currentStep,
      setCurrentStep,
      step0SubStep,
      setStep0SubStep,
      step1SubStep,
      setStep1SubStep,
      step2SubStep,
      setStep2SubStep,
      step3SubStep,
      setStep3SubStep,
      step4SubStep,
      setStep4SubStep,
      step5SubStep,
      setStep5SubStep,
      step6SubStep,
      setStep6SubStep,
      step7SubStep,
      setStep7SubStep,
      step8SubStep,
      setStep8SubStep,
      step9SubStep,
      setStep9SubStep,
      step10SubStep,
      setStep10SubStep,

      withMnp,
      setWithMnp,
      withVoucher,
      setWithVoucher,
      withVoucherNumGB,
      setWithVoucherNumGB,

      isLoading,
      setIsLoading,
      bookableTariffs,
      setBookableTariffs,
      bookableTariffsEtcOne,
      setBookableTariffsEtcOne,
      paymentProducts,
      setPaymentProducts,
      allPaymentProducts,
      setAllPaymentProducts,
      otherAmount,
      setOtherAmount,
      showAddress,
      setShowAddress,
      cartName,
      setCartName,
      orderNumber,
      setOrderNumber,
      paymentUrl,
      setPaymentUrl,
      postIdentUrl,
      setPostIdentUrl,
      isSimInvalid,
      setIsSimInvalid,
      emailModal,
      setEmailModal,
      isChargingClicked,
      setIsChargingClicked,
      activateSimSuccessPopup,
      setActivateSimSuccessPopup,
      showBackButton,
      setShowBackButton,
      isActivationClicked,
      setIsActivationClicked,
      emailCodeApiError,
      setEmailCodeApiError,
      emailCodeApiErrorMsg,
      setEmailCodeApiErrorMsg,
      isAutoLowEnabled,
      setIsAutoLowEnabled,
      isPostidentClicked,
      setIsPostidentClicked,
      paymentStatus,
      setPaymentStatus,
      vviDocuments,
      setVviDocuments,
      withAutoTopup,
      setWithAutoTopup,
      errorAutoTopup,
      setErrorAutoTopup,
      autoTopupApiError,
      setAautoTopupApiError,
      legitimationMethods,
      setLegitimationMethods,
      legitimationError,
      setLegitimationError,
      countriesError,
      setCountriesError,
      areaCodeError,
      setAreaCodeError,
      simProviderError,
      setSimProviderError,
      overviewError,
      setOverviewError,

      // Form States
      phoneNumberActivationForm,
      setPhoneNumberActivationForm,
      tariffActivationForm,
      setTariffActivationForm,
      personalDataForm,
      setPersonalDataForm,
      overviewForm,
      setOverviewForm,
      loginPasswordForm,
      isEmailLoading,
      setIsEmailLoading,
      isCodeResend,
      setIsCodeResend,
      emailApiError,
      setEmailApiError,
      voucherCodeApiError,
      setVoucherCodeApiError,
      changePasswordErrorMsg,
      setChangePasswordErrorMsg,
      phoneNumberPUKApiError,
      setPhoneNumberPUKApiError,
      addressApiError,
      setAddressApiError,
      withMNPError,
      setWithMNPError,

      // Form Initial States & Validations
      phoneNumberInitialValue,
      phoneNumberValidations,
      validationSchemaEmail,
      phoneNumberValidationsWithMNP,
      tariffActivationInitialValue,
      tariffActivationValidation,
      personalDataInitialValue,
      personalDataValidations,
      validatePasswordWithKeys,
      overviewInitialValue,
      overviewValidation,
      verifyEmailInitValues,

      // Functions
      phoneNumberSubmit,
      verifyEmail,
      verifyEmailCode,
      validationSchemaCode,
      voucherCodeValidation,
      onResendCode,
      phoneNumberActivationFormSubmit,
      tariffActivationFormSubmit,
      verifyVoucherCode,
      personalDataFormSubmit,
      loginPasswordFormSubmit,
      mpsOverviewFormSubmit,
      getLookup,
      onClickBack,
      getVVIDocuments,
      getCountries,
      staticTariffManipulation,
      getLegitimationMethods,
      updateLegitimationMethods,
      clearActivationStates,

      // Stepper Functions
      nextStep,
      prevStep,
      nextSubStep0,
      prevSubStep0,
      nextSubStep1,
      prevSubStep1,
      // nextSubStep2,
      prevSubStep2,
      nextSubStep3,
      prevSubStep3,
      nextSubStep4,
      prevSubStep4,
      nextSubStep5,
      prevSubStep5,
      nextSubStep6,
      prevSubStep6,
      nextSubStep7,
      prevSubStep7,
      nextSubStep8,
      prevSubStep8,
      nextSubStep9,
      prevSubStep9,
      nextSubStep10,
      prevSubStep10,

      showActivationHeader,
      setShowActivationHeader,
      showActivationCancelModal,
      setShowActivationCancelModal,

      // TODO: remove if not needed anymore
      showFeedbackSuccess,
      setShowFeedbackSuccess,
      showFeedbackError,
      setShowFeedbackError,
      validateAddressRes,
      setValidateAddressRes,

      legitimationCode,
      setLegitimationCode,
      legitimationUrl,
      setLegitimationUrl
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <ActivationContext.Provider value={contextPayload}>{children}</ActivationContext.Provider>;
}

ActivationContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useActivation = () => useContext(ActivationContext);

export default ActivationContext;
