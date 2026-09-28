import React from 'react';
import { Icons } from '@core/Utils/Icons/Icons';
import { Ta11yImage } from '@core/Ta11yImage';
import useCmsImage from '@utils/useCmsImage';
import { ButtonRadio } from '@core/ButtonRadio';
import './PaymentFields.scss';

export function PaymentFields({
  id,
  icon,
  iconRef,
  label,
  radioContent,
  value,
  onChange: onChangeProps,
  isDefaultChecked,
  error = false,
  text = ''
}) {
  // Functions
  const onChange = (isTrue) => {
    if (onChangeProps) {
      onChangeProps(isTrue);
    }
  };

  const paymentImage = useCmsImage(iconRef);

  return (
    <div
      className="cursor-pointer payment-field d-flex align-items-center shadow-xs flex-column"
      onClick={onChange}
      // accessibility: removed this part because type="radio" should be used for this component
      // onKeyDown={(e) => {
      //   if (e.key === 'Enter' || e.key === ' ') {
      //     e.preventDefault();
      //     onChange(e);
      //   }
      // }}
      // role='button'
    >
      <div className="d-flex align-items-center w-100">
        <div aria-hidden="true" className="image-container bg-gray-20">
          {icon && <Icons name={icon} width={64} height={32} />}
          {iconRef && <Ta11yImage imageContent={paymentImage} className="img-fluid" />}
        </div>
        <div aria-hidden="true" className="flex-grow-1">
          {label && <label className="m-0 ps-3 nc-doomsday-copy label" htmlFor={id}>{label}</label>}
        </div>
        <ButtonRadio
          id={id}
          radioContent={radioContent}
          name="payment-field"
          value={value}
          onChange={onChange}
          invalid={error}
        />
      </div>
      {text && (
        <p aria-hidden="true" className="nc-realtextpro-footnote w-100 pt-2">
          {text}
        </p>
      )}
    </div>
  );
}

export default PaymentFields;
