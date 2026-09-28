import React from 'react';
import Icons from '@core/Utils/Icons/Icons';
import { Ta11yText } from '@core/index';
import { tA11y } from '@utils/a11y/a11yHelpers';

export const NavigationTextIcon = ({ leftIcon, text, rightIcon, customClass, hedingTag = 'span' }) => {
  const defaultIconSize = 24;
  return (
    <div
      className={`${customClass} d-flex align-items-center`}
      style={{ cursor: 'pointer', paddingTop: '11px', paddingBottom: '11px' }}>
      {leftIcon && (
        <div className="icon-left pe-3">
          <Icons
            name={leftIcon.name}
            height={leftIcon.height || defaultIconSize}
            width={leftIcon.width || defaultIconSize}
            colorType="dark" // NOTE: pass colorType prop (used for high contrast mode) if light icons are needed
          />
        </div>
      )}
      <div className="flex-grow-1 text-start">
        <Ta11yText
          textContent={tA11y(text)}
          tag={hedingTag}
          className="m-0 nc-doomsday-h4 text-primary"
        />
      </div>
      {rightIcon && (
        <div className="icon-right ps-3">
          <Icons
            name={rightIcon.name}
            height={rightIcon.height || defaultIconSize}
            width={rightIcon.width || defaultIconSize}
            colorType="dark" // NOTE: pass colorType prop (used for high contrast mode) if light icons are needed
          />
        </div>
      )}
    </div>
  );
};

export default NavigationTextIcon;
