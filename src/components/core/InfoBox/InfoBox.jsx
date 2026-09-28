import React from 'react';
import Icons from '@core/Utils/Icons/Icons';
import { appInfoBoxType } from '@utils/globalConstant';
import { sanitizeRichText } from '@utils/sanitizeHtml';
import './InfoBox.scss';

// REFACTOR: use Ta11yText component

// NOTE: pass Icons colorType prop if light icons are also needed (used for high contrast mode)

export function InfoBox({
  label,
  ariaLabel,
  rightIcon,
  leftIcon,
  type = appInfoBoxType.DARK,
  onInfoClick,
  isClickable = true,
  isLink = false,
  customClass = '',
  bgColor = ''
}) {
  const commonClasses = `${customClass} d-flex align-items-center px-3 py-2 ${type} infobox-arrow btn-reset-default-style`;
  return isClickable ? (
    <button
      onClick={onInfoClick}
      aria-label={ariaLabel}
      className={commonClasses}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      type="button"
      role={isLink ? 'link' : undefined}>
      <div className="btn-reset-default-style">
        {leftIcon && (
          <Icons
            className="info-support-icon"
            name={leftIcon}
            height={24}
            width={24}
            colorType="dark"
          />
        )}
      </div>
      <div className="px-3 flex-grow-1">
        {label && (
          <div className="info-label text-start" dangerouslySetInnerHTML={{ __html: sanitizeRichText(label) }} />
        )}
      </div>
      <div>
        {rightIcon && (
          <Icons className="info-icon" name={rightIcon} height={24} width={24} colorType="dark" />
        )}
      </div>
    </button>
  ) : (
    <div className={commonClasses} style={{ cursor: 'default' }}>
      <div className="btn-reset-default-style" style={{ cursor: 'default' }}>
        {leftIcon && (
          <Icons
            className="info-support-icon"
            name={leftIcon}
            height={24}
            width={24}
            colorType="dark"
          />
        )}
      </div>
      <div className="px-3 flex-grow-1">
        {label && (
          <div className="info-label text-start" dangerouslySetInnerHTML={{ __html: sanitizeRichText(label) }} />
        )}
      </div>
      <div className="btn-reset-default-style" style={{ cursor: 'default' }}>
        {rightIcon && (
          <Icons className="info-icon" name={rightIcon} height={24} width={24} colorType="dark" />
        )}
      </div>
    </div>
  );
}

export default InfoBox;
