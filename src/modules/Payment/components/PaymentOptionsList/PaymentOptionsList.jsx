import React from 'react';
import { PAYMENT_METHODS } from '@utils/globalConstant';
import { PaymentCardFields } from '../PaymentCardFields/PaymentCardFields';
import { PaymentOption } from '../PaymentOption/PaymentOption';

/**
 * PaymentOptionsList - Reusable payment method option renderer
 *
 * Renders a list of payment method options with optional Braintree Hosted Fields for credit cards.
 * Used across multiple payment flows (TopUp, Activation, etc.) to ensure consistent UI and behavior.
 *
 * Props:
 *   - options: Array of payment method options with visibility and metadata
 *   - selectedMethod: Currently selected payment method
 *   - onSelect: Callback when a payment method is selected
 *   - initializeCardFields: Function to initialize Braintree Hosted Fields
 *   - cardFieldsKey: Key to force re-render of card fields on method change
 *   - setFieldsReady: Function to set when card fields are ready
 *   - cardFieldsApiRef: Ref to store Braintree API instance
 *   - creditCardHint: Array of validation hints for credit card fields
 *   - submitAttempted: Whether payment submission has been attempted
 *   - clientReady: Whether Braintree client is ready
 *   - creditCardType: (Optional) Specific credit card subtype (VISA, MASTERCARD, AMEX)
 *   - useStoredCard: (Optional) Whether to suppress credit card selection (TopUp only)
 */
export function PaymentOptionsList({
  options,
  selectedMethod,
  useStoredCard,
  onSelect,
  initializeCardFields,
  cardFieldsKey,
  setFieldsReady,
  cardFieldsApiRef,
  creditCardHint,
  submitAttempted,
  clientReady,
  creditCardType
}) {
  return (
    <>
      {options
        .filter((opt) => opt.show)
        .map((opt) => {
          const isSelectedComputed =
            // If stored card UI flag is set, suppress credit card option selection (TopUp only)
            useStoredCard && opt.method === PAYMENT_METHODS.CREDIT_CARD
              ? false
              : selectedMethod === opt.method;

          return (
            <PaymentOption
              key={opt.method}
              method={opt.method}
              label={opt.label}
              iconPath={opt.iconPath}
              isSelected={isSelectedComputed}
              onSelect={onSelect}>
              {opt.method === PAYMENT_METHODS.CREDIT_CARD &&
                selectedMethod === PAYMENT_METHODS.CREDIT_CARD &&
                clientReady && (
                  <PaymentCardFields
                    key={cardFieldsKey}
                    initializeFields={initializeCardFields}
                    onReady={(api) => {
                      setFieldsReady(true);
                      if (api && api.triggerValidation) {
                        // eslint-disable-next-line no-param-reassign
                        cardFieldsApiRef.current = api;
                      }
                    }}
                    onError={() => console.error('Card fields error')}
                    fieldsHint={creditCardHint}
                    submitAttempted={submitAttempted}
                    creditCardType={creditCardType}
                  />
                )}
            </PaymentOption>
          );
        })}
    </>
  );
}

export default PaymentOptionsList;