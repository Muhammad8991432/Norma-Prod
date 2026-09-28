import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StatusCodes } from '@config/AppConfig';
import { getErrorMessageBody } from '@utils/apiConstants';
import paymentService from '@services/payment';

const StaticContentContext = createContext(null);

export function StaticContentProvider({ children }) {
  // State
  const [campaignContentData, setCampaignContentData] = useState();
  const [isCampaignContentLoadedAfterLogin, setIsCampaignContentLoadedAfterLogin] = useState(false);
  const [faqStaticData, setFaqStaticData] = useState();
  const [keyValuePair, setKeyValuePair] = useState();
  const [mediaPdf, setMediaPdf] = useState();
  const [staticContentData, setStaticContentData] = useState();
  const [articleData, setArticleData] = useState();
  const [mediaImage, setMediaImage] = useState();

  // Functions

  /**
   * Perform this to get the Campaign Content of the APP
   * @param {boolean} isPostLogin - Flag indicating if this is called after login (to set the ready flag)
   * @returns API Response
   */
  const onCampaignContentCall = async (isPostLogin = false) => {
    try {
      const response = await paymentService.getCampaignData();
      if (response && response.data) {
        const campaignData = response.data;

        setCampaignContentData(campaignData);

        // Set the flag to indicate post-login campaign content is loaded
        if (isPostLogin) {
          setIsCampaignContentLoadedAfterLogin(true);
        }
      }
      return {
        success: true,
        status: StatusCodes.OK,
        data: response.data
      };
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      throw {
        success: false,
        status:
          error?.data?.status ||
          error?.status ||
          error?.response?.status ||
          StatusCodes.NOT_ACCEPTABLE,
        data: [],
        error: [
          {
            // changed message body extraction to a separate function to avoid code duplication
            messageBody: getErrorMessageBody(error)
          }
        ]
      };
    }
  };

  /**
   * Perform this to get the Static-Content of the APP
   * @returns API Response
   */
  const onStaticContentCall = async () => {
    try {
      const response = await paymentService.getStaticContentSiteSettings();
      if (response && response.data) {
        const staticData = response.data;

        setStaticContentData(staticData);
        if (staticData.faq) {
          setFaqStaticData(staticData.faq);
        }
        if (staticData.articles) {
          setArticleData(staticData.articles);
        }
        if (staticData.media_pdf) {
          setMediaPdf(staticData.media_pdf);
        }
        if (staticData.media_image) {
          setMediaImage(staticData.media_image);
        }
      }
      return {
        success: true,
        status: StatusCodes.OK,
        data: response.data
      };
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      throw {
        success: false,
        status:
          error?.data?.status ||
          error?.status ||
          error?.response?.status ||
          StatusCodes.NOT_ACCEPTABLE,
        data: [],
        error: [
          {
            // changed message body extraction to a separate function to avoid code duplication
            messageBody: getErrorMessageBody(error)
          }
        ]
      };
    }
  };

  /**
   * Perform this to get the Static-Content of the APP
   * @returns API Response
   */
  const onStaticKeyValuePairCall = async (params) => {
    try {
      const response = await paymentService.getStaticContentKeyValuePairs(params);
      if (response && response.data) {
        const keyValuePairData = response.data.data.app_content;

        setKeyValuePair(keyValuePairData);
      }
      return {
        success: true,
        status: StatusCodes.OK,
        data: response.data
      };
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      throw {
        success: false,
        status:
          error?.data?.status ||
          error?.status ||
          error?.response?.status ||
          StatusCodes.NOT_ACCEPTABLE,
        data: [],
        error: [
          {
            // changed message body extraction to a separate function to avoid code duplication
            messageBody: getErrorMessageBody(error)
          }
        ]
      };
    }
  };

  // handle static language key value pair
  const t = (key) => {
    const staticApiData = keyValuePair;
    let languageString = '';

    if (staticApiData) {
      if (staticApiData[key] !== undefined && staticApiData[key].content !== undefined) {
        languageString = staticApiData[key].content.replace(/\\n/g, '\n');
        return languageString;
      }
      return key;
    }
    return key;
  };

  // handle static language key value pair for bfsg
  const getStaticContentValue = (key) => {
    const staticApiData = keyValuePair;
    let languageObject = { content: '', type: '' };

    if (staticApiData) {
      if (staticApiData[key] !== undefined && Object.keys(staticApiData[key]).length > 0) {
        languageObject = staticApiData[key];
        return languageObject;
      }
      return { content: key, type: 'text' };
    }
    return { content: key, type: 'text' };
  };

  const getPdfDetails = (id) => mediaPdf.find((pdf) => Number(pdf.id) === Number(id));

  const getPdfList = (staticContentKey) =>
    (staticContentData[staticContentKey] || []).map((listItem) => ({
      ...listItem,
      listContent: (listItem.listContent || []).map((listContentItem) => ({
        ...(Number(listContentItem.id) > 0 ? getPdfDetails(listContentItem.id) : {}),
        ...listContentItem
      }))
    }));

  const value = useMemo(
    () => ({
      // State
      campaignContentData,
      isCampaignContentLoadedAfterLogin,
      mediaPdf,
      faqStaticData,
      keyValuePair,
      setKeyValuePair,
      staticContentData,
      articleData,
      mediaImage,

      mpsPaymentAmounts: staticContentData?.mpsPaymentAmounts?.staticAmounts || [],

      // Functions
      onCampaignContentCall,
      onStaticContentCall,
      onStaticKeyValuePairCall,
      t,
      getStaticContentValue,
      getPdfDetails,
      getPdfList
    }),
    [
      // State
      campaignContentData,
      isCampaignContentLoadedAfterLogin,
      mediaPdf,
      faqStaticData,
      keyValuePair,
      setKeyValuePair,
      staticContentData,
      articleData,
      mediaImage,

      // Functions
      onCampaignContentCall,
      onStaticContentCall,
      onStaticKeyValuePairCall,
      t,
      getStaticContentValue,
      getPdfDetails,
      getPdfList
    ]
  );

  return <StaticContentContext.Provider value={value}>{children}</StaticContentContext.Provider>;
}

StaticContentProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Hook to access StaticContent context
 * @returns {Object} StaticContent context value
 */
export function useStaticContent() {
  const context = useContext(StaticContentContext);
  if (!context) {
    throw new Error('useStaticContent must be used within StaticContentProvider');
  }
  return context;
}

export default StaticContentProvider;
