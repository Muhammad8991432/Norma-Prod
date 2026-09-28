/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Icons from '@core/Utils/Icons/Icons';
import { appInfoBoxType, appLinkStyle } from '@utils/globalConstant';
import { Link } from '@core/Link';
import { Ta11yText } from '@core/Ta11yText';
import './InfoBoxSupport.scss';
import { tA11y } from '@utils/a11y/a11yHelpers';

export function InfoBoxSupport({
  label = tA11y('nc_global_help_hdl1'),
  text = tA11y('nc_global_help_txt1'),
  link = tA11y('nc_global_help_lnk1'),
  email = tA11y('nc_global_help_lnk2'),
  leftIcon = 'supportcolor',
  type = appInfoBoxType.DARK,
  ariaLabel,
  customClass
}) {
  // Const
  const commonClasses = `${customClass} px-4 py-3 ${type} infobox-arrow`;

  // States
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (event) => {
    const { keyCode } = event;
    if (keyCode === 13 || keyCode === 32) {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  }

  return (
    <div
      id='infoBoxSupport'
      role="button"
      aria-label={ariaLabel}
      tabIndex={0}
      className={commonClasses}
      aria-expanded={isOpen}
      onKeyDown={handleKeyDown}
      style={{ cursor: 'pointer' }}>
      <div className="d-flex align-items-center" onClick={() => setIsOpen(!isOpen)}>
        <div className="btn-reset-default-style">
          {leftIcon && (
            <Icons className="info-support-icon" name={leftIcon} height={24} width={24} colorType="dark"  />
          )}
        </div>
        <div className="px-3 flex-grow-1">
          {label && <Ta11yText tag='h2' textContent={label} className="nc-doomsday-h5 text-start m-0" />}
        </div>
        <div className="btn-reset-default-style">
          <Icons
            className="info-icon"
            name={isOpen ? 'arrowdowndarkgreen' : 'arrowrightcolor'}
            height={24}
            width={24}
            colorType="dark"
          />
        </div>
      </div>
      <div style={{ cursor: 'default' }} aria-live="polite" aria-atomic="true">
        {isOpen && (
          <>
            <div className="mt-3">
              {text && <Ta11yText tag="p" textContent={text} className="info-label text-start" />}
            </div>
            {link && <div className="mt-3 d-flex justify-content-start">
              <Link
                href={link.url}
                linkStyle={appLinkStyle.PRIMARY}>
                <Ta11yText textContent={link} tag="span" />
              </Link>
            </div>}
            {email && <div className="mt-3 d-flex justify-content-start">
              <Link
                href={email.url}
                linkStyle={appLinkStyle.PRIMARY}>
                <Ta11yText textContent={email} tag="span" />
              </Link>
            </div>}
          </>
        )}
      </div>
    </div>
  );
}

export default InfoBoxSupport;
