import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import IconLoader from '@assets/icons/nc-loading-darkgreen.json';
import { useA11y } from '@context/Utils/A11y';
import { Ta11yText } from '@core/Ta11yText';
import { AppPageContentWrapper } from '@part/AppPageContentWrapper';
import './LoadingScreen.scss';

export function LoadingScreen({ text, headerContent, textContent }) {
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

  // Hooks
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, []);

  return (
    <AppPageContentWrapper>
      <div className="text-center">
        {headerContent && (
          <Ta11yText tag="h1" textContent={headerContent} className="nc-doomsday-h3 mb-0" />
        )}
        {text && <Ta11yText tag="h1" text={text} className="nc-doomsday-h3 mb-0" />}
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
        {/* NOTE: Lottie animation, hidden from screen readers */}
        <div
          className="pt-12 screen-loader"
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
        {textContent && (
          <Ta11yText tag="p" textContent={textContent} className="nc-realtextpro-copy mb-0 pt-12" />
        )}
      </div>
    </AppPageContentWrapper>
  );
}

export default LoadingScreen;
