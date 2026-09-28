/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from 'react';
import Icons from '@core/Utils/Icons/Icons';
import './ButtonSecondary.scss';
import { appButtonTypes } from '@utils/globalConstant';
import { sanitizeRichText } from '@utils/sanitizeHtml';

export function ButtonSecondary({
  icon,
  // content from CMS (delivered by tA11yTranslate)
  buttonContent = {},
  // label is used when cmsKey is not provided, label is always plain text
  label = '',
  type = appButtonTypes.SECONDARY.DEFAULT,
  tabIndex = 0,
  shadow = false,
  onClick: onClickProp,
  customClass = '',
  iconColorType, // add "dark" to dark icons (for high contrast mode)
  // The following prop is only used for this button in a teaser card (2025-05-22)
  // This also entails that an icon is displayed on the left, which changes its colour via CSS.
  // We are using the icon font (with only one icon) for this. The icon is therefore not passed as a prop.
  teaserTextColor = '',
  ...restProps
}) {
  // State & Refs
  const [buttonText, setButtonText] = useState('');

  const btnRef = useRef(null);

  // Functions
  const hasValidText = () => {
    if (buttonContent && Object.keys(buttonContent).length > 0) {
      if (buttonContent.content !== '' && buttonContent.content !== undefined) {
        return true;
      }
      return false;
    }
    if (label && label !== '') {
      return true;
    }
    return false;
  };

  useEffect(() => {
    let buttonTextContent = buttonContent.content || label || buttonContent.ariaLabel || 'Button';
    // add icon and change text colour for teaser cards on dashboard
    if (teaserTextColor) {
      buttonTextContent = (
        <span className="teaser-card-link text-start" style={{ color: teaserTextColor }}>
          <span className="nc-icon-forward" />
          <span>{buttonTextContent}</span>
        </span>
      );
    }
    setButtonText(buttonTextContent);
  }, [buttonContent]);

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
      {...(buttonContent.hasAriaLabel && { 'aria-label': buttonContent.ariaLabel })}
      {...(buttonContent.hasAriaDescription && {
        'aria-description': buttonContent.ariaDescription
      })}
      tabIndex={tabIndex}
      type="button"
      className={`${type} ${shadow ? 'shadow' : ''} ${customClass} ${teaserTextColor ? 'teaser-link' : ''}`}
      ref={btnRef}
      onClick={onClick}
      {...restProps}
    >
      {hasValidText() &&
        (buttonContent.isHtml ? (
          <div className="btn-label" dangerouslySetInnerHTML={{ __html: sanitizeRichText(buttonText) }} />
        ) : (
          <div className="btn-label">{buttonText}</div>
        ))
      }

      {/* {label && <div className="btn-label">{label}</div>} */}
      {icon && <Icons className="btn-icon" name={icon} height={24} colorType={iconColorType} />}
    </button>
  );
}

export default ButtonSecondary;
