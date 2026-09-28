import { PaymentLogo } from '@components/core/PaymentLogo';
import React from 'react';

export function ApplePayButton({ onClick, disabled }) {
  // Use native element if possible, fallback otherwise
  // Uncomment below if native works for you
  // if (window.ApplePaySession) {
  //   return (
  //     <apple-pay-button
  //       buttonstyle="black"
  //       locale="de"
  //       style={{ width: '100%', height: '48px', borderRadius: '8px' }}
  //       onClick={onClick}
  //     />
  //   );
  // }
  return (
    <button
      type="button"
      className="w-100 p-3 rounded-pill nc-realtextpro-copy fw-bold bg-black border-0"
      onClick={onClick}
      disabled={disabled}
    >
      <PaymentLogo icon="iconApplePayLight" bgClassName="" ariaLabel="Apple Pay" width={75} height={20}/>
    </button>
  );
}

export default ApplePayButton;
