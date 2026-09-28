/* eslint-disable no-console */
import { createContext, useMemo, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// A context to load all app configuration from server
const LoaderContext = createContext();

// The top level component that will wrap our app's core features
export const LoaderProvider = function ({ children }) {
  const [loader, setLoader] = useState(false);

  // Render the children as normal
  const renderContent = () => children;

  function showLoader() {
    setLoader(true);
  }

  function hideLoader() {
    setLoader(false);
  }

  // We wrap it in a useMemo for performance reasons.
  const contextPayload = useMemo(
    () => ({ loader, setLoader, showLoader, hideLoader }),
    [loader, setLoader, showLoader, hideLoader]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <LoaderContext.Provider value={contextPayload}>{renderContent()}</LoaderContext.Provider>;
};

LoaderProvider.propTypes = {
  children: PropTypes.node
};

// LoaderProvider.defaultProps = {
//   children: null
// };

// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useLoader = () => useContext(LoaderContext);

export default LoaderProvider;
