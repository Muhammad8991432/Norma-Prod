/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Icons from '@core/Utils/Icons/Icons';
import { appInfoBoxType, appLinkStyle } from '@utils/globalConstant';
import { Link } from '@core/Link';
import { Ta11yText } from '@core/Ta11yText';
import './InfoBoxLink.scss';

export function InfoBoxLink({
  label,
  leftIcon = 'clockgrey',
  type = appInfoBoxType.DARK,
  text,
  // link text and url are separate as the key was created as text CMS key 
  // and not as a link key and app already uses the text key
  linkText,
  linkUrl = '',  // if set treat it as a link, otherwise as a button with functionality
  onLinkClick,
  customClass = ''
}) {
  // Const
  const commonClasses = `${customClass} px-4 py-3 ${type} infobox-arrow`;

  return (
    <div className={commonClasses}>
      <div className="d-flex align-items-center">
        <div className="btn-reset-default-style">
          {leftIcon && (
            <Icons className="info-support-icon" name={leftIcon} height={24} width={24} colorType="dark"  />
          )}
        </div>
        <div className="px-3 flex-grow-1">
          {label && <Ta11yText tag="h2" textContent={label} className="nc-doomsday-h5 text-start m-0" />}
        </div>
      </div>
      <div className="mt-3">
        {text && <Ta11yText tag="p" textContent={text} className="info-label text-start" />}
      </div>
      {linkUrl ? (
        <div className="mt-3 d-flex justify-content-start">
          <Link
            href={linkUrl}
            linkStyle={appLinkStyle.PRIMARY}>
            <Ta11yText textContent={linkText} tag="span" />
          </Link>
        </div>
      ) : (
        <div className="mt-3">
          <button
            type="button"
            className={`btn-reset-default-style nc-link ${appLinkStyle.PRIMARY} nc-link-doomsday border-0 bg-transparent d-inline-block`}
            onClick={onLinkClick}
          >
            <Ta11yText textContent={linkText} tag="span" />
          </button>
        </div>
      )}
    </div>
  );
}

export default InfoBoxLink;
