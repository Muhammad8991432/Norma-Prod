import React from 'react';
import { useActivation } from '@context/MobileOne';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { appLinkStyle } from '@utils/globalConstant';
import { Ta11yText, Link } from '@core/index';

// This button is reused in multiple pages and always has the same cms key
export const ButtonCancelActivation = () => {
  const { setCurrentStep, currentStep } = useActivation();

  const handleCancelClick = () => {
    // store last valid step in local storage
    localStorage.setItem('lastStep', currentStep);
    // redirect to -5 step (cancellation page)
    setCurrentStep(-5);
  };

  return (
    <>
      <Link
        onClick={handleCancelClick}
        linkStyle={`${appLinkStyle.PRIMARY}`}
        iconLeft="closecolor"
        iconColorType="dark">
        <Ta11yText textContent={tA11y('nc_reg_cncl_lnk1')} tag="span" />
      </Link>
    </>
  );
};

export default ButtonCancelActivation;
