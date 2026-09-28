import { createContext, useMemo, useContext, useState } from 'react';
import PropTypes from 'prop-types';
// CLEANUP: after testing
// import { appAlert } from '@utils/globalConstant';

// A context to load all app configuration from server
const AlertContext = createContext();

// The top level component that will wrap our app's core features
export const AlertProvider = function ({ children }) {
  // CLEANUP: after testing
  // const [alert, setAlert] = useState({});

  // For showing generic error screen only
  const [isGenericError, setIsGenericError] = useState(false);

  // CLEANUP: after testing
  // const showAlert = (al) => {
  //   if (Object.keys(al).length > 0) {
  //     const newAlerts = { type: al?.type || appAlert.ERROR, message: al?.message };
  //     setAlert(newAlerts);
  //   }
  // };

  // We wrap it in a useMemo for performance reasons.
  const contextPayload = useMemo(
    () => ({
      // CLEANUP: after testing
      // alert,
      // setAlert,
      // showAlert,
      isGenericError,
      setIsGenericError
    }),
    // CLEANUP: after testing
    // [alert, setAlert, showAlert, isGenericError, setIsGenericError]
    [isGenericError, setIsGenericError]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <AlertContext.Provider value={contextPayload}>{children}</AlertContext.Provider>;
};

AlertProvider.propTypes = {
  children: PropTypes.node
};

export default AlertProvider;

// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useAlert = () => useContext(AlertContext);
