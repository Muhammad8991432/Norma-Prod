/* eslint-disable no-prototype-builtins */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { StatusCodes, appStorage } from '@config/AppConfig';
import { useAuth } from '@dom-digital-online-media/dom-auth-sdk';
import { useA11y } from '@context/Utils';
import { generateRandomValue, storageKeys } from '@utils/globalConstant';

export function AxiosManager({ children, config }) {
  // Global refresh promise handler
  let refreshTokenPromise;

  // Context
  const { setIsGenericApiError } = useA11y();
  const { onTokenExpire, onRegistrationToken, setIsUserLogoutProcessing, isUserLoggedIn } =
    useAuth();
  const { storage } = config;

  // Functions
  // eslint-disable-next-line consistent-return
  const getTempAccessToken = async () => {
    try {
      const {
        data: { access_token: accessToken },
        success
      } = await onRegistrationToken();
      if (success && accessToken) {
        await config.storage.encryptedSetItem(appStorage.AUTH_TOKEN, accessToken);
        return { data: { access_token: accessToken } };
      }
    } catch (error) {
      return { data: { access_token: false } };
    }
  };

  const handleLogout = async () => {
    await storage.encryptedSetItem(appStorage.AUTH_TOKEN, '');
    await storage.encryptedSetItem(appStorage.AUTH_TEMP_TOKEN, '');
    await storage.encryptedSetItem(appStorage.AUTH_REFRESH_TOKEN, '');
    await storage.encryptedSetItem(appStorage.USER_AUTH_DATA, '');
    await storage.encryptedSetItem(appStorage.USER_FORBIDDEN, '');
    setIsUserLogoutProcessing(true);
    window.location.href = '/';
  };

  axios.interceptors.response.use(
    (res) => {
      // Reset the generic API error state on successful response
      setIsGenericApiError(false);  
      return res;
    },
    async (error) => {
      // Check if 'isDefaultMsg' exists in response to handle generic api error
      // for all unhandled errors in ETC One API Proxy and for all other APIs like Alphacomm API
      if (
        !error.response?.data?.hasOwnProperty("isDefaultMsg") &&
        !error.response?.hasOwnProperty("isDefaultMsg") &&
        !error.hasOwnProperty("isDefaultMsg")
      ) {
        setIsGenericApiError(true);
      } else {
        // Check condition if 'isDefaultMsg' exists in response
        // eslint-disable-next-line no-lonely-if
        if (error.response?.data?.isDefaultMsg || error.response?.isDefaultMsg || error.isDefaultMsg)
        {
          setIsGenericApiError(true);
        } else {
          setIsGenericApiError(false);
        }
      }

      // logout user if no tokens (access and refresh) are available in storage
      const token = await storage.encryptedGetItem(appStorage.AUTH_TOKEN);
      const refreshToken = await storage.encryptedGetItem(appStorage.AUTH_REFRESH_TOKEN);
      if (
        (error?.status === StatusCodes.UNAUTHORIZED || error?.status === StatusCodes.FORBIDDEN) &&
        !token &&
        !refreshToken &&
        isUserLoggedIn
      ) {
        // Check for 401 error and retry is true or not
        handleLogout();
      }
      if (
        (error?.response?.status === StatusCodes.UNAUTHORIZED ||
          error?.response?.status === StatusCodes.FORBIDDEN) &&
        !token &&
        !refreshToken &&
        isUserLoggedIn
      ) {
        // Check for 401 error and retry is true or not
        handleLogout();
      }
      // return Promise.reject(error)
      throw error; // Throwing error if again there is an not error related to temp-token
    }
  );

  // #50218 - Use interceptor to inject the custom headers for log tags
  axios.interceptors.request.use(async (request) => {
    let tag = await config.storage.getItem(storageKeys.X_LOG_TAG);
    if (!tag) {
      tag = generateRandomValue();
      await config.storage.setItem(storageKeys.X_LOG_TAG, tag);
    }
    request.headers['X-Log-Tag'] = tag;
    return request;
  });

  // eslint-disable-next-line consistent-return
  const getRefreshAccessToken = async () => {
    try {
      const {
        data: { access_token: accessToken, refresh_token: refreshToken, ...restData },
        success
      } = await onTokenExpire();
      if (success) {
        await config.storage.encryptedSetItem(appStorage.AUTH_TOKEN, accessToken);
        await config.storage.encryptedSetItem(appStorage.AUTH_REFRESH_TOKEN, refreshToken);
        await config.storage.encryptedSetItem(appStorage.USER_AUTH_DATA, JSON.stringify(restData));
        return { data: { access_token: accessToken, refresh_token: refreshToken } };
      }
    } catch (error) {
      return { data: { access_token: false } };
    }
  };

  // Config for axios authorise requests
  // eslint-disable-next-line no-unused-vars
  const axiosConfig = () => {
    // Function that will be called to refresh authorization
    const refreshAuthLogic = async (failedRequest) => {
      try {
        // Fetch temp token or refresh request once received 401;
        refreshTokenPromise =
          (await config.storage.encryptedGetItem(appStorage.AUTH_REFRESH_TOKEN)) &&
          (await config.storage.encryptedGetItem(appStorage.AUTH_TOKEN))
            ? getRefreshAccessToken()
            : getTempAccessToken();

        const {
          data: { access_token: accessToken = false }
        } = await refreshTokenPromise;

        // eslint-disable-next-line no-param-reassign
        failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    };

    // Use interceptor to inject the token to requests
    axios.interceptors.request.use(async (request) => {
      // Fetch token from storage
      const token = await config.storage.encryptedGetItem(appStorage.AUTH_TOKEN);
      if (
        token && (
          request.url.includes(config.env.REACT_APP_MO_URL) ||
          request.url.includes(config.env.REACT_APP_MO_USER_URL) ||
          request.url.includes(config.env.REACT_APP_MPS_PROXY_URL)
        )
      ) {
        // Assign token to request
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    });

    // Instantiate the interceptor (you can chain it as it returns the axios instance)
    createAuthRefreshInterceptor(axios, refreshAuthLogic);
  };

  // axiosConfig();

  return children;
}
