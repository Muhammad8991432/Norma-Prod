// Figma: Chips

import React from 'react';
import Icons from '@core/Utils/Icons/Icons';
import './Badge.scss';
import { Ta11yText } from '@core/index';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { isColorDark } from '@utils/globalConstant';

const badgeColorsMap = {
  mint: 'bg-mint-80',
  white: 'bg-white',
  yellow: 'bg-yellow-100'
};

export function Badge({
  title,
  colorVariant,
  icon = 'likedarkgreen',
  textClass = 'nc-doomsday-medium title',
  textAndIconColor
}) {
  const resolvedColor = Array.isArray(colorVariant) ? colorVariant[0] : colorVariant;
  const bgColorClass = badgeColorsMap[resolvedColor];
  const customBgColor = bgColorClass ? {} : { backgroundColor: resolvedColor };

  const textIconStyle = textAndIconColor ? { color: textAndIconColor } : {};

  return (
    <div
      className={`badge ${bgColorClass} ${textAndIconColor ? '' : 'text-primary'
        } py-6px px-3 rounded-pill d-inline-flex align-items-center`}
      style={{ ...customBgColor, ...textIconStyle, maxWidth: '100%' }}>
      <Icons
        name={icon}
        width={18}
        height={18}
        className="flex-shrink-0"
        colorType={textAndIconColor && !isColorDark(textAndIconColor) ? '' : 'dark'}
        // {...(textAndIconColor && { style: { filter: 'brightness(0) invert(1)' } })} // Simple fallback if icon is dark and we want light text
        {...(textAndIconColor && !isColorDark(textAndIconColor) && { style: { filter: 'brightness(0) invert(1)' } })}
      />
      <Ta11yText
        textContent={tA11y(title)}
        tag="span"
        className={`${textClass} ms-1 badge-text`}
        {...(textAndIconColor && { style: textIconStyle })}
      />
    </div>
  );
}

export default Badge;
