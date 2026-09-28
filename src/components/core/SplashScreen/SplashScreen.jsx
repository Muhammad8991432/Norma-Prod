import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import IconLoader from '@assets/icons/nc-loading-darkgreen.json';
import { useA11y } from '@context/Utils/A11y';
import './SplashScreen.scss';
// import { appImages } from '@utils/globalConstant';

// This loading animation is shown before the static content is loaded
// That's why image and alt/aria attributes are hardcoded
// The same value as in nc_global_loading

export const SplashScreen = () => {
  const { tA11yTranslate } = useA11y();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: IconLoader,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }, []);

  return (
    // <div
    //   role="status"
    //   aria-live="assertive"
    //   aria-label="Ladevorgang"
    //   className="d-flex justify-content-center align-items-center vh-100 bg-mint-40">
    //   <img
    //     style={{ maxWidth: '100%', height: '132.53px' }}
    //     src={appImages.logoYellow}
    //     alt={'Ladevorgang'}
    //   />
    // </div>
    <>
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          margin: '-1px',
          padding: 0,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          border: 0,
        }}
      >
        {loaded ? tA11yTranslate('nc_global_loading').ariaLabel : ''}
      </div>
      <div
        className="d-flex justify-content-center align-items-center vh-100 bg-mint-40 screen-loader"
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
      >
        <Lottie
          options={defaultOptions}
          width={100}
          height={100}
          isClickToPauseDisabled
        />
      </div>
    </>
  );
};

export default SplashScreen;
