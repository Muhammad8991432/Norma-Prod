import React from 'react';
import Icons from '@core/Utils/Icons/Icons';
import './PaymentLogo.scss';

export function PaymentLogo({
  icon = '',
  isBackground = true,
  bgClassName = '',
  width = 48,
  height = 32,
  className = '',
  ariaLabel = ''
}) {
  if (!icon) return null;

  return (
    <div
      className={`d-inline-flex align-items-center justify-content-center rounded-2 ${isBackground ? bgClassName : 'py-2 px-3'} ${className}`}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel || undefined}
    >
      <Icons name={icon} width={width} height={height} alt="" />
    </div>
  );
}

export default PaymentLogo;
