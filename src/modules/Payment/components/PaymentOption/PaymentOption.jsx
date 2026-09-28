import React from 'react';
import PropTypes from 'prop-types';
import { Ta11yImage, ButtonRadio } from '@core/index';
import useCmsImage from '@utils/useCmsImage';
import './PaymentOption.scss';

export function PaymentOption({
  method,
  label,
  iconPath,
  isSelected,
  onSelect,
  radioName = 'payment-method',
  children
}) {
  const radioId = `payment-option-${method}`;

  return (
    <div className={`payment-option mb-3 rounded-3 overflow-hidden shadow-mps ${isSelected ? 'payment-option--selected' : ''}`}>
      <label
        htmlFor={radioId}
        className="payment-option__header d-flex align-items-center gap-3 py-3 px-4 bg-white w-100 btn-reset-default-style text-start text-decoration-none"
        aria-label={`${label}, auswählen`}
      >
        {iconPath && (
          <div className="payment-option__logo payment-logo-bg d-flex align-items-center justify-content-center flex-shrink-0 rounded-2">
            <Ta11yImage imageContent={useCmsImage(iconPath)} className="img-fluid" style={{ maxHeight: 32, maxWidth: 48 }} />
          </div>
        )}
        <span className="flex-grow-1 nc-doomsday-h5 text-dark">{label}</span>
        <div className="flex-shrink-0 d-flex align-items-center">
          <ButtonRadio
            id={radioId}
            name={radioName}
            value={isSelected}
            onChange={() => onSelect(method)}
            noLabel
            radioContent={label}
            aria-label={`${label}, auswählen`} // TODO: remove hardcoded txt
          />
        </div>
      </label>
      {isSelected && children && (
        <div className="payment-option__accordion px-4 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

PaymentOption.propTypes = {
  method: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  iconPath: PropTypes.string,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  radioName: PropTypes.string,
  children: PropTypes.node
};

export default PaymentOption;
