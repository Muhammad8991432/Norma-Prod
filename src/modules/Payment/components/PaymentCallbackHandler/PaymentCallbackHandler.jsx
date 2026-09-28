/**
 * PaymentCallbackHandler - Unified payment callback handler for all payment flows
 *
 * Handles payment callbacks for:
 * - Activation (auto-topup setup)
 * - TopUp (direct and recurring)
 * - Future payment integrations
 *
 * Flow detection via sessionStorage.getItem('mps_payment_flow'):
 * - 'activation' → Activation flow
 * - 'recurring' or 'onetime' → TopUp flow
 * - 'public-online-topup' → Public Online TopUp flow (aufladen.de)
 *    amount and payment method are provided via the `publicOnlineTopupPayment` context
 * - 'account-add-payment' → Account Add Payment flow (storing payment method for future recurring charges)
 *
 * Supports three callback methods:
 * 1. Query params (PayPal redirect): completed=true&state=ERROR|SUCCESS|CANCELLED&lookup_key=UUID
 * 2. Context (immediate payment): mpsActivationTopupPayment.paymentResult from Payment context
 * 3. Polling: continuous /result/{lookup_key} checks via usePaymentPolling hook
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ScrollToTop,
  ButtonPrimary,
  FooterMain,
  LoadingScreen,
  Ta11yText,
  ErrorSupportBox,
  Meta,
  Link
} from '@core/index';
import { Icons } from '@core/Utils';
import { AppPageContentWrapper } from '@part/AppPageContentWrapper';
import {
  appButtonTypes,
  appRoute,
  appStorage,
  appTopUpType,
  appTopUpTo,
  appMpsPaymentMethodType,
  appLinkStyle
} from '@utils/globalConstant';
import { useConfig } from '@config/ContextManager';
import { useA11y } from '@context/Utils/A11y';
import { useTitle } from '@context/Utils/Title';
import { usePayment } from '@context/Payment';
import { usePublicOnlineTopUp } from '@context/PublicOnlineTopUp';
import { useActivation, useCustomer } from '@context/MobileOne';
import { replaceDynamicCmsContent } from '@utils/a11y/a11yHelpers';
import { usePaymentPolling } from '@modules/Payment/hooks/usePaymentPolling';

export function PaymentCallbackHandler() {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const { tA11yTranslate, getGlobalMetaTitles } = useA11y();
  const { announceTitle } = useTitle();
  const {
    config: { storage }
  } = useConfig();
  const { mpsActivationTopupPayment, mpsTopupPayment, accountMpsTopupPaymentMethod } = usePayment();
  const { publicOnlineTopupPayment } = usePublicOnlineTopUp();
  const { setCurrentStep } = useActivation();
  const { tariffPriceDetails } = useCustomer();

  // DETECT FLOW TYPE
  const paymentFlow = sessionStorage.getItem('mps_payment_flow');
  // console.log('[PaymentCallbackHandler] Detected payment flow:', paymentFlow);

  // This callback handles BOTH activation and topup flows
  // Flow detection: activation uses 'activation' flow, topup uses 'recurring' or 'onetime', public-online-topup uses 'public-online-topup', account-add-payment for account settings
  const isActivationFlow = paymentFlow === 'activation';
  const isPublicOnlineTopUpFlow = paymentFlow === 'public-online-topup';
  const isAccountAddPaymentFlow = paymentFlow === 'account-add-payment';

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  const [feedbackTitle, setFeedbackTitle] = useState({});
  const [feedbackDesc1, setFeedbackDesc1] = useState({});
  const [feedbackButton, setFeedbackButton] = useState({});
  const [feedbackLink, setFeedbackLink] = useState(null);

  const { globalPageTitle, globalSuccessPageTitle, globalErrorPageTitle } = getGlobalMetaTitles();

  // Helper to announce title and persist it via Meta component
  const announceAndSetPageTitle = useCallback(
    (title) => {
      announceTitle(title);
      setPageTitle(title);
    },
    [announceTitle]
  );

  // State from payment result
  const [storedAmount, setStoredAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [lookupKey, setLookupKey] = useState(null);
  const [completed, setCompleted] = useState(null);
  const [state, setState] = useState(null);
  // Flow-specific data (only for topup flows)
  const [topupType, setTopupType] = useState(null);
  const [topupChargeTo, setTopupChargeTo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  // Polling hook
  const { status, result, setEnablePolling } = usePaymentPolling(lookupKey, {});

  const updateFeedbackContent = useCallback(
    (type, amount, chargeTo, phoneNum, success, method) => {
      let title = '';
      let desc1 = '';
      let button = '';
      let link = null;

      let displayAmount = amount ? amount.toString().replace('.', ',') : '';
      if (amount === 'tariff' && tariffPriceDetails?.tariffPrice) {
        displayAmount = tariffPriceDetails.tariffPrice;
      }
      // Fallback: try to get tariff price from sessionStorage if context is empty (after redirect)
      if (amount === 'tariff' && !displayAmount) {
        try {
          const storedTariff = sessionStorage.getItem('mps_activation_tariff');
          if (storedTariff) {
            const tariff = JSON.parse(storedTariff);
            displayAmount = tariff.tariffPrice || '';
            // console.log(
            //   '[PaymentCallbackHandler] Retrieved tariffPrice from sessionStorage:',
            //   displayAmount
            // );
          }
        } catch (err) {
          // console.error('[PaymentCallbackHandler] Failed to retrieve tariff from sessionStorage');
        }
      }

      if (isPublicOnlineTopUpFlow) {
        // PUBLIC ONLINE TOPUP FLOW (aufladen de) - simplified, no auto/direct/self/other distinctions
        if (success) {
          title = tA11yTranslate('nc_aufladen_de_feedback_suc_hdl1');
          desc1 = tA11yTranslate('nc_aufladen_de_feedback_suc_txt1');
          button = tA11yTranslate('nc_aufladen_de_feedback_suc_btn1');
          title = replaceDynamicCmsContent(title, '{amount}', displayAmount);
          title = replaceDynamicCmsContent(title, '{number}', phoneNum);
        } else {
          title = tA11yTranslate('nc_aufladen_de_feedback_err_hdl1');
          desc1 = tA11yTranslate('nc_aufladen_de_feedback_err_txt1');
          button = tA11yTranslate('nc_aufladen_de_feedback_err_btn1');
        }
      } else if (isAccountAddPaymentFlow) {
        // ACCOUNT ADD PAYMENT FLOW (storing payment method for recurring charges)
        if (success) {
          title = tA11yTranslate('nc_account_pymnt_mthd_feedback_suc_hdl1');
          desc1 = tA11yTranslate('nc_account_pymnt_mthd_feedback_suc_txt1');
          button = tA11yTranslate('nc_global_pymnt_mthd_feedback_suc_btn1');
        } else {
          title = tA11yTranslate('nc_account_pymnt_mthd_feedback_err_hdl1');
          desc1 = tA11yTranslate('nc_account_pymnt_mthd_feedback_err_txt1');
          button = tA11yTranslate('nc_global_pymnt_mthd_feedback_suc_btn1');
        }
      } else if (isActivationFlow) {
        // ACTIVATION FLOW - use registration auto-topup strings
        if (success) {
          title = tA11yTranslate('nc_reg_autotopup_feedback_suc_hdl1');
          desc1 = tA11yTranslate('nc_reg_autotopup_feedback_suc_txt1');
          button = tA11yTranslate('nc_reg_autotopup_feedback_suc_btn1');
          title = replaceDynamicCmsContent(title, '{amount}', displayAmount);
        } else {
          title = tA11yTranslate('nc_reg_autotopup_feedback_err_hdl1');
          desc1 = tA11yTranslate('nc_reg_autotopup_feedback_err_txt1');
          button = tA11yTranslate('nc_reg_autotopup_feedback_err_btn1');
        }
      } else if (success) {
        // TOPUP FLOW - SUCCESS case
        if (type === appTopUpType.AUTOMATIC) {
          title = tA11yTranslate('nc_global_autotopup_feedback_suc_hdl1');
          desc1 = tA11yTranslate('nc_global_autotopup_feedback_suc_txt1');
          button = tA11yTranslate('nc_global_topup_feedback_suc_btn1');
          title = replaceDynamicCmsContent(title, '{amount}', displayAmount);
          desc1 = replaceDynamicCmsContent(desc1, '{amount}', displayAmount);
          const displayMethodName = method
            ? appMpsPaymentMethodType.find((m) => m.methodMapping === method)?.apiValue || method
            : '';
          desc1 = replaceDynamicCmsContent(desc1, '{paymentmethod}', displayMethodName);
        } else if (type === appTopUpType.DIRECT) {
          if (chargeTo === appTopUpTo.SELF) {
            title = tA11yTranslate('nc_top_up_sngl_feedback_selfnumber_suc_hdl1');
            desc1 = tA11yTranslate('nc_top_up_sngl_feedback_selfnumber_suc_txt1');
            button = tA11yTranslate('nc_top_up_sngl_feedback_selfnumber_suc_btn1');
            link = tA11yTranslate('nc_top_up_sngl_feedback_selfnumber_suc_lnk1');
            title = replaceDynamicCmsContent(title, '{amount}', displayAmount);
          } else if (chargeTo === appTopUpTo.OTHER) {
            title = tA11yTranslate('nc_top_up_sngl_feedback_othernumber_suc_hdl1');
            desc1 = tA11yTranslate('nc_top_up_sngl_feedback_othernumber_suc_txt1');
            button = tA11yTranslate('nc_global_topup_feedback_suc_btn1');
            title = replaceDynamicCmsContent(title, '{amount}', displayAmount);
            title = replaceDynamicCmsContent(title, '{phonenumber}', phoneNum);
          }
        }
      } else if (type === appTopUpType.AUTOMATIC) {
        // TOPUP FLOW - ERROR - AUTOMATIC
        title = tA11yTranslate('nc_top_up_autotopup_feedback_err_hdl1');
        desc1 = tA11yTranslate('nc_global_topup_feedback_err_txt1');
        button = tA11yTranslate('nc_global_topup_feedback_err_btn1');
      } else if (type === appTopUpType.DIRECT) {
        // TOPUP FLOW - ERROR - DIRECT
        if (chargeTo === appTopUpTo.SELF) {
          title = tA11yTranslate('nc_top_up_sngl_feedback_selfnumber_err_hdl1');
          desc1 = tA11yTranslate('nc_global_topup_feedback_err_txt1');
          button = tA11yTranslate('nc_global_topup_feedback_err_btn1');
        } else if (chargeTo === appTopUpTo.OTHER) {
          title = tA11yTranslate('nc_top_up_sngl_feedback_othernumber_err_hdl1');
          desc1 = tA11yTranslate('nc_global_topup_feedback_err_txt1');
          button = tA11yTranslate('nc_global_topup_feedback_err_btn1');
          title = replaceDynamicCmsContent(title, '{phonenumber}', phoneNum);
        }
      }

      setFeedbackTitle(title);
      setFeedbackDesc1(desc1);
      setFeedbackButton(button);
      setFeedbackLink(link);
    },
    [
      tA11yTranslate,
      isActivationFlow,
      isPublicOnlineTopUpFlow,
      isAccountAddPaymentFlow,
      tariffPriceDetails?.tariffPrice
    ]
  );

  const emptySessionData = async () => {
    try {
      await storage.removeItem(appStorage.TOPUP_AMOUNT);
      await storage.removeItem(appStorage.TOPUP_TYPE);
      await storage.removeItem(appStorage.TOPUP_CHARGE_TO);
    } catch (e) {
      // console.warn('[PaymentCallbackHandler] Failed to clear session data');
    }
  };

  const handleButtonClick = async () => {
    await emptySessionData();

    if (isActivationFlow) {
      // ACTIVATION FLOW
      // CRITICAL: Store lookup_key and payment result to sessionStorage for Step 9 recovery
      if (lookupKey) {
        try {
          // Read from sessionStorage directly instead of state (which might be null)
          const amount = storedAmount || sessionStorage.getItem('mps_payment_amount');
          const method = paymentMethod || sessionStorage.getItem('mps_payment_method');

          const paymentResultToStore = {
            lookup_key: lookupKey,
            paymentStatus: isSuccess ? 'completed' : 'error',
            amount,
            paymentMethod: method
          };
          sessionStorage.setItem('mps_payment_result', JSON.stringify(paymentResultToStore));
          // console.log(
          //   '[PaymentCallbackHandler] 🔴 CRITICAL FOR PAYPAL: Stored lookup_key to sessionStorage:',
          //   paymentResultToStore
          // );
        } catch (err) {
          // console.error('[PaymentCallbackHandler] Failed to store payment result');
        }
      }

      if (isSuccess) {
        // Success: navigate to Step 9
        // console.log('✅ [PaymentCallbackHandler] ACTIVATION - SUCCESSFUL - Navigating to Step 9');
        setCurrentStep(9);
        navigate(appRoute.ACTIVATION);
      } else {
        // Error: also navigate to Step 9 (error handling on that page)
        // console.log('❌ [PaymentCallbackHandler] ACTIVATION - FAILED - Navigating to Step 9');
        setCurrentStep(9);
        navigate(appRoute.ACTIVATION);
      }
    } else if (isPublicOnlineTopUpFlow) {
      // PUBLIC ONLINE TOPUP FLOW (aufladen.de)
      // Simple routing: success → success page, error → back to payment to retry
      if (isSuccess) {
        navigate(appRoute.LANDING_PAGE);
      } else {
        navigate(appRoute.LANDING_PAGE); // NOTE: change from last step back to first step to retry (number page) since amount and payment method are not stored in context for this flow
      }
    } else if (isAccountAddPaymentFlow) {
      // ACCOUNT ADD PAYMENT FLOW (storing payment method for recurring charges)
      // Simple routing: success or error → back to payment methods list
      // console.log('[PaymentCallbackHandler] ACCOUNT ADD PAYMENT - Navigating to Payment Methods');
      navigate(appRoute.ACCOUNT_PAYMENT_METHODS);
    } else {
      // TOPUP FLOW (regular MPS - direct and recurring)
      // Granular routing based on topup type and payment result
      // eslint-disable-next-line no-lonely-if
      if (isSuccess) {
        // console.log('✅ [PaymentCallbackHandler] TOPUP - SUCCESSFUL');
        // Granular routing based on topup type
        if (topupType === appTopUpType.AUTOMATIC) {
          navigate(appRoute.DASHBOARD);
        } else if (topupType === appTopUpType.DIRECT) {
          if (topupChargeTo === appTopUpTo.SELF) {
            navigate(appRoute.MPS_TOPUP_OVERVIEW);
          } else if (topupChargeTo === appTopUpTo.OTHER) {
            navigate(appRoute.DASHBOARD);
          }
        }
      } else {
        // console.log(
        //   '❌ [PaymentCallbackHandler] TOPUP - FAILED - Navigating back to TopUp Payment'
        // );
        navigate(appRoute.MPS_TOPUP_PAYMENT);
      }
    }
  };

  // Initialize - hydrate from query params or context
  useEffect(() => {
    const init = async () => {
      // console.log('[PaymentCallbackHandler INIT] Starting initialization...');

      // Select correct context based on flow type
      let contextData;
      if (isActivationFlow) {
        contextData = mpsActivationTopupPayment; // activation → mpsActivationTopupPayment context
      } else if (isAccountAddPaymentFlow) {
        contextData = accountMpsTopupPaymentMethod; // account-add-payment → accountMpsTopupPaymentMethod context
      } else if (isPublicOnlineTopUpFlow) {
        contextData = publicOnlineTopupPayment; // public-online-topup → publicOnlineTopupPayment context
      } else {
        contextData = mpsTopupPayment; // regular topup → mpsTopupPayment context
      }

      // console.log('[PaymentCallbackHandler INIT] Context paymentMethod:', contextData.paymentMethod);
      // console.log('[PaymentCallbackHandler INIT] Context amount:', contextData.amount);

      // REMOVE // DEBUG: Log which context was selected and what amount it has
      // const getContextType = () => {
      //   if (isActivationFlow) return 'activation';
      //   if (isAccountAddPaymentFlow) return 'account-add-payment';
      //   if (isPublicOnlineTopUpFlow) return 'public-online-topup';
      //   return 'topup';
      // };

      // console.log('[PaymentCallbackHandler DEBUG] Context selection:', {
      //   paymentFlow,
      //   isPublicOnlineTopUpFlow,
      //   selectedContextType: getContextType(),
      //   contextData_amount: contextData?.amount,
      //   contextData_paymentMethod: contextData?.paymentMethod
      // });

      const amount =
        contextData?.amount ||
        (await storage.getItem(appStorage.TOPUP_AMOUNT)) ||
        sessionStorage.getItem('mps_payment_amount');

      // REMOVE // DEBUG: Log final resolved amount
      // console.log('[PaymentCallbackHandler DEBUG] Amount resolution for success page:', {
      //   from_context: contextData?.amount,
      //   from_storage: await storage.getItem(appStorage.TOPUP_AMOUNT),
      //   from_sessionStorage: sessionStorage.getItem('mps_payment_amount'),
      //   final_amount: amount
      // });

      const method =
        contextData?.paymentMethod ||
        (await storage.getItem(appStorage.TOPUP_PAYMENT_METHOD)) ||
        sessionStorage.getItem('mps_payment_method');

      const type = contextData?.type || (await storage.getItem(appStorage.TOPUP_TYPE));
      const chargeTo = contextData?.chargeTo || (await storage.getItem(appStorage.TOPUP_CHARGE_TO));

      let phoneNum =
        publicOnlineTopupPayment?.msisdn ||
        sessionStorage.getItem('mps_payment_msisdn') ||
        mpsActivationTopupPayment.otherNumber ||
        (await storage.getItem(appStorage.ACTIVATION_MSISDN));
      if (!phoneNum && chargeTo === appTopUpTo.OTHER) {
        phoneNum = await storage.getItem(appStorage.TOPUP_OTHER_MSISDN);
      }

      const key = queryParams.get('lookup_key') ?? queryParams.get('lookupKey');
      const completedParam = queryParams.get('completed') ?? queryParams.get('paymentCompleted');
      const stateParam = queryParams.get('state');

      // console.log('[PaymentCallbackHandler] Init - query params:', {
      //   key,
      //   completedParam,
      //   stateParam
      // });
      // console.log('[PaymentCallbackHandler] Init - recovered from storage:', { amount, method });

      // Store topup-specific data for all flows
      setTopupType(type);
      setTopupChargeTo(chargeTo);
      setPhoneNumber(phoneNum);

      // Check if context already has payment result (from immediate submit flow)
      // Use appropriate context based on flow type
      let contextPaymentResult;
      if (isPublicOnlineTopUpFlow) {
        contextPaymentResult = publicOnlineTopupPayment?.paymentResult;
      } else if (isActivationFlow) {
        contextPaymentResult = mpsActivationTopupPayment?.paymentResult;
      } else if (isAccountAddPaymentFlow) {
        contextPaymentResult = accountMpsTopupPaymentMethod?.paymentResult;
      } else {
        contextPaymentResult = mpsTopupPayment?.paymentResult;
      }

      if (contextPaymentResult) {
        // console.log(
        //   '[PaymentCallbackHandler] 📍 PATH: Using CONTEXT - found paymentResult in context'
        // );
        setStoredAmount(amount);
        setPaymentMethod(method);

        // Hydrate from context - get paymentStatus from appropriate context
        let contextDataForResult;
        if (isPublicOnlineTopUpFlow) {
          contextDataForResult = publicOnlineTopupPayment;
        } else if (isActivationFlow) {
          contextDataForResult = mpsActivationTopupPayment;
        } else if (isAccountAddPaymentFlow) {
          contextDataForResult = accountMpsTopupPaymentMethod;
        } else {
          contextDataForResult = mpsTopupPayment;
        }
        const { paymentStatus, lookup_key: contextLookupKey } = contextDataForResult;
        // console.log('[PaymentCallbackHandler] 📊 CONTEXT paymentStatus:', paymentStatus);

        // For context path, lookup_key comes from context, not query params
        const effectiveLookupKey = key || contextLookupKey;
        if (effectiveLookupKey) {
          // console.log('[PaymentCallbackHandler] 🔑 CONTEXT lookup_key:', effectiveLookupKey);
          setLookupKey(effectiveLookupKey);
        }

        // Handle pending status - enable polling
        if (paymentStatus === 'pending') {
          // console.log(
          //   '[PaymentCallbackHandler] ⏳ CONTEXT paymentStatus is PENDING - enabling polling'
          // );
          setIsLoading(true);
          return;
        }

        if (
          paymentStatus === 'completed' ||
          paymentStatus === 'error' ||
          paymentStatus === 'cancelled'
        ) {
          setIsLoading(false);

          // CRITICAL: Mark as completed to prevent polling from starting
          // Credit card payments return result immediately, no polling needed
          setCompleted('true');

          if (paymentStatus === 'completed') {
            setIsSuccess(true);
            updateFeedbackContent(type, amount, chargeTo, phoneNum, true, method);
            announceAndSetPageTitle(`${globalPageTitle} - ${globalSuccessPageTitle}`);
          } else if (paymentStatus === 'error') {
            setIsSuccess(false);
            updateFeedbackContent(type, amount, chargeTo, phoneNum, false, method);
            announceAndSetPageTitle(`${globalPageTitle} - ${globalErrorPageTitle}`);
          } else if (paymentStatus === 'cancelled') {
            // Do nothing (silent)
          }
        }

        return;
      }

      // Fallback: check sessionStorage if context is empty (async state update)
      let hasContextPaymentResult;
      if (isPublicOnlineTopUpFlow) {
        hasContextPaymentResult = publicOnlineTopupPayment?.paymentResult;
      } else if (isActivationFlow) {
        hasContextPaymentResult = mpsActivationTopupPayment?.paymentResult;
      } else if (isAccountAddPaymentFlow) {
        hasContextPaymentResult = accountMpsTopupPaymentMethod?.paymentResult;
      } else {
        hasContextPaymentResult = mpsTopupPayment?.paymentResult;
      }

      if (!hasContextPaymentResult) {
        // console.log(
        //   '[PaymentCallbackHandler] 📍 PATH: Context empty - checking sessionStorage fallback'
        // );
        // console.log('[PaymentCallbackHandler] SessionStorage contents:', {
        //   mps_payment_method: sessionStorage.getItem('mps_payment_method'),
        //   mps_payment_amount: sessionStorage.getItem('mps_payment_amount'),
        //   mps_payment_flow: sessionStorage.getItem('mps_payment_flow')
        // });
        try {
          const storedResult = sessionStorage.getItem('mps_payment_result');
          // console.log(
          //   '[PaymentCallbackHandler] 📦 sessionStorage.mps_payment_result:',
          //   storedResult ? '(data found)' : '(empty)'
          // );
          if (storedResult) {
            const parsed = JSON.parse(storedResult);
            setStoredAmount(parsed.amount);
            setPaymentMethod(parsed.paymentMethod);
            // Only use stored key if no fresh query param key (PayPal returns fresh key in URL)
            if (!key) {
              setLookupKey(parsed.lookup_key);
            }
            // Only set type/chargeTo if they exist (TopUp flows have them, Activation doesn't)
            if (parsed.type) setTopupType(parsed.type);
            if (parsed.chargeTo) setTopupChargeTo(parsed.chargeTo);

            // console.log(
            //   '[PaymentCallbackHandler] Recovered payment result from sessionStorage:',
            //   parsed.paymentStatus
            // );

            // For Activation flows without type/chargeTo, wait for context to provide them
            // Only update feedback if we have the required params (TopUp flow) or isActivationFlow is set
            if (
              parsed.paymentStatus === 'completed' &&
              (parsed.type || isActivationFlow || isAccountAddPaymentFlow)
            ) {
              // console.log('[PaymentCallbackHandler] ✅ FALLBACK SUCCESS - showing success screen');
              setIsSuccess(true);
              setIsLoading(false);
              // Only set completed/state for account-add-payment to prevent unnecessary polling
              if (isAccountAddPaymentFlow) {
                setCompleted('true');
                setState(parsed.state || 'SUCCESS');
              }
              // For Activation, use the type/chargeTo from context (already set from init)
              const feedbackType = parsed.type || topupType;
              const feedbackChargeTo = parsed.chargeTo || topupChargeTo;
              updateFeedbackContent(
                feedbackType,
                parsed.amount,
                feedbackChargeTo,
                phoneNum,
                true,
                parsed.paymentMethod
              );
              announceAndSetPageTitle(`${globalPageTitle} - ${globalSuccessPageTitle}`);
              return;
            }
            if (
              parsed.paymentStatus === 'error' &&
              (parsed.type || isActivationFlow || isAccountAddPaymentFlow)
            ) {
              // console.log('[PaymentCallbackHandler] ❌ FALLBACK ERROR - showing error screen');
              setIsSuccess(false);
              setIsLoading(false);
              // Only set completed/state for account-add-payment to prevent unnecessary polling
              if (isAccountAddPaymentFlow) {
                setCompleted('true');
                setState(parsed.state || 'ERROR');
              }
              const feedbackType = parsed.type || topupType;
              const feedbackChargeTo = parsed.chargeTo || topupChargeTo;
              updateFeedbackContent(
                feedbackType,
                parsed.amount,
                feedbackChargeTo,
                phoneNum,
                false,
                parsed.paymentMethod
              );
              announceAndSetPageTitle(`${globalPageTitle} - ${globalErrorPageTitle}`);
              return;
            }
          }
        } catch (err) {
          // console.error(
          //   '[PaymentCallbackHandler] Failed to recover payment result from sessionStorage:',
          //   err
          // );
        }
      }

      // CRITICAL: Always prefer fresh query param key if available (PayPal returns fresh key in URL)
      // SessionStorage key is stale from previous attempt - only use if no fresh key
      if (!key && completedParam !== 'true') {
        // console.error(
        //   '[PaymentCallbackHandler] Missing lookup_key or completed status in query params - expected for redirect flows (PayPal)'
        // );
        setIsSuccess(false);
        setIsLoading(false);
        updateFeedbackContent(type, amount, chargeTo, phoneNum, false, method);
        return;
      }

      // Store everything - use fresh query param key if available
      setStoredAmount(amount);
      setPaymentMethod(method);
      if (key) {
        setLookupKey(key); // Fresh key from PayPal redirect takes priority
      }
      setCompleted(completedParam);
      setState(stateParam);

      // Don't set isLoading=true yet if we already have completed=true
      // Let the completed=true effect handler take over
      if (completedParam !== 'true') {
        setIsLoading(true);
      }
    };

    init();
  }, []); // Run once on mount to read query params and context

  // Retry feedback content when CMS translations become available (for PayPal redirects)
  // This ensures that even if tA11yTranslate wasn't ready in init, we retry when it loads
  useEffect(() => {
    if (storedAmount && isSuccess !== null) {
      // console.log(
      //   '[PaymentCallbackHandler] CMS/translations loaded - updating feedback with fresh translations'
      // );
      // console.log('[PaymentCallbackHandler] Feedback params:', {
      //   topupType,
      //   storedAmount,
      //   topupChargeTo,
      //   phoneNumber,
      //   isSuccess,
      //   paymentMethod
      // });
      updateFeedbackContent(
        topupType,
        storedAmount,
        topupChargeTo,
        phoneNumber,
        isSuccess,
        paymentMethod
      );
    }
  }, [
    tA11yTranslate,
    tariffPriceDetails?.tariffPrice,
    storedAmount,
    isSuccess,
    topupType,
    topupChargeTo,
    phoneNumber,
    paymentMethod,
    updateFeedbackContent,
    completed
  ]); // Retry when CMS or tariff price loads

  // Handle immediate state from query params (completed=true case) - determine success/error status only
  useEffect(() => {
    if (completed === 'true' && (!isSuccess || isLoading)) {
      // console.log('[PaymentCallbackHandler] Handling completed=true with state:', state);

      // Add small delay to allow CMS/translations to load before calling updateFeedbackContent
      const delayTimer = setTimeout(() => {
        if (state === 'ERROR') {
          // console.log('❌ [PaymentCallbackHandler] ERROR state from query params');
          setIsSuccess(false);
          setIsLoading(false);
          updateFeedbackContent(
            topupType,
            storedAmount,
            topupChargeTo,
            phoneNumber,
            false,
            paymentMethod
          );
          announceAndSetPageTitle(`${globalPageTitle} - ${globalErrorPageTitle}`);
        } else if (state === 'CANCELLED') {
          // console.log('⚠️ [PaymentCallbackHandler] CANCELLED state from query params');
          setIsLoading(false);
        } else {
          // Any other state or undefined → success
          // console.log('✅ [PaymentCallbackHandler] SUCCESS state from query params');
          setIsSuccess(true);
          setIsLoading(false);
          updateFeedbackContent(
            topupType,
            storedAmount,
            topupChargeTo,
            phoneNumber,
            true,
            paymentMethod
          );
          announceAndSetPageTitle(`${globalPageTitle} - ${globalSuccessPageTitle}`);
        }
      }, 50); // Wait 50ms for CMS to load

      return () => clearTimeout(delayTimer);
    }
  }, [
    completed,
    state,
    globalPageTitle,
    globalSuccessPageTitle,
    globalErrorPageTitle,
    announceTitle,
    isSuccess,
    isLoading,
    updateFeedbackContent,
    topupType,
    storedAmount,
    topupChargeTo,
    phoneNumber,
    paymentMethod
  ]);

  // Handle polling result (for when completed=false or state not available)
  useEffect(() => {
    // Wait until everything is ready
    // console.log(
    //   '[PaymentCallbackHandler POLLING] Polling hook status:',
    //   status,
    //   'paymentMethod:',
    //   paymentMethod,
    //   'lookupKey:',
    //   lookupKey
    // );

    // Guard: Only process polling if we have a lookup key and payment is not already completed
    if (!status || !paymentMethod || !lookupKey || completed === 'true') {
      // console.log('[PaymentCallbackHandler POLLING] ⏸️  GUARD BLOCKED - status missing:', !status, 'paymentMethod missing:', !paymentMethod, 'lookupKey missing:', !lookupKey, 'already completed:', completed === 'true');
      return;
    }

    // console.log('[PaymentCallbackHandler POLLING] ✅ Guard passed - processing polling result:', {
    //   status,
    //   resultState: result?.state,
    //   lookupKey
    // });

    if (status === 'pending') {
      // console.log('[PaymentCallbackHandler] Payment still pending, polling...');
      setIsLoading(true);
      return;
    }

    if (status === 'error') {
      // console.log('[PaymentCallbackHandler] Polling error status received');

      // Check if it's a backend ERROR state (all flows handle this)
      if (result?.state === 'ERROR') {
        // console.log('❌ [PaymentCallbackHandler] Payment ERROR detected');
        setIsSuccess(false);
        setIsLoading(false);
        updateFeedbackContent(
          topupType,
          storedAmount,
          topupChargeTo,
          phoneNumber,
          false,
          paymentMethod
        );
        announceAndSetPageTitle(`${globalPageTitle} - ${globalErrorPageTitle}`);
      } else if (isAccountAddPaymentFlow) {
        // Handle other validation/network errors only for account-add-payment
        // console.log('[PaymentCallbackHandler] Account-add-payment validation error');
        setIsSuccess(false);
        setIsLoading(false);
        updateFeedbackContent(
          topupType,
          storedAmount,
          topupChargeTo,
          phoneNumber,
          false,
          paymentMethod
        );
        announceAndSetPageTitle(`${globalPageTitle} - ${globalErrorPageTitle}`);
      } else {
        // console.log(
        //   '[PaymentCallbackHandler] Polling error - likely already completed via query params or context'
        // );
      }
      return;
    }

    if (status === 'completed') {
      const resultState = result?.state;
      // console.log('[PaymentCallbackHandler] Payment polling completed with state:', resultState);

      if (resultState === 'CANCELLED') {
        // console.log('⚠️ [PaymentCallbackHandler] Payment CANCELLED by user');
        // User cancelled payment - return to payment method page
        setIsLoading(false);
        // Navigation happens when user clicks button
      } else {
        // Any other state (PROCURED, FINALIZED, PUSHED, etc.) → success
        // console.log('[PaymentCallbackHandler] Payment SUCCESS with state:', resultState);
        setIsSuccess(true);
        setIsLoading(false);
        updateFeedbackContent(
          topupType,
          storedAmount,
          topupChargeTo,
          phoneNumber,
          true,
          paymentMethod
        );
        announceAndSetPageTitle(`${globalPageTitle} - ${globalSuccessPageTitle}`);
      }
    }
  }, [
    status,
    result,
    paymentMethod,
    topupType,
    storedAmount,
    topupChargeTo,
    phoneNumber,
    globalPageTitle,
    globalSuccessPageTitle,
    globalErrorPageTitle,
    announceTitle,
    updateFeedbackContent
  ]);

  // Enable polling if needed (for query param flow)
  // Skip polling if payment is already completed (completed=true)
  useEffect(() => {
    if (lookupKey) {
      // Only enable polling if payment is NOT already marked as completed
      // When completed=true, state should be handled immediately
      if (completed !== 'true') {
        // console.log('[PaymentCallbackHandler] Starting polling for lookup_key:', lookupKey);
        setEnablePolling(true);
      } else {
        // console.log(
        //   '[PaymentCallbackHandler] Skipping polling - payment already completed with state:',
        //   state
        // );
      }
    }
  }, [lookupKey, completed, state, setEnablePolling]);

  // Ensure page title persists by directly updating document.title
  useEffect(() => {
    if (pageTitle) {
      document.title = pageTitle;
    }
  }, [pageTitle]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollToTop>
      <Meta title={pageTitle} key={`payment-result-${pageTitle}`} />
      <div className="min-dvh-100 d-flex flex-column justify-content-center">
        <AppPageContentWrapper>
          <div className="text-center mt-32">
            <Icons className="mb-8" name={isSuccess ? 'happycolor' : 'sad'} colorType="dark" />

            <div className="mt-12">
              <Ta11yText textContent={feedbackTitle} tag="h1" className="nc-doomsday-h3 m-0" />
            </div>
            <div className="mt-4">
              <Ta11yText textContent={feedbackDesc1} tag="p" className="text-gray-800" />
            </div>

            {!isSuccess && (
              <div className="mt-8">
                <ErrorSupportBox />
              </div>
            )}

            <div className="mt-16">
              <ButtonPrimary
                buttonType={appButtonTypes.PRIMARY.DEFAULT}
                buttonContent={feedbackButton}
                onClick={handleButtonClick}
              />
            </div>
            
            {feedbackLink && (
              <div className="mt-6 text-center">
                <Link
                  linkStyle={appLinkStyle.PRIMARY}
                  onClick={() => navigate(appRoute.DASHBOARD)}>
                  <Ta11yText textContent={feedbackLink} tag="span" />
                </Link>
              </div>
            )}
          </div>
        </AppPageContentWrapper>
      </div>
      {isPublicOnlineTopUpFlow && <FooterMain />}
    </ScrollToTop>
  );
}

export default PaymentCallbackHandler;
