/**
 * All Context will be merged to child, to clear up app.
 */
import React, { createContext, useEffect, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { AppConfigProvider, useAppConfig } from '@config/AppConfig';
import { AuthManager } from '@dom-digital-online-media/dom-auth-sdk';
import { MoManager } from '@dom-digital-online-media/dom-mo-sdk';

import { A11yProvider, AlertProvider, LayoutProvider, LoaderProvider } from '@context/Utils';
import { MobileOneProvider } from '@context/MobileOne/default';
import { BraintreeProvider } from '@context/Braintree'; // MPS: Braintree SDK lifecycle
import { PaymentProvider } from '@context/Payment'; // MPS: Payment context
import { PublicOnlineTopUpProvider } from '@context/PublicOnlineTopUp'; // Public Online TopUp context
import { PaymentVoucherProvider } from '@context/PaymentVoucher'; // MPS: Payment Voucher context
import { StaticContentProvider } from '@context/StaticContent'; // MPS: New static content context (using new MPS Content Proxy and new campaign endpoint)
import { generateRandomValue, storageKeys } from '@utils/globalConstant';
import { AxiosManager } from './AxiosManager';

// eslint-disable-next-line react/prop-types
export const ContextManagerContext = createContext({});

// eslint-disable-next-line react/prop-types
export function ContextLoader({ config, children }) {
  // Load configuration from server
  // Context
  const { env, loading } = useAppConfig();

  // State
  const [isEnvLoaded, setEnvLoaded] = useState(false);

  const contextPayload = useMemo(() => ({ config: { ...config, env } }), [config]);

  // Hooks

  // Validate environments are loaded correctly and then load children
  useEffect(() => {
    if (!loading && env.REACT_APP_MO_URL && env.REACT_APP_MO_USER_URL) {
      setEnvLoaded(true);
    }
  }, [env, loading]);

  return isEnvLoaded ? (
    <>
      {/* Global App Loader Context Provider */}
      <LoaderProvider>
        {/* Global App Alert Context Provider */}
        <AlertProvider>
          {/* TODO: Config it with proper props handling */}
          <ContextManagerContext.Provider value={contextPayload}>
            <StaticContentProvider
              {...{
                config: { ...config, env }
              }}>
              {/* Global App Accessibility Context Provider */}
              <A11yProvider>
                {/* Global Authentication Context Loader */}
                <AuthManager
                  {...{
                    config: { ...config, env }
                  }}>
                  {/* Global MobileOne Provider */}
                  <MoManager
                    {...{
                      config: { ...config, env }
                    }}>
                    {/* App API Request Manager */}
                    <AxiosManager
                      {...{
                        config: { ...config, env }
                      }}>
                      {/* App MobileOne Context Provider */}
                      <MobileOneProvider
                        {...{
                          config: { ...config, env }
                        }}>
                        {/* Braintree SDK lifecycle provider */}
                        <BraintreeProvider>
                          {/* Payment context provider (MPS, uses BraintreeProvider) */}
                          <PaymentProvider
                            {...{
                            config: { ...config, env: { ...process.env, ...env } }
                            }}>
                            {/* Public Online TopUp Context Provider */}
                            <PublicOnlineTopUpProvider>
                              <PaymentVoucherProvider
                                {...{
                                  config: { ...config, env }
                                }}>
                                {/* Global App Layout Context Provider */}
                                <LayoutProvider>{children}</LayoutProvider>
                              </PaymentVoucherProvider>
                            </PublicOnlineTopUpProvider>
                          </PaymentProvider>
                        </BraintreeProvider>
                      </MobileOneProvider>
                    </AxiosManager>
                  </MoManager>
                </AuthManager>
              </A11yProvider>
            </StaticContentProvider>
          </ContextManagerContext.Provider>
        </AlertProvider>
      </LoaderProvider>
    </>
  ) : (
    <></>
  );
}

// eslint-disable-next-line react/prop-types
export function ContextManager({ children }) {
  // Constants
  // App Stroage & Env Config
  const config = {
    env: {
      REACT_APP_IS_CLIENT_LOGIN: process.env.REACT_APP_IS_CLIENT_LOGIN
    },
    storage: {
      getItem: (key) =>
        new Promise((resolve, reject) => {
          try {
            resolve(sessionStorage.getItem(key));
          } catch (e) {
            reject(e);
          }
        }),
      setItem: (key, value) =>
        new Promise((resolve, reject) => {
          try {
            resolve(sessionStorage.setItem(key, value));
          } catch (e) {
            reject(e);
          }
        }),
      removeItem: (key) =>
        new Promise((resolve, reject) => {
          try {
            resolve(sessionStorage.removeItem(key));
          } catch (e) {
            reject(e);
          }
        }),
      encryptedSetItem: (key, value) =>
        new Promise((resolve, reject) => {
          try {
            resolve(sessionStorage.setItem(key, value));
          } catch (e) {
            reject(e);
          }
        }),
      encryptedGetItem: (key) =>
        new Promise((resolve, reject) => {
          try {
            resolve(sessionStorage.getItem(key));
          } catch (e) {
            reject(e);
          }
        }),
      encryptedRemoveItem: (key) =>
        new Promise((resolve, reject) => {
          try {
            resolve(sessionStorage.removeItem(key));
          } catch (e) {
            reject(e);
          }
        })
    }
  };
  // #50218 - Load a new tag on every refresh
  useEffect(() => {
    async function generateLogTag() {
      const tag = generateRandomValue();
      await config.storage.setItem(storageKeys.X_LOG_TAG, tag);
    }
    generateLogTag();
  }, []);

  return (
    <>
      {/* Global App Context Loader */}
      <AppConfigProvider {...{ config }}>
        <ContextLoader {...{ config }}>{children}</ContextLoader>
      </AppConfigProvider>
    </>
  );
}

export const useConfig = () => useContext(ContextManagerContext);
ContextLoader.propTypes = {
  config: PropTypes.shape({
    env: PropTypes.shape({})
  }).isRequired
};

export default ContextManager;
