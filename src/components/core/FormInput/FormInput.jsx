/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { appAlert, getForbiddenCharError } from '@utils/globalConstant';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { Icons } from '@core/Utils/index';
import { useStaticContent } from '@context/StaticContent';
import { InfoNotification } from '../InfoNotification';
import './FormInput.scss';

export const FormInput = forwardRef(
  (
    {
      id,
      type,
      label,
      startIcon,
      hint,
      invalid,
      invalidMessage,
      validMessage,
      valid,
      rightIcon,
      customClass = '',
      onChange,
      onBlur,
      tooltipTitle,
      disabled = false,
      value: propValue,
      maxLength,
      clearInput,
      checkCharRegex = null,
      isDatePicker = false, // This prop is used to determine if the input is a date picker
      handleCalendar, // This prop is used to handle calendar icon click for date picker
      ...restProps
    },
    ref
  ) => {
    const { getStaticContentValue } = useStaticContent();

    // Refs
    const inputRef = useRef();

    // State
    const [showPassword, setShowPassword] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [inputType, setInputType] = useState(type);
    const [isFocus, setIsFocus] = useState(false);
    const [isBlur, setIsBlur] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [inputValue, setInputValue] = useState(propValue || '');
    const [isCleared, setIsCleared] = useState(false);
    const [invalidCharError, setInvalidCharError] = useState(null);

    const deleteContent = tA11y('nc_global_delete_aria');

    // Functions
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

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

    const handleClearInput = () => {
      setInputValue('');
      setIsCleared(true);
      if (onChange) {
        // onChange({ target: { value: '' } });
        onChange({ target: { name: inputRef.current.name, value: '' } }); // https://formik.org/docs/api/formik#handlechange-e-reactchangeeventany--void
      }
      inputRef.current.focus();
    };

    function replaceFirstBlankOnlyEntry(input, replaceValue) {
      if (input == null) return input; // null or undefined, return as is

      const trimmedInput = input.trim();

      if (trimmedInput === '') {
        // Input is only spaces
        return replaceValue;
      }

      const parts = input.split(',').map((p) => p.trimEnd());
      let replaced = false;

      const result = parts.map((part) => {
        const trimmed = part.trim();
        // if (!replaced && trimmed === '') {
        if (!replaced && (trimmed === '' || trimmed === ',')) {
          replaced = true;
          return replaceValue;
        }
        return part.trim();
      });

      return result.join(', ');
    }

    useEffect(() => {
      if (inputValue !== '') {
        setIsCleared(false);
      }
      // Check for invalid characters
      if (checkCharRegex) {
        const forbiddenCharError = getForbiddenCharError(inputValue, checkCharRegex);
        // Error messages for invalid characters
        const staticErrMsg = getStaticContentValue('nc_global_err_addition_character').content;
        const staticErrMsgOfSpace = getStaticContentValue(
          'nc_whitespace_additional_char_err'
        ).content;
        const staticErrMsgOfComma = getStaticContentValue('nc_comma_additional_char_err').content; // Comma char

        let invalidChars = [];
        // Check for specific invalid characters (comma and space)
        if (typeof inputValue === 'string') {
          if (inputValue.includes(',') && !invalidChars.includes(staticErrMsgOfComma)) {
            invalidChars.push(staticErrMsgOfComma);
          }
          if (inputValue.includes(' ') && !invalidChars.includes(staticErrMsgOfSpace)) {
            invalidChars.push(staticErrMsgOfSpace);
          }
        }

        // Use regex to find all other invalid characters
        const otherInvalidChars = typeof inputValue === 'string' ? inputValue.match(checkCharRegex) : [];
        if (otherInvalidChars) {
          // Filter out commas and spaces from regex matches to avoid duplication
          const filteredInvalidChars = otherInvalidChars.filter(
            (char) => char !== ',' && char !== ' '
          );
          filteredInvalidChars.forEach((char) => {
            if (!invalidChars.includes(char)) {
              invalidChars.push(char);
            }
          });
        }

        // Combine all invalid characters into a single error message
        let newForbiddenCharError = invalidChars.join(', ');
        if (!newForbiddenCharError) {
          newForbiddenCharError = replaceFirstBlankOnlyEntry(
            forbiddenCharError,
            staticErrMsgOfSpace
          );
        }

        setInvalidCharError(forbiddenCharError ? `${staticErrMsg} ${newForbiddenCharError}` : null);
      }
    }, [inputValue]);

    useEffect(() => {
      // if (propValue !== undefined) { // issue with autotopup page when propValue is null
      if (propValue !== undefined && propValue !== null) {
        setInputValue(propValue);
        setIsCleared(false);
      }
    }, [propValue]);

    // for resetting input value from parent
    useEffect(() => {
      if (clearInput) setInputValue('');
    }, [clearInput]);

    return (
      <div>
        {label && (
          <label htmlFor={id} className="form-label ps-4 ms-1">
            {label}
          </label>
        )}
        <div className="focus-wrapper">
          <div
            className={`
        input-group
        ${valid ? 'valid' : ''}
        ${invalid ? 'invalid animate__animated animate__shakeX' : ''}
        ${isFocus ? 'focus' : ''}
        ${isBlur ? 'blur' : ''}
        ${isTouched ? 'touched' : ''}
        ${disabled ? 'disabled' : ''}
        ${customClass}
      `}>
            {startIcon && (
              <span
                className={`input-group-text start-icon pe-0 ps-6 ${
                  disabled ? 'bg-transparent' : ''
                }`}>
                <Icons name={startIcon} colorType="dark" />
              </span>
            )}
            <input
              ref={(node) => {
                inputRef.current = node; // Set the internal ref
                if (typeof ref === 'function') {
                  ref(node); // Call the forwarded ref if it's a function
                } else if (ref) {
                  // eslint-disable-next-line no-param-reassign
                  ref.current = node; // Assign the forwarded ref if it's an object
                }
              }}
              className={`form-control custom-placehoder-pl
            ${isFocus ? 'focus' : ''}
            ${isBlur ? 'blur' : ''}
            ${isTouched ? 'touched' : ''}
            ${invalid ? 'text-red' : ''}`}
              {...{ id, type: inputType, ...restProps }}
              onBlur={triggerBlur}
              onFocus={() => setIsFocus(true)}
              onChange={triggerChange}
              disabled={disabled}
              value={inputValue}
              type={type === 'password' && showPassword ? 'text' : type}
              onInput={
                // maxLength !== undefined && type === 'number'
                maxLength !== undefined && (type === 'number' || type === 'text')
                  ? (e) => {
                      if (e.target.value.length > maxLength) {
                        e.target.value = e.target.value.slice(0, maxLength);
                      }
                    }
                  : null
              }
            />
            {type === 'password' && (
              <div className="input-btn-icon input-group-text end-icon ps-0 pe-6">
                <button
                  type="button"
                  className="btn-reset-default-style"
                  onClick={togglePasswordVisibility}
                  aria-label={
                    showPassword
                      ? tA11y('nc_global_icn_hide_aria').ariaLabel
                      : tA11y('nc_global_icn_show_aria').ariaLabel
                  }>
                  {showPassword ? (
                    <Icons name="hidedark" colorType="dark" />
                  ) : (
                    <Icons name="showdark" colorType="dark" />
                  )}
                </button>
              </div>
            )}
            {type !== 'password' && inputValue && !isCleared && (
              <div
                className={`input-btn-icon input-group-text ${
                  isDatePicker ? '' : 'end-icon'
                } ps-0 pe-6`}>
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="btn-reset-default-style"
                  aria-label={deleteContent.ariaLabel}>
                  <Icons name="removedark" alt="" colorType="dark" />
                </button>
              </div>
            )}
            {isDatePicker && (
              <div className="input-btn-icon input-group-text end-icon ps-0 pe-6">
                <button
                  type="button"
                  onClick={handleCalendar}
                  className="btn-reset-default-style"
                  aria-hidden="true">
                  <Icons name="dateGreen" alt="" />
                </button>
              </div>
            )}
          </div>
        </div>
        {hint && !valid && !invalid && (
          <div className="form-text mt-6px ps-4" id={restProps['aria-describedby']}>
            <InfoNotification message={hint} />
          </div>
        )}
        {(invalid && invalidMessage) || (checkCharRegex && invalidCharError) ? <div id={restProps['aria-describedby']}>
          {invalid && invalidMessage && (
            <div
              className="form-text mt-6px ps-4"
              aria-live="assertive"
            >
              <InfoNotification type={appAlert.ERROR} message={invalidMessage} />
            </div>
          )}
          {checkCharRegex && invalidCharError && (
            <div
              className="form-text mt-6px ps-4"
              aria-live="assertive"
            >
              <InfoNotification type={appAlert.ERROR} message={invalidCharError} />
            </div>
          )}
        </div> : null}
        {valid && validMessage && (
          <div className="form-text mt-6px ps-4" id={restProps['aria-describedby']}>
            <InfoNotification type={appAlert.SUCCESS} message={validMessage} />
          </div>
        )}
      </div>
    );
  }
);

// this line was needed to avoid eslint error "display name is missing"
FormInput.displayName = 'FormInput';

export default FormInput;
