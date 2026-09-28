import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import moment from 'moment';
import axios from 'axios';

import {
  useAppConfig,
  simLockStatus,
  simLockStatusTitle,
  StatusCodes
} from '@config/AppConfig';
import { useStaticContent } from '@context/StaticContent';
import { useAuth } from '@dom-digital-online-media/dom-auth-sdk';
import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
import {
  appRegex,
  appRoute,
  appStaticContentConfig,
  appStorage,
  formValidation,
  generateUUID,
  inputValidation,
  validateDOB,
  validCharRegex,
  validateForbiddenChar
} from '@utils/globalConstant';
import { useAlert } from '@context/Utils';
import { deleteAllCookies } from '@utils/cookies';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { useCustomer } from '../Customer';

export const AccountContext = createContext({});

export function AccountContextProvider({ children, config: { storage } }) {
  // Constants

  // Login initial value
  const loginInitialValue = {
    username: '',
    password: ''
  };

  const changePasswordInitialValue = {
    newPassword: '',
    confirmPassword: ''
  };

  const forgotPasswordInitialValue = {
    number: '',
    // puk: ''
    birthDate: ''
  };

  const cancelContractOptionalInitValue = {
    asap: '',
    tillDate: '',
    validUntil: '',
    extraOrdinary: '',
    terminationReason: ''
  };

  // API Data Storage States
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassRes, setForgotPassRes] = useState('');
  const [email, setEmail] = useState('');
  // const [domWithProduct, setDomWithProduct] = useState(null);
  const [lockStatus, setLockStatus] = useState();
  const [loginForm, setLoginFrom] = useState();
  const [changePasswordForm, setChangePasswordForm] = useState(changePasswordInitialValue);
  const [forgotPasswordForm, setForgotPasswordForm] = useState(forgotPasswordInitialValue);
  const [welcomePopup, setWelcomePopup] = useState('');
  const [contactSuccessModal, setContactSuccessModal] = useState(false);
  const [hotlineSuccessModal, setHotlineSuccessModal] = useState(false);
  const [cancelContractForm, setCancelContractForm] = useState({});
  const [cancelContractRes, setCancelContractRes] = useState({ downloadLink: false });
  const [oldPasswordErrorMsg, setOldPasswordErrorMsg] = useState('');
  const [isChangePasswordError, setIsChangePasswordError] = useState(false);
  const [forcePasswordSuccessModal, setForcePasswordSuccessModal] = useState(false);
  const [emailUniqueId, setEmailUniqueId] = useState('');
  const [emailModal, setEmailModal] = useState(false);
  const [emailChangeStep, setEmailChangeStep] = useState(0);
  const [emailCodeError, setEmailCodeError] = useState(false);
  const [emailCodeErrorMsg, setEmailCodeErrorMsg] = useState(null);
  const [isCodeResend, setIsCodeResend] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isHotlineChangeSuccess, setIsHotlineChangeSuccess] = useState(false);
  const [isEmailChangeSuccess, setIsEmailChangeSuccess] = useState(false);
  const [isContactChangeSuccess, setIsContactChangeSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState(null);
  const [preferenceSuccessModal, setPreferenceSuccessModal] = useState(false);
  const [preferenceAlert, setPreferenceAlert] = useState(false);
  const [isLoginSubmit, setIsLoginSubmit] = useState(false);
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);
  const [isForgetPassClicked, setIsForgetPassClicked] = useState(false);
  const [pdfDownloadSuccess, setPdfDownloadSuccess] = useState(false);
  const [isOTPPopup, setIsOTPPopup] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [forgotPasswordError, setForgotPasswordError] = useState(null);
  const [emailApiError, setEmailApiError] = useState('');
  const [apiErrorMsg, setApiErrorMsg] = useState(null);

  // Context
  const { env } = useAppConfig();
  const navigate = useNavigate();
  const { setIsGenericError } = useAlert();
  const {
    onChangeCustomerDataCall,
    onChangePasswordCall,
    onSimLock,
    onUnSimLock,
    onCustomerFogotPasswordCall,
    onTwoFactorAuthPinCall,
    onTwoFactorAuthVerificationCall,
    onChangeOptinFlagsCall,
    domWithProductData
  } = useMobileOne();
  const {
    customerData,
    personalData: { alternatePhoneNumber = {} },
    personalData,
    customerProducts,
    customerSaveLoginData,
    getCustomerData,
    // onDOMWithProduct,
    logoutPopupImage,
    setIsForcePasswordReset
  } = useCustomer();
  const { onPasswordLogin, setUserLogin, onLogout, isUserLoggedIn } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const { t, getStaticContentValue, onContractTerminationCall } = useStaticContent();

  const hotlinePasswordInitialValue = {
    pswrdForHtLine: customerData ? customerData?.hotlinePassword : ''
  };

  const changeEmailInitvalue = {
    email: '',
    // isEmailDiff: 'NO',
    // confirmEmail: '',
    // emailAddress: '',
    emailCode: ''
  };

  const contactNumberInitValue = {
    alternateNumberPrefix: alternatePhoneNumber?.prefix || '',
    alternateNumber: alternatePhoneNumber?.number || ''
  };

  const preferencesInitValue = {
    brandPartnerCustomMarketing:
      domWithProductData?.personalData?.flags?.brandPartnerCustomMarketing || false,
    marketingMultibrand: domWithProductData?.personalData?.flags?.marketingMultibrand || false,
    thirdParty: domWithProductData?.personalData?.flags?.thirdParty || false
  };

  const [changeEmailForm, setChangeEmailForm] = useState(changeEmailInitvalue);
  const [hotlinePasswordForm, setHotlinePasswordForm] = useState(hotlinePasswordInitialValue);

  // VALIDATION

  // Password match error message
  const errorMessagePasswordMatch = tA11y('nc_global_pw_match_err').content;

  const cancelContractValidation = yup.lazy((values) => {
    if (values.asap === 'false' && values.extraOrdinary === 'YES') {
      return yup.object().shape({
        validUntil: yup.date().required(t('nc_serv_cnl_contract_input_err')),
        // .max(validateDate(values.validUntil), t('nc_serv_cnl_contract_input_err')),
        asap: formValidation({
          required: t('please_select_option')
        }),
        extraOrdinary: formValidation({
          required: t('please_select_option')
        }),
        terminationReason: formValidation({
          required: t('please_enter_reason')
        })
      });
    }
    if (values.asap === 'false') {
      return yup.object().shape({
        validUntil: yup.date().required(t('nc_serv_cnl_contract_input_err')),
        // .max(validateDate(values.validUntil), t('nc_serv_cnl_contract_input_err')),
        asap: formValidation({
          required: t('please_select_option')
        })
      });
    }
    if (values.extraOrdinary === 'YES') {
      return yup.object().shape({
        extraOrdinary: formValidation({
          required: t('please_select_option')
        }),
        terminationReason: formValidation({
          required: t('please_enter_reason')
        })
      });
    }
    return yup.object().shape({
      asap: formValidation({
        required: t('please_select_option')
      }),
      extraOrdinary: formValidation({
        required: t('please_select_option')
      })
    });
  });

  const validateContactNumber = yup.object().shape({
    alternateNumberPrefix: formValidation({
      required: t('nc_acc_data_chcontact_ input_prefix_err'),
      regex: /^.{1,6}$/,
      validErrorMessage: t('nc_acc_data_chcontact_ input_prefix_err')
    }),
    alternateNumber: formValidation({
      required: t('nc_acc_data_chcontact_ input_number_err'),
      regex: /^[0-9]{4,15}$/,
      validErrorMessage: t('nc_acc_data_chcontact_ input_number_err')
    })
  });

  const validateEmail = yup.object().shape({
    email: yup
      .string()
      .required(tA11y('nc_global_email_change_err').content)
      .email(tA11y('nc_global_email_change_err').content)
      .concat(
        validateForbiddenChar(yup, validCharRegex.EMAIL, tA11y('nc_global_email_err').content)
      )
  });

  const hotlinePasswordValidation = yup.object().shape({
    pswrdForHtLine: formValidation({
      required: t('nc_global_hotline_pw_err'),
      regex: /^[(A-Z)|(Ö)|(Ä)|(Ü)|(a-z)|(0-9)|(ü)|(ö)|(ä)|(ß)]{4,20}$/,
      validErrorMessage: t('nc_global_hotline_pw_err')
    })
  });

  const changePasswordValidation = yup.object().shape({
    oldPassword: formValidation({
      required: t('ek_change-pw_h1_error-msg')
    })
  });

  const validatePwd = (password) => {
    const pattern =
      t('nc_password_regex') !== 'nc_password_regex'
        ? new RegExp(`${t('nc_password_regex')}`)
        : appRegex.validatePwd;
    return pattern.test(password);
  };

  const validatePwdStringLength = (password) => {
    const pattern =
      t('nc_password_string_length_regex') !== 'nc_password_string_length_regex'
        ? new RegExp(`${t('nc_password_string_length_regex')}`)
        : appRegex.validatePwdStringLength;
    return pattern.test(password);
  };
  const validatePwdUpperOrLowerCase = (password) => {
    const pattern =
      t('nc_password_upper_or_lower_case_regex') !== 'nc_password_upper_or_lower_case_regex'
        ? new RegExp(`${t('nc_password_upper_or_lower_case_regex')}`)
        : appRegex.validatePwdUpperOrLowerCase;
    return pattern.test(password);
  };
  const validatePwdNumbers = (password) => {
    const pattern =
      t('nc_password_numbers_regex') !== 'nc_password_numbers_regex'
        ? new RegExp(`${t('nc_password_numbers_regex')}`)
        : appRegex.validatePwdNumbers;
    return pattern.test(password);
  };
  const validatePwdSpecialChar = (password) => {
    const pattern =
      t('nc_password_special_chars_regex') !== 'nc_password_special_chars_regex'
        ? new RegExp(`${t('nc_password_special_chars_regex')}`)
        : appRegex.validatePwdSpecialChar;
    return pattern.test(password);
  };

  // Password Validation
  const validatePasswordWithKeys = (values, firstPasswordKey, confirmPasswordKey) => {
    // string, controlName, password

    if (!values[firstPasswordKey] && !values[confirmPasswordKey]) return {};

    const errors = Object.keys(values).map((controlName) => {
      const string = values[controlName];
      if (!string) {
        return {
          //  [controlName]: t('nc_acc_data_chpwd_require5') // t('ek_ap_password_pw1_error-msg')
          [controlName]: 'Pflichtfeld' // change to "Pflichtfeld" to match validatePasswordWithKeys in the Activation context // REFACTOR later
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
          [confirmPasswordKey]: t('nc_password_error_invalid-char'),
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
        errorMsg = { ...errorMsg, [confirmPasswordKey]: t('nc_acc_data_chpwd_require5') };
        errorMsg = { ...errorMsg, [confirmPasswordKey]: errorMessagePasswordMatch };
      }

      return errorMsg;
    });
    return Object.assign(...errors);
  };

  const forgotPasswordValidation = yup.object().shape({
    number: formValidation({
      required: tA11y('nc_global_phone_numbr_err').content,
      regex: /^\d{5,20}$/,
      validErrorMessage: tA11y('nc_global_phone_numbr_err').content
    }),
    birthDate: yup
      .date()
      .required(tA11y('nc_global_brthdy_err').content)
      .max(validateDOB(), tA11y('nc_global_brthdy_err').content)
    // puk: formValidation({
    //   required: t('nc_login_pass_modal_input_puk_err_msg'),
    //   regex: /^\d{4,8}$/,
    //   validErrorMessage: t('nc_login_pass_modal_input_puk_err_msg')
    // })
  });

  const customPasswordSchema = (values) => {
    const errors = {};
    if (!values.oldPassword && !values.newPassword && !values.confirmPassword) {
      errors.oldPassword = 'please_enter_old_password';
      errors.newPassword = 'please_enter_new_password';
      errors.confirmPassword = 'please_enter_confirm_password';
    } else if (values.oldPassword === values.newPassword) {
      errors.newPassword = 'old_password_and_new_password_must_not_be_same';
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Confirm_Password_new_password_must_be_same';
    }
    return errors;
  };

  // Phone number and password validation
  const loginFormValidations = yup.object().shape({
    username: formValidation({
      required: tA11y('nc_global_phone_numbr_err').content,
      regex: /^\d{5,20}$/,
      validErrorMessage: tA11y('nc_global_phone_numbr_err').content
    }),
    password: formValidation({
      required: tA11y('nc_global_pw_err').content
      // regex: /^(?=.*[0-9])(?=.*[!"$%&#§ÄÜÖßäöü])[a-zA-Z0-9|!"$%&#§ÄÜÖßäöü]{8,16}$/,
      // validErrorMessage: t('ek_login_password_error-msg')
    })
  });

  // const validationSchemaCode = yup.object().shape({
  //   emailCode: yup
  //     .number()
  //     .typeError(t('nc_2fa_step2_code_error'))
  //     .required(t('nc_2fa_step2_code_error'))
  //     .test('code', t('nc_2fa_step2_code_error'), (hp) => /^\d{4}$/.test(hp))
  // });
  const validationSchemaCode = yup.object().shape({
    // changed validation for emailCode to string although wrong and contradictory to API specification
    // which requires a number, project management wanted to make frontend error message disappear for
    // "numbers" with a leading zero --> validation responsibility is shifted to ETC One backend
    emailCode: yup
      .string()
      .typeError(tA11y('nc_global_2fa_code_err').content)
      .required(tA11y('nc_global_2fa_code_err').content)
      .test('code', tA11y('nc_global_2fa_code_err').content, (hp) => /^\d{4}$/.test(hp))
  });

  // Functions
  // Personal Data -----------------------------
  // eslint-disable-next-line no-unused-vars
  const loadPersonalData = () => {
    try {
      setIsLoading(true);
      const { email: { emailAddress = '' } = {} } = personalData;
      if (emailAddress) setEmail(emailAddress);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // Customer Products -------------------------
  // eslint-disable-next-line no-unused-vars
  const loadCustomerProducts = () => {
    try {
      setIsLoading(true);

      const findFirstProduct = customerProducts.find((a) => a.status && a.status.name);
      const {
        status: { name: simStatus, name = false }
      } = findFirstProduct;
      if (name) {
        if (simStatus === simLockStatus.ACTIVE) {
          setLockStatus(simLockStatus.ACTIVE);
        } else if (simStatus === simLockStatus.SIM_LOCK_INPROGRESS) {
          setLockStatus(simLockStatus.SIM_LOCK_INPROGRESS);
        } else if (simStatus === simLockStatus.SIM_LOCKED) {
          setLockStatus(simLockStatus.SIM_LOCKED);
        } else if (simStatus === simLockStatus.SIM_UNLOCK_REQUESTED) {
          setLockStatus(simLockStatus.SIM_UNLOCK_REQUESTED);
        } else if (simStatus === simLockStatus.ACTIVATION_INPROGRESS) {
          setLockStatus(simLockStatus.ACTIVATION_INPROGRESS);
        } else {
          setLockStatus(simStatus);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
        setChangeEmailForm({ ...changeEmailForm, emailAddress: values.email });
        setEmailChangeStep(1);
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
        setEmailApiError(error?.error?.[0]?.messageBody);
      }
      return false;
    }
  };

  const verifyEmailCode = async (values) => {
    try {
      const { emailCode } = values;
      setIsLoading(true);

      const { data, success } = await onTwoFactorAuthVerificationCall({
        pin: Number(emailCode),
        uniqueId: emailUniqueId
      });

      // eslint-disable-next-line prefer-const
      let inputparams = {
        emailAddress: changeEmailForm.emailAddress
      };

      if (data && success) {
        const response = await onChangeCustomerDataCall(inputparams);
        if (response.success) {
          await getCustomerData();
          setContactSuccessModal(!contactSuccessModal);
          setIsEmailChangeSuccess(true);
          setIsLoading(false);
          setEmailChangeStep(0);
        }
      }
      setIsLoading(false);
      setEmailCodeErrorMsg(null);
      return data;
    } catch (error) {
      setIsLoading(false);
      setEmailCodeError(true);
      setEmailCodeErrorMsg(error?.error?.[0]?.messageBody);
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
        email: changeEmailForm.emailAddress,
        uniqueId: resendUniqueId
      });
      if (data && success) {
        setIsLoading(false);
        setIsCodeResend(true);
      }
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  // change hotline password--------------------
  const onHotlinePasswordSubmit = async (values) => {
    try {
      setIsLoading(true);

      const { data, success } = await onChangeCustomerDataCall({
        hotlinePassword: values.pswrdForHtLine
      });
      if (success) {
        setIsHotlineChangeSuccess(true);
        await getCustomerData();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
      setIsGenericError(false);
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
        setIsGenericError(true);
      }
      return false;
    }
  };

  // change password--------------------
  const onChangePasswordSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (!values.oldPassword) {
        setOldPasswordErrorMsg(getStaticContentValue('nc_global_current_pw_err').content);
      }
      if (!validatePwd(values.newPassword) || !values.oldPassword) {
        setIsLoading(false);
        return false;
      }
      const { data, success } = await onChangePasswordCall({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      if (data && success) {
        setPasswordSuccess(true);
        const { access_token: accessToken, refresh_token: refreshToken } = data;
        await storage.encryptedSetItem(appStorage.AUTH_TOKEN, accessToken);
        await storage.encryptedSetItem(appStorage.AUTH_REFRESH_TOKEN, refreshToken);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
      setIsChangePasswordError(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setApiErrorMsg(error?.error?.[0]?.messageBody);
      setIsChangePasswordError(true);
      return error;
    }
  };

  const onForceChangePasswordSubmit = async (values) => {
    try {
      setIsLoading(true);
      const { data, success } = await onChangePasswordCall({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      if (success) {
        setIsLoading(false);
        setIsForcePasswordReset(false);
        setPasswordSuccess(true);
        setIsChangePasswordError(false);
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setApiErrorMsg(error?.error?.[0]?.messageBody);
      setIsChangePasswordError(true);
      return false;
    }
  };

  // Login grant type password-------------------
  const onLoginSubmit = async (values) => {
    try {
      setIsLoading(true);

      const { data, success } = await onPasswordLogin({
        username: values.username,
        password: values.password
      });
      if (success) {
        setTimeout(() => {
          setUserLogin(true);
          navigate(appRoute.DASHBOARD);
          // setWelcomePopup('welcome_popup');
          setIsLoginSubmit(true);
          setIsLoading(false);
        }, 100);
      } else {
        setIsLoading(false);
      }
      return data;
    } catch (error) {
      setIsLoading(false);
      setLoginError(true);
      setLoginErrorMsg(error?.error?.[0]?.messageBody);
      return false;
    }
  };

  const onLogoutPress = async () => {
    setIsLoading(true);
    const authToken = await storage.encryptedGetItem(appStorage.AUTH_TOKEN);
    const refreshToken = await storage.encryptedGetItem(appStorage.AUTH_REFRESH_TOKEN);
    try {
      const response = await onLogout(refreshToken, authToken);
      if (response.status === 200) {
        setUserLogin(false);
        localStorage.clear();
        sessionStorage.clear();

        setIsLoading(false);
        // window.location.href = '/';
      }
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
      localStorage.clear();
      sessionStorage.clear();
      deleteAllCookies();
      window.location.href = '/';
    }
  };

  // Forgot password
  const onForgotPasswordSubmit = async (values) => {
    try {
      setIsLoading(true);
      const updatedDate = moment(values.birthDate, 'DD.MM.YYYY').format('DD.MM.YYYY');

      const { data, success } = await onCustomerFogotPasswordCall({
        birthdate: updatedDate,
        username: values.number
      });
      if (success) {
        setIsLoading(false);

        setIsForgetPassClicked(false);
        setForgotPassRes('success');
        setForgotPasswordStep(1);
      }

      setIsLoading(false);

      return data;
      // return true;
    } catch (error) {
      setIsLoading(false);
      setIsForgetPassClicked(false);
      setForgotPassRes('error');
      if (
        !(
          error?.status === StatusCodes.UNAUTHORIZED ||
          error?.status === StatusCodes.FORBIDDEN ||
          error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.FORBIDDEN
        )
      ) {
        setForgotPasswordError(error?.error?.[0]?.messageBody);
      }
      return false;
    }
  };

  const onChangePreferencesSubmit = async (values) => {
    try {
      setIsLoading(true);

      const { data, success } = await onChangeOptinFlagsCall(values);
      if (data && success) {
        setPreferenceSuccessModal(true);
        const currentTime = new Date().getTime();
        const flagShownTime = currentTime + 300000;
        localStorage.setItem(appStorage.CONSENT_SHOW_TIME, flagShownTime);
        setIsLoading(false);
      }
      // await onDOMWithProduct();
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
        setIsGenericError(true);
      }
      return false;
    }
  };

  // Lock  SIM--------------------
  const lockSimCard = async () => {
    try {
      setIsLoading(true);
      const { data, success } = await onSimLock();
      await getCustomerData();
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

  // unlock SIM--------------------
  const unLockSimCard = async () => {
    try {
      setIsLoading(true);
      const { data, success } = await onUnSimLock();
      await getCustomerData();
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

  // handle LockTitleStatus
  const handleLockStatus = () => {
    switch (lockStatus) {
      case simLockStatus.ACTIVE:
        return simLockStatusTitle.ACTIVE;
      case simLockStatus.SIM_LOCK_INPROGRESS:
        return simLockStatusTitle.SIM_LOCK_INPROGRESS;
      case simLockStatus.SIM_LOCKED:
        return simLockStatusTitle.SIM_LOCKED;
      case simLockStatus.SIM_UNLOCK_REQUESTED:
        return simLockStatusTitle.SIM_UNLOCK_REQUESTED;
      default:
        return simLockStatusTitle.DEFAULT;
    }
  };

  // handle LockTitleStatus
  const onSimLockSubmit = () => {
    if (lockStatus !== simLockStatus.ACTIVATION_INPROGRESS) {
      if (handleLockStatus(lockStatus) === simLockStatusTitle.ACTIVE) {
        lockSimCard();
      } else if (handleLockStatus(lockStatus) === simLockStatusTitle.SIM_LOCKED) {
        unLockSimCard();
      }
    }
  };

  const onCancelTerminationCall = async (values) => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line no-unneeded-ternary
      const ordinary = values.extraOrdinary === 'NO' ? true : false;
      // eslint-disable-next-line no-unneeded-ternary
      const extraOrdinary = values.extraOrdinary === 'YES' ? true : false;
      // eslint-disable-next-line no-unneeded-ternary
      const possibleDate = values.asap === 'true' ? true : false;
      const date = values.asap === 'false' ? values.validUntil : '';

      const inputParams = JSON.stringify({
        client: appStaticContentConfig.client,
        'first name': cancelContractForm.userFirstName,
        'last name': cancelContractForm.userLastName,
        street: cancelContractForm.cancelStreet,
        'street number': cancelContractForm.cancelHouseNumber,
        zipcode: cancelContractForm.cancelZip,
        city: cancelContractForm.cancelCity,
        'email address': cancelContractForm.email,
        'customer ID': cancelContractForm.userCustomerNumber,
        'mobile phone number': cancelContractForm.telefonNummer,
        'date of termination': date,
        'terminate on next possible': possibleDate,
        'ordinary termination': ordinary,
        'extraordinary termination': extraOrdinary,
        'reason for extraordinary termination': values.terminationReason
      });
      // setCancelContractRes({ downloadLink: 'https://norma-v2-be.spreadspace.de/sites/default/files/pdf/11ed7d6e/K%C3%BCndigung_1234567890.pdf' });
      const response = await onContractTerminationCall(inputParams);
      if (response.status === 200) {
        setCancelContractRes({ downloadLink: response.data.url });
      }
      setIsLoading(false);

      return response;
      // return true;
    } catch (error) {
      setIsLoading(false);
      setIsGenericError(true);
      return false;
    }
  };

  const downloadPDF = () => {
    window.open(cancelContractRes.downloadLink, '_blank');
    setCancelContractRes({ downloadLink: false });
    setCancelContractForm({});
  };

  const onLoad = async () => {
    try {
      setIsLoading(true);
      await getCustomerData();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // Hooks
  useEffect(() => {
    if (customerData.msisdn) {
      if (customerData.forcePasswordReset) {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else if (isLoginSubmit) {
        setIsLoginSubmit(false);
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    }
  }, [customerData.msisdn]);

  useEffect(() => {
    if (domWithProductData) {
      if (domWithProductData.customerData) {
        const flagShownTime = parseInt(localStorage.getItem(appStorage.PREFERENCE_SHOW_TIME), 10);
        const msisdn = localStorage.getItem(appStorage.MSISDN);
        const currentTime = new Date().getTime();
        setPreferenceAlert(
          currentTime < flagShownTime && domWithProductData.customerData.msisdn === msisdn
        );
        if (currentTime > flagShownTime && domWithProductData.customerData.msisdn === msisdn) {
          onLoad();
          localStorage.removeItem(appStorage.PREFERENCE_SHOW_TIME);
          localStorage.removeItem(appStorage.MSISDN);
        }
      }
    }
  }, [domWithProductData]);

  // #5634 - adhoc API call
  const fetchAdhoc = async () => {
    try {
      await axios.get(`${env.REACT_APP_MO_URL}adhoc/dom`);
    } catch (error) {
      // pass
    }
  };

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading,
      email,
      setEmail,
      lockStatus,
      setLockStatus,
      loginInitialValue,
      loginForm,
      setLoginFrom,
      loginFormValidations,
      forgotPasswordInitialValue,
      forgotPasswordForm,
      setForgotPasswordForm,
      forgotPasswordValidation,
      onForgotPasswordSubmit,
      forgotPassRes,
      setForgotPassRes,
      welcomePopup,
      setWelcomePopup,
      cancelContractForm,
      setCancelContractForm,
      cancelContractRes,
      setCancelContractRes,
      contactSuccessModal,
      setContactSuccessModal,
      passwordSuccess,
      setPasswordSuccess,
      hotlineSuccessModal,
      setHotlineSuccessModal,
      oldPasswordErrorMsg,
      setOldPasswordErrorMsg,
      isChangePasswordError,
      setIsChangePasswordError,
      forcePasswordSuccessModal,
      setForcePasswordSuccessModal,
      emailModal,
      setEmailModal,
      emailCodeError,
      setEmailCodeError,
      emailCodeErrorMsg,
      setEmailCodeErrorMsg,
      loginError,
      setLoginError,
      loginErrorMsg,
      setLoginErrorMsg,
      preferenceSuccessModal,
      setPreferenceSuccessModal,
      preferenceAlert,
      setPreferenceAlert,
      isLogoutClicked,
      setIsLogoutClicked,
      isLoginSubmit,
      setIsLoginSubmit,
      isForgetPassClicked,
      setIsForgetPassClicked,
      isHotlineChangeSuccess,
      setIsHotlineChangeSuccess,
      isEmailChangeSuccess,
      setIsEmailChangeSuccess,
      isContactChangeSuccess,
      setIsContactChangeSuccess,
      emailChangeStep,
      setEmailChangeStep,
      isCodeResend,
      setIsCodeResend,
      pdfDownloadSuccess,
      setPdfDownloadSuccess,
      isOTPPopup,
      setIsOTPPopup,
      forgotPasswordSuccess,
      setForgotPasswordSuccess,
      forgotPasswordStep,
      setForgotPasswordStep,
      forgotPasswordError,
      setForgotPasswordError,
      emailApiError,
      setEmailApiError,
      apiErrorMsg,
      setApiErrorMsg,

      // API calls
      onHotlinePasswordSubmit,
      onChangePasswordSubmit,
      lockSimCard,
      unLockSimCard,
      onLoginSubmit,
      onForceChangePasswordSubmit,

      // Form Initial States & Validations
      changeEmailInitvalue,
      validateContactNumber,
      contactNumberInitValue,
      changeEmailForm,
      setChangeEmailForm,
      hotlinePasswordInitialValue,
      hotlinePasswordValidation,
      hotlinePasswordForm,
      setHotlinePasswordForm,
      changePasswordInitialValue,
      changePasswordValidation,
      validatePasswordWithKeys,
      changePasswordForm,
      setChangePasswordForm,
      customPasswordSchema,
      cancelContractValidation,
      cancelContractOptionalInitValue,
      validateEmail,
      verifyEmail,
      verifyEmailCode,
      onResendCode,
      validationSchemaCode,
      preferencesInitValue,

      // functions
      handleLockStatus,
      onSimLockSubmit,
      onLogoutPress,
      onCancelTerminationCall,
      onChangePreferencesSubmit,
      downloadPDF,
      fetchAdhoc
    }),
    [
      // States
      isLoading,
      setIsLoading,
      email,
      setEmail,
      lockStatus,
      setLockStatus,
      loginInitialValue,
      loginForm,
      setLoginFrom,
      loginFormValidations,
      forgotPasswordInitialValue,
      forgotPasswordForm,
      setForgotPasswordForm,
      forgotPasswordValidation,
      onForgotPasswordSubmit,
      forgotPassRes,
      setForgotPassRes,
      welcomePopup,
      setWelcomePopup,
      cancelContractForm,
      setCancelContractForm,
      cancelContractRes,
      setCancelContractRes,
      contactSuccessModal,
      setContactSuccessModal,
      passwordSuccess,
      setPasswordSuccess,
      hotlineSuccessModal,
      setHotlineSuccessModal,
      oldPasswordErrorMsg,
      setOldPasswordErrorMsg,
      isChangePasswordError,
      setIsChangePasswordError,
      forcePasswordSuccessModal,
      setForcePasswordSuccessModal,
      emailModal,
      setEmailModal,
      emailCodeError,
      setEmailCodeError,
      emailCodeErrorMsg,
      setEmailCodeErrorMsg,
      loginError,
      setLoginError,
      loginErrorMsg,
      setLoginErrorMsg,
      preferenceSuccessModal,
      setPreferenceSuccessModal,
      preferenceAlert,
      setPreferenceAlert,
      isLogoutClicked,
      setIsLogoutClicked,
      isLoginSubmit,
      setIsLoginSubmit,
      isForgetPassClicked,
      setIsForgetPassClicked,
      isHotlineChangeSuccess,
      setIsHotlineChangeSuccess,
      isEmailChangeSuccess,
      setIsEmailChangeSuccess,
      isContactChangeSuccess,
      setIsContactChangeSuccess,
      emailChangeStep,
      setEmailChangeStep,
      isCodeResend,
      setIsCodeResend,
      pdfDownloadSuccess,
      setPdfDownloadSuccess,
      isOTPPopup,
      setIsOTPPopup,
      forgotPasswordSuccess,
      setForgotPasswordSuccess,
      forgotPasswordStep,
      setForgotPasswordStep,
      forgotPasswordError,
      setForgotPasswordError,
      emailApiError,
      setEmailApiError,
      apiErrorMsg,
      setApiErrorMsg,

      // API calls
      onHotlinePasswordSubmit,
      onChangePasswordSubmit,
      lockSimCard,
      unLockSimCard,
      onLoginSubmit,
      onForceChangePasswordSubmit,

      // Form Initial States & Validations
      changeEmailInitvalue,
      validateContactNumber,
      changeEmailForm,
      setChangeEmailForm,
      hotlinePasswordInitialValue,
      hotlinePasswordValidation,
      hotlinePasswordForm,
      setHotlinePasswordForm,

      changePasswordInitialValue,
      changePasswordValidation,
      contactNumberInitValue,
      validatePasswordWithKeys,
      changePasswordForm,
      setChangePasswordForm,
      customPasswordSchema,
      cancelContractValidation,
      cancelContractOptionalInitValue,
      validateEmail,
      verifyEmail,
      verifyEmailCode,
      onResendCode,
      validationSchemaCode,
      preferencesInitValue,

      // functions
      handleLockStatus,
      onSimLockSubmit,
      onLogoutPress,
      onCancelTerminationCall,
      onChangePreferencesSubmit,
      downloadPDF,
      fetchAdhoc
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return (
    <AccountContext.Provider value={contextPayload}>
      {children}
    </AccountContext.Provider>
  );
}

// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useAccount = () => useContext(AccountContext);

export default AccountContext;
