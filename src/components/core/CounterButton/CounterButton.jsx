import React from 'react';
import './CounterButton.scss';

export function CounterButton({
  id,
  label,
  customClass = '',
  buttonType = '',
  onSelect,
  children
  // ...restProps
}) {
  return (
    <button
      type="button"
      className={`${buttonType} ${customClass} px-3 w-100`}
      onClick={() => onSelect(id)}>
      {label && <div className="btn-label px-0 px-sm-0 text-nowrap">{label}</div>}
      {children && <div className="btn-children">{children}</div>}
    </button>
  );
}

export default CounterButton;
