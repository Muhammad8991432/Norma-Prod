/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { appLinkStyle } from '@utils/globalConstant';
import Icons from '@core/Utils/Icons/Icons';

// For external links

export function Link({
  children = null,
  iconLeft = null,
  iconRight = null,
  label,
  linkStyle = appLinkStyle.PRIMARY,
  customStyle,
  isLoading = false,
  // linkRef = '',
  href = '',
  iconHeight = 16,
  iconColorType, // add "dark" to dark icons (for high contrast mode)
  ...restProps
}) {
  // This component will render as a <button> if href is not provided or as a <a> if href is provided
  const isButton = !href;

  const commonContent = isLoading ? (
    <>
      <span className="w-100 py-2px d-inline-flex align-items-center justify-content-center">
        <span
          style={{ width: '20px', height: '20px' }}
          className="spinner-border spinner-border-sm"
          role="status"
        />
      </span>
    </>
  ) : (
    <span className="d-flex align-items-center justify-content-start">
      {/* {iconLeft && <img src={iconLeft} className="link-icon pe-3" height={iconHeight} alt="" />} */}
      {iconLeft && (
        <Icons
          name={iconLeft}
          className="link-icon pe-3"
          height={iconHeight}
          colorType={iconColorType}
        />
      )}
      {label && <span className="link-label">{label}</span>}
      {children && <span className="link-children">{children}</span>}
      {/* {iconRight && <img src={iconRight} className="link-icon ps-3" height={iconHeight} alt="" />} */}
      {iconRight && (
        <Icons
          name={iconRight}
          className="link-icon ps-3"
          height={iconHeight}
          colorType={iconColorType}
        />
      )}
    </span>
  );

  return isButton ? (
    <button
      type="button"
      role="link"
      className={`btn-reset-default-style nc-link ${linkStyle} nc-link-doomsday border-0 bg-transparent d-inline-block`}
      style={customStyle}
      {...restProps}>
      {commonContent}
    </button>
  ) : (
    <a
      className={`nc-link ${linkStyle} nc-link-doomsday border-0 bg-transparent d-inline-block`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={customStyle}
      {...restProps}>
      {commonContent}
    </a>
  );
}

Link.propTypes = {
  children: PropTypes.node,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  label: PropTypes.string,
  isLoading: PropTypes.bool,
  // linkRef: PropTypes.string
  href: PropTypes.string
};

export default Link;
