/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, forwardRef } from 'react';
import './ButtonCheckbox.scss';
import PropTypes from 'prop-types';
import { SelectionLabelText } from '@core/index';

export const ButtonCheckbox = forwardRef(
  (
    {
      value = false,
      onChange = () => {},
      isDefaultChecked = false,
      name = '',
      id = '',
      valid = false,
      invalid = false,
      invalidMessage,
      disabled = false,
      labelVariant,
      links = [],
      labelBold,
      labelNormal,
      isCmsLink = false,
      errorId,
      ...restProps
    },
    ref
  ) => {
    // State
    const [isActive, setIsActive] = useState(value);

    // Hooks
    useEffect(() => {
      onChange(isActive);
    }, [isActive]);

    useEffect(() => {
      setIsActive(value);
    }, [value]);

    return (
      <div className="selection-wrapper custom-form-check d-flex">
        <input
          ref={ref} // allow parent to move focus here
          id={id}
          name={name}
          checked={isActive || isDefaultChecked}
          className={`checkbox-input form-check-input 
        ${valid ? 'valid' : ''} 
        ${invalid ? 'invalid' : ''}`}
          value={isActive}
          // onChange={toggleCheckbox}
          // onKeyDown={toggleCheckbox}
          onChange={() => setIsActive(!isActive)}
          type="checkbox"
          disabled={disabled}
          // aria-checked={isActive}
          aria-invalid={invalid ? 'true' : 'false'}
          aria-describedby={invalid ? errorId : undefined}
          aria-errormessage={invalid ? errorId : undefined}
          {...{ ...restProps }}
        />

        <SelectionLabelText
          id={id}
          // label={label}
          labelBold={labelBold}
          labelNormal={labelNormal}
          valid={valid}
          invalid={invalid}
          invalidMessage={invalidMessage}
          links={links}
          labelVariant={labelVariant}
          isCmsLink={isCmsLink}
          ariaDescribedby={restProps['aria-describedby']}
        />
      </div>
    );
  }
);

ButtonCheckbox.displayName = 'ButtonCheckbox';

ButtonCheckbox.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  isDefaultChecked: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  labelVariant: PropTypes.oneOf(['sm', 'lg']),
  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  invalidMessage: PropTypes.string,
  disabled: PropTypes.bool,
  links: PropTypes.arrayOf(PropTypes.string),
  errorId: PropTypes.string
};

export default ButtonCheckbox;
