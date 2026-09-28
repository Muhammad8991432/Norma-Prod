import React from 'react';

import { Icons } from '@core/Utils';
import { ButtonPrimary } from '@core/ButtonPrimary';
import { appButtonTypes } from '@utils/globalConstant';

export function VoucherFeedbackSuccess({
  icon,
  heading,
  children,
  buttonLabel,
  onButtonClick = () => {},
  buttonIcon
}) {
  return (
    <div className="row">
      <div className="text-center">
        {icon && <Icons name={icon} />}
        {heading && (
          <h3 className="nc-doomsday-h3 py-8 m-0">{heading}</h3>
        )}
        {children}
        <div className="col-4 m-auto button-div pt-4">
          <ButtonPrimary
            icon={buttonIcon}
            type="button"
            buttonType={appButtonTypes.PRIMARY.DEFAULT}
            label={buttonLabel || 'Button'}
            onClick={onButtonClick}
          />
        </div>
      </div>
    </div>
  );
}

export default VoucherFeedbackSuccess;
