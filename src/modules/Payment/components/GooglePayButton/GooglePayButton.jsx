import { PaymentLogo } from '@components/core/PaymentLogo';
import React from 'react';

export function GooglePayButton({ onClick, disabled, loading }) {
  return (
    <button
      type="button"
      className="w-100 p-3 rounded-pill nc-realtextpro-copy fw-bold bg-black border-0"
      onClick={onClick}
      disabled={disabled}
    >
      <PaymentLogo icon="iconGooglePayLight" bgClassName="" ariaLabel="Google Pay" width={75} height={20}/>
    </button>
  );
}

export default GooglePayButton;
