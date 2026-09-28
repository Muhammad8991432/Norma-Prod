import React, { useEffect, useState } from 'react';
import './ButtonToggle.scss';
import { SelectionLabelText } from '@core/index';

export function ButtonToggle({
  id,
  label,
  value = false,
  onChange = () => {},
  valid = false,
  invalid = false,
  invalidMessage,
  disabled = false,
  labelVariant,
  links = [],
  labelBold,
  labelNormal,
  ariaLabelledby,
  ariaDescribedby
}) {
  // State
  const [isActive, setIsActive] = useState(value);

  // Hooks
  useEffect(() => {
    if (isActive !== value) {
      onChange(isActive);
    }
  }, [isActive]);

  useEffect(() => {
    if (value !== isActive) {
      setIsActive(value);
    }
  }, [value]);

  return (
    <div className="toggle-switch d-flex">
      <div className="toggle-switch-button">
        <button
          type="button"
          role="switch"
          className={`btn btn-toggle ${isActive ? 'active' : 'inactive'}`}
          onClick={() => setIsActive(!isActive)}
          aria-label={label}
          aria-checked={isActive}
          disabled={disabled}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}>
          <div className="handle" />
        </button>
      </div>
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
      />
    </div>
  );
}

export default ButtonToggle;
