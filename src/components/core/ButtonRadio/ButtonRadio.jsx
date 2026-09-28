/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import './ButtonRadio.scss';
import { appKeyCode } from '@utils/globalConstant';
import { SelectionLabelText } from '@core/index';

export function ButtonRadio({
  value = false,
  onChange = () => {},
  name = '',
  id = '',
  valid = false,
  invalid = false,
  invalidMessage,
  label,
  disabled,
  links,
  labelVariant,
  labelBold,
  labelNormal,
  radioContent = {},
  noLabel = false,
  ...restProps
}) {
  // State
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (event) => {
    if (disabled) return;
    const { keyCode } = event;
    if (keyCode === appKeyCode.ENTER || keyCode === appKeyCode.SPACE) {
      event.preventDefault();
      onChange(true);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    onChange(true);
  };

  const handleChange = (event) => {
    if (disabled) return;
    const newValue = event.target.checked;
    onChange(newValue);
  };

  return (
    <div
      className="radio-wrapper"
    >
      <div className="custom-radio">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={value}
          disabled={disabled}
          onChange={handleChange}
          aria-checked={value}
          {...{ ...restProps }}
        />
        <div
          className={`radio-icon
            ${valid ? 'valid' : ''} 
            ${invalid ? 'invalid' : ''} 
            ${isFocused ? 'focused' : ''}`}
          onClick={() => {
            onChange(true);
            document.getElementById(id).focus();
          }}
        />
      </div>
      {!noLabel && (
        <SelectionLabelText
        id={id}
        // label={label}
        labelBold={labelBold}
        labelNormal={labelNormal}
        labelVariant={labelVariant}
        valid={valid}
        invalid={invalid}
        invalidMessage={invalidMessage}
        links={links}
        ariaDescribedby={restProps['aria-describedby']}
      />)}
    </div>
  );
}

export default ButtonRadio;
