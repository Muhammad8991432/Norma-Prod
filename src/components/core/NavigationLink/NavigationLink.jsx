import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationLink.scss';
import Icons from '@core/Utils/Icons/Icons';

// For internal and navbar links

function handleInActiveClass(isMobile) {
  if (isMobile) return '';
  return 'inactive';
}

export function NavigationLink({
  to,
  className,
  isMobile,
  children,
  onClick,
  iconLeft = null,
  iconRight = null,
  iconHeight = 18,
  linkStyle,
  fontSize = '16px', // default
  underline = false,
  isActiveNavLink,
  iconColorType, // add "dark" to dark icons for high contrast mode
  isLogout = false, // used for logout link to disable pointer events
}) {
  const renderIcon = (icon, className) => {
    // for <svg> icons
    if (typeof icon === 'string') {
      // return <img src={icon} className={className} height={iconHeight} alt="" />;
      return <Icons name={icon} className={className} height={iconHeight} colorType={iconColorType} />;
    }
    return <span className={className}>{icon}</span>;
  };

  return isLogout ? (
    <a
      className={`d-inline-block p-2px nav-link inactive undefined d-inline-block p-2px nav-link`}
      style={{
        fontSize,
        cursor: 'pointer',
        pointerEvents: 'auto'
      }}
      onClick={onClick}
      aria-disabled="false"
      href='JavaScript:void(0);' // prevent default link behavior
    >
      <div className="d-flex align-items-center">
        {iconLeft && <span>{isMobile ? '' : renderIcon(iconLeft, 'me-3')}</span>}
        {children && children}
        {iconRight && <span>{isMobile ? '' : renderIcon(iconRight, 'ms-3')}</span>}
      </div>
    </a>
  ) : (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive, isPending, isTransitioning }) =>
        [
          isPending ? 'pending' : '',
          // isActive ? 'active' : handleInActiveClass(isMobile),
          isActiveNavLink ? 'active' : handleInActiveClass(isMobile),
          isTransitioning ? 'transitioning' : '',
          `${linkStyle} d-inline-block p-2px nav-link ${
            isMobile ? 'nav-link-mobile' : ''
          } ${className}`,
          underline ? 'link-underline' : ''
        ]
          .filter(Boolean)
          .join(' ')
      }
      style={{
        fontSize,
        cursor: 'pointer',
        pointerEvents: 'auto'
      }}
      aria-disabled="false"
      {...(!isLogout && { 'aria-current': isActiveNavLink ? 'page' : undefined })}>
      <div className="d-flex align-items-center">
        {iconLeft && <span>{isMobile ? '' : renderIcon(iconLeft, 'me-3')}</span>}
        {children && <span>{children}</span>}
        {iconRight && <span>{isMobile ? '' : renderIcon(iconRight, 'ms-3')}</span>}
      </div>
    </NavLink>
  );
}

export default NavigationLink;
