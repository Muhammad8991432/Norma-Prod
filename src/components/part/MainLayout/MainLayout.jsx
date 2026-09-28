import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  NavigationHeader,
  FooterMain,
  LoadingScreen,
  SplashScreen,
  ApiErrorScreen
} from '@core/index';
import { useLayout, useLoader } from '@context/Utils';

export function MainLayout({ showChildren = false, children }) {
  const { loader } = useLoader();
  const { isLoading, showHeader, showFooter, isStaticContentLoaded } = useLayout();

  useEffect(() => {
    const root = document.getElementById('root');
    if (!isLoading && root?.hasAttribute('aria-hidden')) {
      root.removeAttribute('aria-hidden');
    }
  }, [isLoading]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isLoading && !isStaticContentLoaded) {
    return <ApiErrorScreen />;
  }

  return (
    <>
      <div className="bg-mint-40 overflow-x-hidden">
        <div className="min-dvh-100">
          {showHeader && <NavigationHeader />}
          {loader && <LoadingScreen />}
          <main>
            <Outlet />
            {showChildren && children}
          </main>
        </div>
        {showFooter && <FooterMain />}
      </div>
    </>
  );
}

export default MainLayout;
