/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import Icons from '@core/Utils/Icons/Icons';
import { useA11y } from '@context/Utils/A11y';
import './ButtonPrimary.scss';
import { appButtonTypes } from '@utils/globalConstant';
import { sanitizeRichText } from '@utils/sanitizeHtml';

export function ButtonPrimary({
  // customClass = '',
  children,
  icon,
  iconHover = false,
  // content from CMS (delivered by tA11yTranslate)
  buttonContent = {},
  // label is used when cmsKey is not provided, label is always plain text
  label = '',
  type,
  buttonType = appButtonTypes.PRIMARY.DEFAULT,
  onClick: onClickProp,
  btnRef,
  isLoading,
  underlineLabel = false,
  tabIndex = 0,
  customClass = 'justify-content-center',
  iconColorType, // add "dark" to dark icons (for high contrast mode)
  ...restProps
}) {
  // State & Refs
  // const btnRef = useRef(null);
  const [isHover, setIsHover] = useState(false);

  const { tA11yTranslate } = useA11y();

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

  const onClick = (event) => {
    if (onClickProp && !isLoading) {
      onClickProp(event);
    }
  };

  const onMouseEnter = () => {
    setIsHover(true);
  };

  const onMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <button
      {...(buttonContent.hasAriaLabel && { 'aria-label': buttonContent.ariaLabel })}
      {...(buttonContent.hasAriaDescription && {
        'aria-description': buttonContent.ariaDescription
      })}
      tabIndex={tabIndex}
      type={type === 'submit' ? 'submit' : 'button'}
      className={`${buttonType} ${customClass} btn-pr position-relative w-100 d-flex align-items-center`}
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...restProps}>
      {isLoading && (
        <div className="position-absolute top-4 z-1 w-100 px-2">
          <div className="btn-loader w-100">
            <div
              style={{ width: '1rem', height: '1rem' }}
              className="spinner-border"
              role="status"
              aria-label={tA11yTranslate('nc_global_loading').ariaLabel}
            />
          </div>
        </div>
      )}
      <>
        {hasValidText() &&
          (buttonContent.isHtml ? (
            <div
              className={`btn-label nc-hc-underline ${isLoading ? 'invisible' : ''} ${
                underlineLabel ? 'text-decoration-underline' : ''
              }`}
              dangerouslySetInnerHTML={{
                __html: sanitizeRichText(
                  buttonContent.content || label || buttonContent.ariaLabel || 'Button'
                )
              }}
            />
          ) : (
            <div
              className={`btn-label nc-hc-underline ${isLoading ? 'invisible' : ''} ${
                underlineLabel ? 'text-decoration-underline' : ''
              }`}>
              {buttonContent.content
                ? buttonContent.content
                : label || buttonContent.ariaLabel || 'Button'}
            </div>
          ))}
        {children && (
          <div className={`btn-children ${isLoading ? 'invisible' : ''}`}>{children}</div>
        )}
        {icon && (
          <Icons
            className={`btn-icon ${isLoading ? 'invisible' : ''}`}
            name={isHover && iconHover ? iconHover : icon}
            height={24}
            colorType={iconColorType}
          />
        )}
      </>
    </button>
  );
}

export default ButtonPrimary;
