/**
 * // MPS
 * PaymentCardFields - Braintree Hosted Fields container
 */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '@core/index';
import './PaymentCardFields.scss';
import { useA11y } from '@context/Utils/A11y';

export function PaymentCardFields({
  initializeFields,
  onReady,
  onError,
  // onValidityChange,
  labels = {},
  className = '',
  disabled = false,
  fieldsHint = [],
  submitAttempted = false
}) {
  const { tA11yTranslate } = useA11y();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const cardholderNameRef = useRef('');
  const containerRef = useRef(null);
  const {
    cardNumber = tA11yTranslate('nc_global_wrapper_cardnumber_lbl').content,
    expiryDate = tA11yTranslate('nc_global_wrapper_expiredate_lbl').content,
    cvv = tA11yTranslate('nc_global_wrapper_creditcard_cvv_lbl').content,
    postalCode = tA11yTranslate('nc_global_wrapper_zip_lbl').content,
    cardholderName: cardholderNameLabel = tA11yTranslate('nc_global_wrapper_name_lbl').content
  } = labels;

  const initializedRef = useRef(false);
  const localHostedRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const setupCleanup = () => {
      mounted = false;
    };

    if (initializedRef.current) return setupCleanup;
    if (!containerRef.current || !initializeFields) return setupCleanup;

    // Check for DOM elements that are in fieldsHint (dynamic based on backend)
    const elementIds = {
      cardholderName: '#cardholder-name',
      number: '#card-number',
      expiryDate: '#expiration-date',
      expirationDate: '#expiration-date',
      cvv: '#cvv',
      postalCode: '#postal-code'
    };

    const hasElements = Object.entries(elementIds).every(([fieldName, selector]) => {
      // Only check for elements that are in fieldsHint
      if (!fieldsHint.includes(fieldName)) return true;
      return containerRef.current?.querySelector(selector);
    });

    if (!hasElements) return setupCleanup;

    initializedRef.current = true;
    setIsLoading(true);
    setError(null);

    initializeFields({ fieldsHint })
      .then((hostedFields) => {
        if (!mounted) return;

        localHostedRef.current = hostedFields;
        // console.log('[PaymentCardFields] Hosted Fields initialized successfully:', hostedFields);

        setIsLoading(false);

        if (hostedFields) {
          const fieldErrorKeyMap = {
            number: 'nc_global_wrapper_cardnumber_err',
            expirationDate: 'nc_global_wrapper_expiredate_err',
            cvv: 'nc_global_wrapper_creditcard_cvv_err',
            postalCode: 'nc_global_wrapper_zip_err'
          };
          hostedFields.on('validityChange', (event) => {
            const field = event.emittedBy;
            const fieldState = event.fields[field];
            const errorKey = fieldErrorKeyMap[field] || 'nc_global_wrapper_name_err';
            setFieldErrors((prev) => ({
              ...prev,
              [field]:
                fieldState.isValid || fieldState.isEmpty ? null : tA11yTranslate(errorKey).content
            }));
          });
          hostedFields.on('blur', (event) => {
            const field = event.emittedBy;
            setTouchedFields((prev) => ({ ...prev, [field]: true }));
          });
        }

        onReady?.({
          triggerValidation: () => {
            setShowErrors(true);
            setTouchedFields((prev) => ({
              ...prev,
              number: true,
              expirationDate: true,
              cvv: true,
              postalCode: true,
              cardholderName: true
            }));

            setFieldErrors((prev) => {
              const errors = { ...prev };
              if (fieldsHint.includes('cardholderName')) {
                // Get current value from DOM to avoid stale closure
                const inputElement = containerRef.current?.querySelector('#cardholder-name');
                const currentName = inputElement?.value || '';
                const isNameValid = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/.test(currentName.trim());
                errors.cardholderName =
                  !currentName.trim() || !isNameValid
                    ? tA11yTranslate('nc_global_wrapper_name_err').content
                    : null;
              }

              try {
                const state = localHostedRef.current?.getState?.();
                if (state) {
                  if (fieldsHint.includes('number')) {
                    const f = state.fields.number;
                    if (!f.isValid) {
                      if (f.isEmpty) {
                        errors.number = tA11yTranslate('nc_global_wrapper_cardnumber_err').content;
                      } else {
                        errors.number = tA11yTranslate('nc_global_wrapper_cardnumber_err').content;
                      }
                    } else {
                      errors.number = null;
                    }
                  }
                  if (fieldsHint.includes('expiryDate')) {
                    const f = state.fields.expirationDate;
                    if (!f.isValid) {
                      if (f.isEmpty) {
                        errors.expirationDate = tA11yTranslate(
                          'nc_global_wrapper_expiredate_err'
                        ).content;
                      } else {
                        errors.expirationDate = tA11yTranslate(
                          'nc_global_wrapper_expiredate_err'
                        ).content;
                      }
                    } else {
                      errors.expirationDate = null;
                    }
                  }
                  if (fieldsHint.includes('cvv')) {
                    const f = state.fields.cvv;
                    if (!f.isValid) {
                      if (f.isEmpty) {
                        errors.cvv = tA11yTranslate('nc_global_wrapper_creditcard_cvv_err').content;
                      } else {
                        errors.cvv = tA11yTranslate('nc_global_wrapper_creditcard_cvv_err').content;
                      }
                    } else {
                      errors.cvv = null;
                    }
                  }
                  if (fieldsHint.includes('postalCode')) {
                    const f = state.fields.postalCode;
                    if (!f.isValid) {
                      if (f.isEmpty) {
                        errors.postalCode = tA11yTranslate('nc_global_wrapper_zip_err').content;
                      } else {
                        errors.postalCode = tA11yTranslate('nc_global_wrapper_zip_err').content;
                      }
                    } else {
                      errors.postalCode = null;
                    }
                  }
                }
              } catch (err) {
                if (err && err.code === 'METHOD_CALLED_AFTER_TEARDOWN') {
                  // console.warn('[PaymentCardFields] Hosted Fields torn down during validation');
                  localHostedRef.current = null;
                } else {
                  throw err;
                }
              }

              return errors;
            });
          },
          isValid: () => {
            if (fieldsHint.includes('cardholderName')) {
              const inputElement = containerRef.current?.querySelector('#cardholder-name');
              const currentName = inputElement?.value || '';
              const isNameValid = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/.test(currentName.trim());
              if (!currentName.trim() || !isNameValid) return false;
            }
            try {
              const state = localHostedRef.current?.getState?.();
              if (state) {
                if (fieldsHint.includes('number') && !state.fields.number.isValid) return false;
                if (fieldsHint.includes('expiryDate') && !state.fields.expirationDate.isValid)
                  return false;
                if (fieldsHint.includes('cvv') && !state.fields.cvv.isValid) return false;
                if (fieldsHint.includes('postalCode') && !state.fields.postalCode.isValid)
                  return false;
              }
            } catch (err) {
              if (err && err.code === 'METHOD_CALLED_AFTER_TEARDOWN') {
                localHostedRef.current = null;
                return false;
              }
              throw err;
            }
            return true;
          }
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
        onError?.(err);
      });

    return () => {
      mounted = false;
      const hosted = localHostedRef.current;
      localHostedRef.current = null;

      if (hosted && typeof hosted.teardown === 'function') {
        (async () => {
          try {
            await hosted.teardown();
          } catch (err) {
            if (!(err && err.code === 'METHOD_CALLED_AFTER_TEARDOWN')) {
              console.warn('[PaymentCardFields] Error tearing down hosted fields');
            }
          }
        })();
      }
    };
  }, [initializeFields]);

  return (
    <div
      ref={containerRef}
      className={`payment-card-fields mb-3 w-100 ${className} ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}>
      {/* Cardholder Name */}
      {fieldsHint.includes('cardholderName') && (
        <div className="mb-4">
          <label className="form-label ps-4 ms-1" htmlFor="cardholder-name">
            {cardholderNameLabel}
          </label>
          <input
            id="cardholder-name"
            className={`input w-100 ${
              (showErrors || touchedFields.cardholderName || submitAttempted) &&
              !cardholderName.trim()
                ? 'error'
                : ''
            }`}
            type="text"
            autoComplete="cc-name"
            placeholder={tA11yTranslate('nc_global_wrapper_name_plc').content}
            disabled={disabled}
            value={cardholderName}
            onChange={(e) => {
              const { value } = e.target;
              setCardholderName(value);
              cardholderNameRef.current = value;
              if (fieldsHint.includes('cardholderName')) {
                const isNameValid = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/.test(value.trim());
                setFieldErrors((prev) => ({
                  ...prev,
                  cardholderName:
                    !value.trim() || !isNameValid
                      ? tA11yTranslate('nc_global_wrapper_name_err').content
                      : null
                }));
              }
            }}
            onBlur={() => setTouchedFields((prev) => ({ ...prev, cardholderName: true }))}
          />
          {(() => {
            const shouldShow = showErrors || touchedFields.cardholderName || submitAttempted;
            const isNameValid = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/.test(cardholderName.trim());
            if (shouldShow && (!cardholderName.trim() || !isNameValid)) {
              return (
                <div className="error">
                  <Icons name="error" width={14} height={14} />
                  <span>{tA11yTranslate('nc_global_wrapper_name_err').content}</span>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
      {/* Card Number */}
      {fieldsHint.includes('number') && (
        <div className="mb-4">
          <label className="form-label ps-4 ms-1" htmlFor="card-number">
            {cardNumber}
          </label>
          <div
            id="card-number"
            className={`input ${
              (showErrors || touchedFields.number || submitAttempted) && fieldErrors.number
                ? 'error'
                : ''
            }`}
          />
          {(() => {
            const shouldShow = showErrors || touchedFields.number || submitAttempted;
            if (shouldShow && fieldErrors.number) {
              // console.log('[DEBUG] Render number error:', fieldErrors.number);
              return (
                <div className="error">
                  <Icons name="error" width={14} height={14} />
                  <span>{fieldErrors.number}</span>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      <div className="row gx-3">
        {/* Expiry Date - adjust width based on whether postal code is present */}
        {fieldsHint.includes('expiryDate') && (
          <div
            className={`col-12 ${
              fieldsHint.includes('postalCode') ? 'col-md-4' : 'col-md-6'
            } mb-4`}>
            <label className="form-label ps-4 ms-1" htmlFor="expiration-date">
              {expiryDate}
            </label>
            <div
              id="expiration-date"
              className={`input ${
                (showErrors || touchedFields.expirationDate || submitAttempted) &&
                fieldErrors.expirationDate
                  ? 'error'
                  : ''
              }`}
            />
            {(() => {
              const shouldShow = showErrors || touchedFields.expirationDate || submitAttempted;
              if (shouldShow && fieldErrors.expirationDate) {
                // console.debug('Render expirationDate error:', fieldErrors.expirationDate);
                return (
                  <div className="error">
                    <Icons name="error" width={14} height={14} />
                    <span>{fieldErrors.expirationDate}</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        {/* CVV - adjust width based on whether postal code is present */}
        {fieldsHint.includes('cvv') && (
          <div
            className={`${fieldsHint.includes('postalCode') ? 'col-6' : 'col-12'} ${
              fieldsHint.includes('postalCode') ? 'col-md-4' : 'col-md-6'
            } mb-4`}>
            <label className="form-label ps-4 ms-1" htmlFor="cvv">
              {cvv}
            </label>
            <div
              id="cvv"
              className={`input ${
                (showErrors || touchedFields.cvv || submitAttempted) && fieldErrors.cvv
                  ? 'error'
                  : ''
              }`}
            />
            {(showErrors || touchedFields.cvv || submitAttempted) && fieldErrors.cvv && (
              <div className="error">
                <Icons name="error" width={16} height={16} />
                <span>{fieldErrors.cvv}</span>
              </div>
            )}
          </div>
        )}
        {/* Postal Code */}
        {fieldsHint.includes('postalCode') && (
          <div className="col-6 col-md-4 mb-4">
            <label className="form-label ps-4 ms-1" htmlFor="postal-code">
              {postalCode}
            </label>
            <div
              id="postal-code"
              className={`input ${
                (showErrors || touchedFields.postalCode || submitAttempted) &&
                fieldErrors.postalCode
                  ? 'error'
                  : ''
              }`}
            />
            {(showErrors || touchedFields.postalCode || submitAttempted) &&
              fieldErrors.postalCode && (
                <div className="error">
                  <Icons name="error" width={14} height={14} />
                  <span>{fieldErrors.postalCode}</span>
                </div>
              )}
          </div>
        )}
      </div>
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

PaymentCardFields.propTypes = {
  initializeFields: PropTypes.func.isRequired,
  onReady: PropTypes.func,
  onError: PropTypes.func,
  // onValidityChange: PropTypes.func,
  labels: PropTypes.shape({
    cardNumber: PropTypes.string,
    expiryDate: PropTypes.string,
    cvv: PropTypes.string,
    postalCode: PropTypes.string
  }),
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default PaymentCardFields;
