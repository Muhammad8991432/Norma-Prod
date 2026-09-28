import React from 'react';
import Icons from '@core/Utils/Icons/Icons';
import { appInfoBoxType } from '@utils/globalConstant';
import './InfoBoxClose.scss';

// NOTE: pass Icons colorType prop if light icons are also needed (used for high contrast mode)

export function InfoBoxClose({
  label,
  ariaLabel,
  rightIcon,
  leftIcon,
  type = appInfoBoxType.DARK,
  onInfoClick,
  isButton = false
}) {
  return (
        isButton ? <button className="btn-reset-default-style w-100" onClick={onInfoClick} aria-label={ariaLabel}>
          <div className={`d-flex px-3 py-2 ${type} infobox-close align-items-center`}>
            <div className="align-self-center">
              {leftIcon && <Icons className="info-support-icon" name={leftIcon} height={24} width={24} colorType="dark" />}
            </div>
            <div className="px-3 flex-grow-1">
              {label && <div className="info-label d-flex align-items-center">{label}</div>}
            </div>
            {rightIcon ? <div className="d-flex align-items-start">
                <Icons className="info-icon" name={rightIcon} height={18} width={18} colorType="dark" />
            </div> : null}
          </div>
        </button> : 
        <div className={`d-flex px-3 py-2 ${type} infobox-close align-items-center`}>
          <div className="align-self-center">
            {leftIcon && <Icons className="info-support-icon" name={leftIcon} height={24} width={24} colorType="dark" />}
          </div>
          <div className="px-3 flex-grow-1">
            {label && <div className="info-label d-flex align-items-center">{label}</div>}
          </div>
          {rightIcon ? <div className="d-flex align-items-start">
            <button className="btn-reset-default-style" onClick={onInfoClick} aria-label={ariaLabel}>
              <Icons className="info-icon" name={rightIcon} height={18} width={18} colorType="dark" />
            </button>
          </div> : null}
        </div>
  );
}

export default InfoBoxClose;
