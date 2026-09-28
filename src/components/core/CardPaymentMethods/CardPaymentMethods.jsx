/* eslint-disable no-nested-ternary */
import React from 'react';
import { useA11y } from '@context/Utils';
import Icons from '@core/Utils/Icons/Icons';
import { ButtonRadio, Ta11yText } from '@core/index';
import { PaymentLogo } from '../PaymentLogo';
import './CardPaymentMethods.scss';

export const METHOD_LOGO = {
  paypal: 'iconPaypal',
  creditcard: 'iconCard',
  'google-pay': 'iconGooglePay',
  'apple-pay': 'iconApplePay'
};

export const CREDITCARD_LOGO = {
  visa: 'iconVisa',
  amex: 'iconAmex',
  sepa: 'iconSepa',
  Master: 'iconMastercard',
  'visa/master': 'creditcard'
};

export function CardPaymentMethods({
  method = 'creditcard',
  creditCardOption = 'visa',
  title = '',
  subtitle = '',
  date = '',
  isActive = false,
  isWarning = false,
  isError = false,
  isRadio = false,
  rightIcon = '',
  radioName = 'payment-method',
  radioId = '',
  checked = false,
  onRadioChange = () => {},
  onClick,
  logoIcon,
  className = ''
}) {
  const { tA11yTranslate } = useA11y();

  const activeLabelKey = 'nc_info_active';
  const warningLabelKey = 'nc_info_caution';
  const errorLabelKey = 'nc_info_error';

  const hasRightPill = isActive || isWarning || isError;
  const pillConfig = {
    'active': {
      'labelKey': activeLabelKey,
      'iconName': 'checkcircle',
      'textClassName': 'text-white',
      'bgClassName': 'bg-mint-100'
    },
    'warning': {
      'labelKey': warningLabelKey,
      'iconName': 'warninggray100',
      'textClassName': 'text-gray-100',
      'bgClassName': 'bg-yellow-100'
    },
    'error': {
      'labelKey': errorLabelKey,
      'iconName': 'erroroctagonwhite',
      'textClassName': 'text-white',
      'bgClassName': 'bg-red'
    }
  };
  // error has highest priority, then warning, then active
  const currentPillConfig = isError
    ? pillConfig.error
    : isWarning
      ? pillConfig.warning
      : isActive
        ? pillConfig.active
        : null;

  const isCreditCard = method === 'creditcard';

  const resolvedLogo =
    logoIcon ||
    (isCreditCard ? CREDITCARD_LOGO[creditCardOption] || METHOD_LOGO.creditcard : METHOD_LOGO[method] || METHOD_LOGO.creditcard);
  const safeRadioId = radioId || `payment-${method}-${creditCardOption}-${radioName}`;

  const subtitleMain = subtitle;
  const subtitleDate = date;

  const ariaLabel = [title, subtitleMain, subtitleDate].filter(Boolean).join(', ');

  const handleCardClick = (e) => {
    if (onClick) onClick(e);
  };

  const cardContent = (
    <div className="card-payment-methods__content d-flex align-items-center gap-3">
      <PaymentLogo
        icon={resolvedLogo}
        bgClassName={method === "paypal" ? "bg-warning rounded p-2" : "payment-logo-bg"}
        width={48}
        height={32}
        ariaLabel={title || resolvedLogo}
        className="card-payment-methods__logo flex-shrink-0"
      />
      <div className="flex-grow-1 min-w-0 text-start">
        <Ta11yText textContent={tA11yTranslate(title)} tag="p" className="nc-doomsday-h5 mb-1 text-dark" />
        {subtitleMain && (
          <Ta11yText
            textContent={tA11yTranslate(subtitleMain)}
            tag="p"
            className="nc-realtextpro-fillin text-gray-100 mb-0 small"
          />
        )}
        {subtitleDate && (
          <Ta11yText
            textContent={tA11yTranslate(subtitleDate)}
            tag="p"
            className="nc-realtextpro-fillin text-gray-100 mb-0 small"
          />
        )}
      </div>
      <div className="d-inline-flex align-items-center gap-2 flex-shrink-0">
        {(hasRightPill && currentPillConfig !== null) && (
          <span className={`d-flex align-items-center gap-1 ${currentPillConfig.bgClassName} ${currentPillConfig.textClassName} py-2 px-2 rounded-pill pill-content`}>
            <Icons name={currentPillConfig.iconName} width={16} height={16} alt="" aria-hidden="true" />
            <Ta11yText textContent={tA11yTranslate(currentPillConfig.labelKey)} tag="span" />
          </span>
        )}
        {isRadio ? (
          <ButtonRadio
            id={safeRadioId}
            name={radioName}
            value={checked}
            onChange={(val) => onRadioChange(val)}
            noLabel
            radioContent={title}
            aria-label={`${title}, auswählen`}
          />
        ) : rightIcon ? (
          <span className="d-inline-flex align-items-center" aria-hidden="true">
            <Icons name={rightIcon} width={24} height={24} alt="" />
          </span>
        ) : <></>}
      </div>
    </div>
  );

  const cardClassName =
    'card-payment-methods card shadow-mps rounded border-0 bg-white overflow-visible pt-4 pb-3 px-3 d-block w-100 text-start btn-reset-default-style text-decoration-none';

  return (
    <div className={`position-relative ${className}`}>
      {isRadio ? (
        <label
          htmlFor={safeRadioId}
          className={cardClassName}
          aria-label={ariaLabel}
          onClick={onClick ? (e) => onClick(e) : undefined}
        >
          {cardContent}
        </label>
      ) : (
        <button
          type="button"
          className={cardClassName}
          onClick={handleCardClick}
          aria-label={ariaLabel}
        >
          {cardContent}
        </button>
      )}
    </div>
  );
}

export default CardPaymentMethods;
 