import React from 'react';
import './Line.scss';

export function Line({
  widthClass = 'w-100',
  borderColorClass = 'default',
  borderWidthClass = 'thin',
  customClass = ''
}) {
  return (
    <div
      className={`${widthClass} line line-color-${borderColorClass} line-width-${borderWidthClass} ${customClass}`}
      aria-hidden="true"
    />
  );
}

export default Line;
