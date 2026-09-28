import React from 'react';
import { NavLink } from 'react-router-dom';
import Icons from '@core/Utils/Icons/Icons';
import { useA11y } from '@context/Utils';
import { Ta11yText } from '@core/index';
import { isExternalLink } from '@utils/globalConstant';
import './CardBenefit.scss';

export function CardBenefit({
  icon = '',
  label = '',
  rightVariant = 'dash',
  linkText = '',
  href = '',
  onLinkClick,
  onPillClick,
  onClick,
  linkAriaLabel = '',
  activeButtonAriaLabel = '',
  className = '',
  isPaused = false,
}) {
  const { tA11yTranslate } = useA11y();

  const activeLabelKey = 'nc_info_active';
  const warningLabelKey = 'nc_info_caution';
  const errorLabelKey = 'nc_info_error';

  const getAriaLabel = () => {
    if (linkAriaLabel) {
      return linkAriaLabel;
    }
    if (activeButtonAriaLabel) {
      return activeButtonAriaLabel;
    }
    const parts = [label];
    if (rightVariant === 'link' && linkText) {
      parts.push(linkText);
    }
    if (rightVariant === 'active') {
      parts.push(tA11yTranslate(activeLabelKey));
    }
    if (rightVariant === 'warning') {
      parts.push(tA11yTranslate(warningLabelKey));
    }
    if (rightVariant === 'error') {
      parts.push(tA11yTranslate(errorLabelKey));
    }
    return parts.filter(Boolean).join(', ');
  };

  const pillConfig = {
    'active': {
      'labelKey': activeLabelKey,
      'iconName': 'checkcircle',
      'textClassName': 'text-white',
      'bgClassName': 'bg-mint-100'
    },
    'warning': {
      'labelKey': warningLabelKey,
      'iconName': 'warninggray100',
      'textClassName': 'text-gray-100',
      'bgClassName': 'bg-yellow-100'
    },
    'error': {
      'labelKey': errorLabelKey,
      'iconName': 'erroroctagonwhite',
      'textClassName': 'text-white',
      'bgClassName': 'bg-red'
    }
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (rightVariant === 'link' && onLinkClick) {
      onLinkClick(e);
    } else if ((rightVariant === 'active' || rightVariant === 'warning' || rightVariant === 'error') && onPillClick) {
      onPillClick(e);
    }
  };

  const hasHref = href && rightVariant === 'link';
  const isExternal = hasHref && isExternalLink(href);

  const renderRight = () => {
    if (rightVariant === 'link') {
      return (
        <span className="d-inline-flex align-items-center gap-2 border-bottom border-primary text-primary">
          <Ta11yText textContent={tA11yTranslate(linkText)} tag="span" className="nc-doomsday-h6" />
        </span>
      );
    }
    if (rightVariant === 'dash') {
      return (
        <span aria-hidden="true">
          <Icons name="iconDash" width={24} height={24} alt="" />
        </span>
      );
    }
    if (rightVariant === 'active' || rightVariant === 'warning' || rightVariant === 'error') {
      const currentPillConfig = pillConfig[rightVariant] || {};
      const pillContent = (
        <>
          <span aria-hidden="true">
            <Icons name={currentPillConfig.iconName} width={16} height={16} alt="" />
          </span>
          <Ta11yText textContent={tA11yTranslate(currentPillConfig.labelKey)} tag="span" />
        </>
      );
      const arrowIcon = (
        <span aria-hidden="true">
          <Icons name="arrowrightgrey" width={20} height={20} alt="" />
        </span>
      );
      return (
        <span className="d-inline-flex align-items-center gap-2">
          <span
            className={`d-flex align-items-center gap-1 ${currentPillConfig.bgClassName} ${currentPillConfig.textClassName} py-2 px-2 rounded-pill pill-content`}>
            {pillContent}
          </span>
          {arrowIcon}
        </span>
      );
    }
    return null;
  };

  const cardContent = (
    <>
      {icon && (
        <span
          className="d-inline-flex align-items-center justify-content-center bg-mint-20 py-1 px-3 icon"
          aria-hidden="true"
        >
          <Icons name={icon} width={24} height={24} colorType="dark" alt="" />
        </span>
      )}
      <span className="flex-grow-1 text-start">
        <Ta11yText textContent={tA11yTranslate(label)} tag="span" className="nc-doomsday-h6" />
      </span>
      <span className="d-inline-flex align-items-center gap-2">{renderRight()}</span>
    </>
  );

  const cardClassName = `d-flex align-items-center justify-content-between w-100 py-3 px-5 shadow-mps rounded card-benefit gap-3 bg-white text-dark text-start text-decoration-none btn-reset-default-style ${isPaused ? 'card-benefit--paused' : ''
    } ${className}`;

  if (isPaused) {
    return (
      <div className={cardClassName} aria-label={getAriaLabel()}>
        {cardContent}
      </div>
    );
  }

  if (hasHref && isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
        onClick={onLinkClick}
        aria-label={getAriaLabel()}
      >
        {cardContent}
      </a>
    );
  }

  if (hasHref && !isExternal) {
    return (
      <NavLink
        to={href}
        className={cardClassName}
        onClick={onLinkClick}
        aria-label={getAriaLabel()}
      >
        {cardContent}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      className={`${cardClassName} border-0`}
      onClick={handleClick}
      aria-label={getAriaLabel()}
    >
      {cardContent}
    </button>
  );
}

export default CardBenefit;
