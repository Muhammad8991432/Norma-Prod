import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';

import { useAlert } from '@context/Utils';
import { StatusCodes } from '@config/AppConfig';
import { useAuth } from '@dom-digital-online-media/dom-auth-sdk';
import { useStaticContent } from '@context/StaticContent';
import { useMobileOne } from '@dom-digital-online-media/dom-mo-sdk';
import { formValidation, appAlert } from '@utils/globalConstant';

export const PaymentVoucherContext = createContext();

export function PaymentVoucherProvider({ children }) {
  // Context
  const { t } = useStaticContent();
  const { isUserLoggedIn } = useAuth();
  const { onVoucherPaysafe, onVoucherTDM } = useMobileOne();
  const { setIsGenericError } = useAlert();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isVoucherSuccess, setIsVoucherSuccess] = useState(false);
  const [voucherFailedError, setVoucherFailedError] = useState(''); // API Error: Failed to redeem voucher.
  const [voucherCodeForm, setVoucherCodeForm] = useState({ voucherCode: '' });

  // Validation
  const voucherValidations = Yup.object().shape({
    voucherCode: formValidation({
      required: t('nc_global_topup_code_err'),
      regex: /^[0-9]{13,16}$/,
      validErrorMessage: t('nc_global_topup_code_err')
    })
  });

  // Function
  const onLoad = () => {
    // TODO: Exten it with api call to fetch all voucher history.
    // console.log("Requesting");
  };

  const onSubmitTDM1 = async (code) => {
    try {
      const { data, success, status } = await onVoucherPaysafe(code);
      if (success || status === StatusCodes.OK) {
        setVoucherCodeForm('');
      }
    } catch (error) {
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
    }
  };

  const onSubmitTDM2 = async (values) => {
    try {
      setIsLoading(true);
      const { voucherCode } = values;
      const { data, success, status } = await onVoucherTDM(voucherCode);
      if (data || success || status === StatusCodes.OK) {
        setIsVoucherSuccess(true);
        setVoucherFailedError('');
        setVoucherCodeForm('');
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setVoucherFailedError(error?.error?.[0]?.messageBody);

      setIsGenericError(true);
    }
  };


  // Hooks
  useEffect(() => {
    if (isUserLoggedIn) {
      onLoad();
    }
    return () => {
      // setHistory([]);
    };
  }, [isUserLoggedIn]);

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading,
      voucherCodeForm,
      setVoucherCodeForm,
      isVoucherSuccess,
      setIsVoucherSuccess,
      voucherFailedError,
      setVoucherFailedError,

      // Validation
      voucherValidations,

      // Functions
      onLoad,
      // onSubmit,
      onSubmitTDM1,
      onSubmitTDM2
    }),
    [
      // States
      isLoading,
      setIsLoading,
      voucherCodeForm,
      setVoucherCodeForm,
      isVoucherSuccess,
      setIsVoucherSuccess,
      voucherFailedError,
      setVoucherFailedError,

      // Validation
      voucherValidations,

      // Functions
      onLoad,
      // onSubmit,
      onSubmitTDM1,
      onSubmitTDM2
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return (
    <PaymentVoucherContext.Provider value={contextPayload}>{children}</PaymentVoucherContext.Provider>
  );
};

// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const usePaymentVoucher = () => useContext(PaymentVoucherContext);

export default PaymentVoucherProvider;
