import React from 'react';
import { PaymentLogo } from '@components/core/PaymentLogo';

export function PayPalButton({ onClick, disabled, loading, label }) {
  return (
    <button
      type="button"
      className="w-100 p-3 rounded-pill nc-realtextpro-copy fw-bold bg-warning border-0"
      onClick={onClick}
      disabled={disabled}
    >
      <PaymentLogo icon="iconPaypal" bgClassName="" ariaLabel="PayPal" width={75} height={20}/>
    </button>
  );
}

export default PayPalButton;
