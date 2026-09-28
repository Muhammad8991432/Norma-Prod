/* eslint-disable no-nested-ternary */
import React from 'react';
import { appAlert } from '@utils/globalConstant';
import Icons from '@core/Utils/Icons/Icons';
import './InfoNotification.scss';
import { useA11y } from '@context/Utils/A11y';
import { sanitizeRichText } from '@utils/sanitizeHtml';

export const InfoNotification = ({ type = appAlert.DEFAULT, message, position = 'start', isLiveRegion = true }) => {
  const { tA11yTranslate, getStripeHTMLText } = useA11y();
  
  const icon =
    type === appAlert.ERROR || type === appAlert.DANGER
      ? 'error'
      : type === appAlert.SUCCESS
      ? 'success'
      : type === appAlert.DISABLED
      ? ''
      : type === appAlert.WARNING
      ? 'warning'
      : type === appAlert.INFO
      ? 'infoblue'
      : false;

  const textColor =
    type === appAlert.ERROR || type === appAlert.DANGER
      ? 'text-red'
      : type === appAlert.SUCCESS
      ? 'text-success'
      : type === appAlert.WARNING
      ? 'text-warning'
      : type === appAlert.DISABLED
      ? 'text-gray-100'
      : type === appAlert.INFO
      ? 'text-info'
      : 'text-gray-100';
  return (
    <div {...(isLiveRegion ? { role: 'alert', 'aria-live': 'polite' } : {})}>
      <div
        className={`d-flex flex-col align-items-center 
        ${position === 'start' && 'justify-content-start'} 
        ${position === 'center' && 'justify-content-center'}`}>
        {icon ? (
          <div className="pe-2 d-flex flex-col align-items-center justify-content-start">
            <Icons
              className="d-flex flex-col align-items-center justify-content-start py-0 m-0"
              name={icon}              
              width={14}
              height={14}
              colorType="dark"
            />
          </div>
        ) : (
          <div className="icon-placeholder me-2" />
        )}
        <div
        aria-label={type === appAlert.ERROR || type === appAlert.DANGER ? `${icon ? tA11yTranslate('nc_global_pw_not_fulfilled')?.content : ''} ${getStripeHTMLText(message)}` : `${icon ? tA11yTranslate('nc_global_pw_fulfilled')?.content : ''} ${getStripeHTMLText(message)}`}
          className={`info-text-body ${textColor} py-0 m-0 text-start`}
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(message) }}
        />
      </div>
    </div>
  );
};

export default InfoNotification;
