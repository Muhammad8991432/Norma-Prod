import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useStaticContent } from '@context/StaticContent';
import { appStaticContentConfig } from '@utils/globalConstant';

const LayoutContext = createContext();

export const LayoutProvider = function ({ children }) {
  // Constants

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isStaticContentLoaded, setIsStaticContentLoaded] = useState(false);
  const [timerLoader, setTimerLoader] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  const [screenSize, setScreenSize] = useState(
    window && window.innerWidth ? window.innerWidth : 1080
  );

  // Context
  const { onCampaignContentCall, onStaticContentCall, onStaticKeyValuePairCall } = useStaticContent();

  const getCampaignContent = async () => {
    try {
      await onCampaignContentCall();
      return true;
    } catch (error) {
      return false;
    }
  };

  const getStaticContent = async () => {
    try {
      setIsLoading(true);
      await onStaticKeyValuePairCall(JSON.stringify(appStaticContentConfig));
      await onStaticContentCall(); // no params needed for this call in new MPS Content Proxy setup
      // await onStaticContentCall(appStaticContentConfig);
      setIsStaticContentLoaded(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsStaticContentLoaded(false);
    }
  };

  // Hooks
  useEffect(() => {
    getCampaignContent();
    getStaticContent();

    if (window) {
      window.addEventListener('resize', () => {
        setScreenSize(window.innerWidth);
      });
    }
  }, []);

  // We wrap it in a useMemo for performance reasons.
  const contextPayload = useMemo(
    () => ({
      // States
      screenSize,
      isLoading,
      isStaticContentLoaded,
      timerLoader,
      setTimerLoader,
      showHeader,
      setShowHeader,
      showFooter,
      setShowFooter,
      // Functions
      getStaticContent
    }),
    [
      // States
      screenSize,
      isLoading,
      isStaticContentLoaded,
      timerLoader,
      setTimerLoader,
      showHeader,
      setShowHeader,
      showFooter,
      setShowFooter,
      // Functions
      getStaticContent
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <LayoutContext.Provider value={contextPayload}>{children}</LayoutContext.Provider>;
};

LayoutProvider.propTypes = {
  children: PropTypes.node
};

// LayoutProvider.defaultProps = {
//   children: null
// };

export default LayoutProvider;

// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useLayout = () => useContext(LayoutContext);
