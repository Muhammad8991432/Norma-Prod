import React, { useRef, useEffect } from 'react';
import Icons from '@core/Utils/Icons/Icons';
import './ButtonCodeRenew.scss';
import Ta11yText from '@core/Ta11yText';

export const ButtonCodeRenew = ({
  children = null,
  iconLeft = null,
  iconRight = null,
  label,
  type = 'button',
  timer,
  btnRef,
  onClick,
  disabled = false,
  ariaLabelButton,
  ariaLabelTimer,
  ...restProps
}) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      timerRef.current.innerText = `${timer}`;
      timerRef.current.setAttribute('aria-label', ariaLabelTimer);
    }
  }, [timer]);

  return (
    <div
      className="code-renew d-flex align-items-center justify-content-start"
      tabIndex={disabled ? 0 : undefined}>
      <button
        type={type}
        className={`d-flex code-renew-btn bg-transparent border-0 p-0 nc-link-doomsday text-primary ${
          disabled ? 'disabled' : ''
        }`}
        ref={btnRef}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabelButton}
        aria-disabled={disabled}
        // aria-description="timer-description" // We will maybe use this in the future
        {...restProps}>
        {iconLeft && (
          <span className="code-renew-icon pe-3">
            <Icons name={iconLeft} height={18} colorType="dark" />
          </span>
        )}
        {label && <Ta11yText textContent={label} className="code-renew-label" tag="span" />}
        {children && <span>{children}</span>}
      </button>
      <span className="nc-realtextpro-footnote ps-2">
        (
        <span
          role="timer"
          // id="timer-description"
          ref={timerRef}>
          {timer}
        </span>
        )
      </span>
    </div>
  );
};

export default ButtonCodeRenew;
