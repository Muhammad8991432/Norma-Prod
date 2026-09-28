import React, { useEffect, useRef, useState } from 'react';
import { appAlert } from '@utils/globalConstant';
import { Icons } from '../Utils';
import { InfoNotification, Ta11yText } from '@core/index';
import { tA11y } from '@utils/a11y/a11yHelpers';
import './FormVoucher.scss';

export function FormVoucher({
  id,
  type,
  label,
  value,
  startIcon,
  hint,
  invalid,
  invalidMessage,
  validMessage,
  valid,
  onBlur,
  onChange,
  customClass = '',
  readOnly,
  ...restProps
}) {
  const inputRef = useRef();
  // State
  const [inputType, setInputType] = useState(type);
  const [isFocus, setIsFocus] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Functions

  const triggerChange = (event) => {
    if (onChange) {
      onChange(event);
    }
    setInputValue(event.target.value);
    setIsTouched(true);
  };

  const triggerBlur = (event) => {
    if (onBlur) {
      onBlur(event);
    }
    setIsBlur(true);
    setIsFocus(false);
    setIsTouched(false);
  };

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(inputValue);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
    inputRef.current.focus();
  };

  const copyButtonAriaLabel = tA11y('nc_global_icn_copy_aria').ariaLabel;

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label ps-4 ms-1">
          {label}
        </label>
      )}
      <div className="focus-wrapper position-relative info-voucher-copy">
        {isCopied ? <div className='info-alert' role='alert'>
          <div
            className={`badge bg-white text-primary py-2 px-4 d-inline-flex align-items-center`}
            style={{}}
          >
            <Icons name={'checkcirclesuccess'} width={15} height={15} colorType="dark" />
            <Ta11yText 
              textContent={tA11y('nc_global_copy_code_txt1')}
              tag="span"
              className={`nc-doomsday-medium title ms-1`}
            />
          </div>
        </div> : null}
        <div
          className={`
        input-group input-group-lg
        ${valid ? 'valid' : ''} 
        ${invalid ? 'invalid animate__animated animate__shakeX' : ''} 
        ${isFocus ? 'focus' : ''} 
        ${isBlur ? 'blur' : ''} 
        ${isTouched ? 'touched' : ''}
        ${customClass}
      `}>
          {startIcon && (
            <span className="input-group-text pe-0 ps-6">
              <Icons name={startIcon} colorType="dark" />
            </span>
          )}
          <input
            ref={inputRef}
            className={`px-6 form-control form-code
            ${isFocus ? 'focus' : ''} 
            ${isBlur ? 'blur' : ''} 
            ${isTouched ? 'touched' : ''}`}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...{ id, type: inputType, value: inputValue, ...restProps }}
            onBlur={triggerBlur}
            onFocus={() => setIsFocus(true)}
            onChange={triggerChange}
            readOnly={readOnly}
          />
          {inputValue && (
            <div className="input-btn-icon input-group-text end-icon ps-0 pe-6 position-relative">
              <button
                type="button"
                onClick={handleCopyButtonClick}
                className="btn-reset-default-style"
                aria-label={copyButtonAriaLabel}>
                {isCopied ? <Icons name="checkdarkgreen" alt="" colorType="dark" /> : <Icons name="copy" alt="" colorType="dark" />}
              </button>
            </div>
          )}
        </div>
      </div>
      {hint && !valid && !invalid && (
        <div className="form-text mt-6px ps-5">
          <InfoNotification message={hint} />
        </div>
      )}
      {invalid && invalidMessage && (
        <div className="form-text mt-6px ps-5">
          <InfoNotification type={appAlert.ERROR} message={invalidMessage} />
        </div>
      )}
      {valid && validMessage && (
        <div className="form-text mt-6px ps-5">
          <InfoNotification type={appAlert.SUCCESS} message={validMessage} />
        </div>
      )}
    </div>
  );
}

export default FormVoucher;
