/* eslint-disable no-nested-ternary */
import {
  appBubbleTextOpenPosition,
  appBubbleBackground,
  appBubbleTextType,
  appIcons
} from '@utils/globalConstant';
import React from 'react';
import './BubbleText.scss';
import Ta11yText from '@core/Ta11yText';

export function BubbleText({
  text = '',
  cmsHtml,
  openPosition = appBubbleTextOpenPosition.BOTTOM, // 2 open position variants: top, bottom
  bgColorClass = appBubbleBackground.MINT80, //  3 bg variants: bg-white, bg-mint-60, bg-mint-80
  textColorClass = appBubbleTextType.DARKGREEN // 3 text color variants: text-gray-100, white, darkgreen
}) {
  const iconPosition =
    openPosition === appBubbleTextOpenPosition.BOTTOM ? 'bottom-icon' : 'top-icon';

  let bubbleIconVariant;
  if (openPosition === appBubbleTextOpenPosition.BOTTOM) {
    if (bgColorClass === 'bg-mint-80') {
      bubbleIconVariant = appIcons.bubblebottommint;
    }
    if (bgColorClass === 'bg-mint-60') {
      bubbleIconVariant = appIcons.bubblemint60bottom;
    }
    if (bgColorClass === 'bg-white') {
      bubbleIconVariant = appIcons.bubblebottom; // TODO change icon name in globalConstant // this is bottom icon
    }
  } else if (openPosition === appBubbleTextOpenPosition.TOP) {
    if (bgColorClass === 'bg-mint-80') {
      bubbleIconVariant = appIcons.bubblemint;
    }
    if (bgColorClass === 'bg-mint-60') {
      bubbleIconVariant = appIcons.bubblemint60top;
    }
    if (bgColorClass === 'bg-white') {
      bubbleIconVariant = appIcons.bubble;
    }
  }

  return (
    <div className={`bubble-text-container text-center position-relative bubble-text-${openPosition === appBubbleTextOpenPosition.TOP ? 'top' : 'bottom'}`}>
      <div className={`rounded-pill ${bgColorClass} ${textColorClass}`}>
        <Ta11yText textContent={text} className="bubble-text bubble-text nc-realtextpro-copy mb-0" tag="p" />
        <img src={bubbleIconVariant} alt="" srcSet="" className={`bubble-icon position-absolute ${iconPosition}`}/>
      </div>
    </div>
  );
}

export default BubbleText;
