/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef } from 'react';
import Icons from '@core/Utils/Icons/Icons';
import './ButtonMisc.scss';
import { appButtonTypes } from '@utils/globalConstant';

export function ButtonMisc({
  icon,
  label,
  type = appButtonTypes.SECONDARY.DEFAULT,
  shadow = false,
  onClick: onClickProp,
  iconColorType, // add "dark" to dark icons (for high contrast mode)
  ...restProps
}) {
  // State & Refs
  const btnRef = useRef(null);

  // Functions
  const onClick = (event) => {
    if (onClickProp) {
      onClickProp(event);
    }
    // Add animation class to button
    btnRef.current.classList.add('animate__animated', 'animate__headShake', 'animate__slow');
    // Remove animation class after animation ends
    btnRef.current.addEventListener('animationend', () => {
      btnRef.current.classList.remove('animate__animated', 'animate__headShake');
    });
  };
  return (
    <button
      type="button"
      className={`${type} ${shadow ? 'shadow' : ''}`}
      ref={btnRef}
      onClick={onClick}
      {...restProps}>
      {icon && (
        <Icons className="btn-icon" name={icon} height={25} width={25} colorType={iconColorType} />
      )}
      {label && <div className="btn-label ps-1">{label}</div>}
    </button>
  );
}

export default ButtonMisc;
