/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@dom-digital-online-media/dom-auth-sdk';
import { useAppConfig } from '@config/AppConfig';

import { appRoute, isLocalHost } from '@utils/globalConstant';

export function PrivateRoute({ children }) {
  const { isUserLoggedIn } = useAuth();
  const location = useLocation();

  const APP_PREVIOUS_ROUTE_STORAGE = 'navigateTo';

  if (!isUserLoggedIn) {
    // not logged in so redirect to login page with the return url
    localStorage.setItem(APP_PREVIOUS_ROUTE_STORAGE, location.pathname);
    // return <Navigate to={appRoute.LOGIN} state={{ from: location }} />;
    return <Navigate to={appRoute.LANDING_PAGE} state={{ from: location }} />;
  }

  // authorized so return child components
  return children;
}

export function PublicRoute({ children }) {
  const { isUserLoggedIn } = useAuth();
  const location = useLocation();

  const APP_PREVIOUS_ROUTE_STORAGE = 'navigateTo';

  if (isUserLoggedIn) {
    // logged in so redirect to dashboard page with the return url
    localStorage.setItem(APP_PREVIOUS_ROUTE_STORAGE, location.pathname);
    return <Navigate to={appRoute.DASHBOARD} state={{ from: location }} />;
  }

  // authorized so return child components
  return children;
}

export function TestRoute({ children }) {
  const location = useLocation();
  const { env } = useAppConfig();

  const APP_PREVIOUS_ROUTE_STORAGE = 'navigateTo';

  if (!isLocalHost() && !window.location.hostname.includes(env.REACT_APP_STAGING_SERVER)) {
    // not on localhost or on a DOM staging website, so redirect to not found page with the return url
    localStorage.setItem(APP_PREVIOUS_ROUTE_STORAGE, location.pathname);
    return <Navigate to={appRoute.NOT_FOUND} state={{ from: location }} />;
  }

  // authorized so return child components
  return children;
}

export default PrivateRoute;
