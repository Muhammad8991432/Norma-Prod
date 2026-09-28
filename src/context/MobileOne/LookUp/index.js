import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import axios from 'axios';
import { appRegex, formValidation } from '@utils/globalConstant';
import { appAPIUri, appAPIHeaders, HTTP_REQUEST_METHODS, getErrorMessageBody } from '@utils/apiConstants';
import { useA11y } from '@context/Utils';
import { useAppConfig, StatusCodes } from '@config/AppConfig';

export const LookUpContext = createContext({});

export function LookUpContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);

  // Context
  const { tA11yTranslate } = useA11y();
  const { env } = useAppConfig();

  // Validations
  const validationSchemaStep1 = useMemo(() => Yup.object().shape({
    msisdn: formValidation({
      required: tA11yTranslate('nc_aufladen_de_number_err')?.content,
      regex: /^\d{5,20}$/,
      validErrorMessage: tA11yTranslate('nc_aufladen_de_number_err')?.content
    })
  }), [tA11yTranslate]);

  // Functions
  const onCheckMsisdnOfClientCall = async (msisdn) => {
    // request url and axios headers and config
    const url = `${env.REACT_APP_MO_URL}${appAPIUri.MO.LOOKUP.CHECK_MSISDN_OF_CLIENT}?msisdn=${msisdn}`;
    const headers = { ...appAPIHeaders.DEFAULT_BASE_JSON };
    const config = {
      url,
      method: HTTP_REQUEST_METHODS.GET,
      headers,
    };

    // make call
    try {
      const response = await axios(config);
      return {
        "success": true,
        "status": StatusCodes.OK,
        "data": response.data
      };
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      throw { // Error Response for other Error
        "success": false,
        "status": error?.data?.status || error?.status || error?.response?.status || StatusCodes.NOT_ACCEPTABLE,
        "data": [],
        "error": [{
          "messageBody": getErrorMessageBody(error)
        }]
      };
    }
  };

  const checkMsisdnOfClient = async (msisdn) => {
    setIsLoading(true);
    try {
      const { data } = await onCheckMsisdnOfClientCall(msisdn);
      const isQualified = data === true || data === 'true' || data?.success === true || data?.data === true;
      return { success: isQualified };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      validationSchemaStep1,
      checkMsisdnOfClient
    }),
    [isLoading, setIsLoading, validationSchemaStep1] // omitting checkMsisdnOfClient from deps as it's not memoized, but typical practice here
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <LookUpContext.Provider value={contextPayload}>{children}</LookUpContext.Provider>;
}

LookUpContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useLookUp = () => useContext(LookUpContext);

export default LookUpContext;
