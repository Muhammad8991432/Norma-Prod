import React from 'react';
import { Outlet } from 'react-router-dom';

import { useLayout } from '@context/Utils';
// import { useActivation } from '@context/MobileOne';
// import { LoadingScreen } from '@core/LoadingScreen';
// import { NavigationActivationBar } from '@part/NavigationActivationBar';
import { FooterMain, NavigationHeader, SplashScreen } from '@core/index';

export function PublicOnlineTopUpLayout() {
  const { isLoading } = useLayout();
  // const { showActivationHeader } = useActivation();

  if (isLoading) {
    // return <LoadingScreen />;
    return <SplashScreen />;
  }

  return (
    <>
      <div className="bg-mint-40 min-dvh-100 d-flex flex-column">
        <NavigationHeader />
        {/* {showActivationHeader && <NavigationActivationBar />} */}
        <main className="flex-grow-1">
          <Outlet />
        </main>
        
      </div>
      <FooterMain />
    </>
  );
}

export default PublicOnlineTopUpLayout;
