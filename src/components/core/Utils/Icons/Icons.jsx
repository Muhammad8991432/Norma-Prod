/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { appIcons } from '@utils/globalConstant';

export function Icons({
  name,
  width,
  height,
  alt = '',
  containerClass = '',
  colorType, // important for transformation of color in high contrast mode // use "dark" only on originally dark icons (darkgreen, gray)
  ...restProps
}) {
  const iconPath = appIcons[name];

  if (!iconPath) {
    // Handle the case where the icon name is not found
    return <div>404 - ICON</div>;
  }

  return (
    <div className={`app-icon ${name} ${containerClass} ${colorType}`}>
      <img src={iconPath} alt={alt} width={width} height={height} {...restProps} />
    </div>
  );
}

export default Icons;
