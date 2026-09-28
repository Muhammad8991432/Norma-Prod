/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useA11y } from '@context/Utils/A11y';
import Icons from '@core/Utils/Icons/Icons';
import { appInfoBoxType, appLinkStyle } from '@utils/globalConstant';
import './InfoSnackbar.scss';
import { Ta11yText } from '@core/Ta11yText';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { Link } from '@core/Link';

// Infobox for API errors

export const InfoSnackbar = ({
  title = '',
  message,
  leftIcon = 'errorwhite',
  closeIcon,
  type = appInfoBoxType.ERROR,
  ariaLabel,
  isGenericApiError = true,
  handleAPIErrorLink = () => {}
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const { tA11yTranslate } = useA11y();
  const messageContent = isGenericApiError ? tA11yTranslate('nc_global_generic_api_err') : tA11yTranslate(message);

  const handleCloseClick = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const closeIconAriaLabel = tA11yTranslate('nc_global_icn_close_aria').ariaLabel;

  return (
    <div className="info-snackbar">
      <div className={`p-4 ${type}`}>
        <div id='info-error' role="alert" aria-live='polite' aria-atomic="true">
          <Ta11yText
            tag="p"
            className="info-label text-start mb-3"
            textContent={tA11y('nc_global_api_err_hdl1')}
          />
          <div className="d-flex align-items-center">
            <div className="align-self-center">
              {leftIcon && (
                <Icons className="info-support-icon" name={leftIcon} height={24} width={24} />
              )}
            </div>
            <div className="px-3 align-items-center flex-grow-1">
              <Ta11yText
                tag="p"
                className="info-label text-start"
                textContent={messageContent}
              />
            </div>
            {closeIcon && (
              <button
                type="button"
                className="btn-reset-default-style"
                onClick={handleCloseClick}
                aria-label={closeIconAriaLabel}>
                <Icons name="close" height={18} width={18} />
              </button>
            )}
          </div>
        </div>
        {!isGenericApiError && (
          <div tabIndex={-1}>
            <Link
              id="apiErrorLink"
              linkStyle={`${appLinkStyle.WHITE} mx-9 mt-3`}
              onClick={handleAPIErrorLink}
              type="button">
              <Ta11yText
                tag="p"
                className="info-label text-start"
                textContent={tA11y('nc_global_defined_api_err_lnk')}
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSnackbar;
