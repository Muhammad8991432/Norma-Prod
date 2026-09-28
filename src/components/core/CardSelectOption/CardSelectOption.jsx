/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { NavLink } from 'react-router-dom';
import Icons from '@core/Utils/Icons/Icons';
import { Link, Badge, ButtonRadio, Ta11yText } from '@core/index';
import { isExternalLink } from '@utils/globalConstant';
import './CardSelectOption.scss';
import { useA11y } from '@context/Utils';

const SIZE_CONFIG = {
  small: {
    headlineClass: 'nc-doomsday-h6',
    descriptionClass: 'nc-realtextpro-footnote',
    contentAlign: 'center'
  },
  middle: {
    headlineClass: 'nc-doomsday-h5',
    descriptionClass: 'nc-realtextpro-fillin',
    contentAlign: 'start'
  },
  large: {
    headlineClass: 'nc-doomsday-h4',
    descriptionClass: 'nc-realtextpro-fillin',
    contentAlign: 'start'
  }
};

export function CardSelectOption({
  isCampaign = false,
  isCampaignCard = false,
  campaignText = '',
  // used only for large viewports if second box in row has campaign chip to align the height of white content boxes of both cards
  useCampaignEmptySpace = false,
  size = 'large',
  hasRadio = false,
  title = '',
  description = '',
  detailsHref = '',
  onDetailsClick,
  onClick,
  radioName = 'card-option',
  radioId = '',
  checked = false,
  onRadioChange = () => { },
  leftIcon,
  rightIcon,
  className = '',
  hasLink = false,
  linkText = '',
  linkIconLeft = null,
  onLinkClick,
  // used only for large viewports if second box in row has bottom link to align the height of white content boxes of both cards
  useLinkEmptySpace = false
}) {
  const { tA11yTranslate } = useA11y();
  const sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG.middle;
  const safeRadioId = radioId || `card-${size}-${radioName}`;
  const isVerticalCenter = sizeConfig.contentAlign === 'center';

  const ariaLabel = `${tA11yTranslate(title).content}. ${tA11yTranslate(description).content}`;
  const hasDetailsHref = detailsHref && !hasRadio;
  const isExternal = hasDetailsHref && isExternalLink(detailsHref);

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (onDetailsClick) {
      onDetailsClick(e);
    }
  };

  const handleLinkClick = (e) => {
    if (onLinkClick) {
      onLinkClick(e);
    }
  }

  const cardContent = (
    <div className={`d-flex gap-3 ${isVerticalCenter ? 'align-items-center' : 'align-items-start'}`}>
      {leftIcon && <span
        className="card-select-option-icon d-flex align-items-center justify-content-center bg-mint-20 flex-shrink-0 px-4 py-1"
        aria-hidden="true"
      >
        <Icons name={leftIcon} width={24} height={24} alt="" />
      </span>}

      <div className="flex-grow-1 min-w-0 text-start">
        <Ta11yText textContent={tA11yTranslate(title)} tag="p" className={`${sizeConfig.headlineClass} mb-1 text-dark`} />
        <Ta11yText textContent={tA11yTranslate(description)} tag="p" className={`${sizeConfig.descriptionClass} text-gray-100 mb-0`} />
      </div>

      {hasRadio && (
        <div className="flex-shrink-0 d-flex align-items-center">
          <ButtonRadio
            id={safeRadioId}
            name={radioName}
            value={checked}
            onChange={(val) => onRadioChange(val)}
            noLabel
            radioContent={title}
            aria-label={`${title}, auswählen`}
          />
        </div>
      )}

      {!hasRadio && rightIcon && (
        <span className="d-inline-flex align-items-center flex-shrink-0" aria-hidden="true">
          <Icons name={rightIcon} width={24} height={24} alt="" />
        </span>
      )}
    </div>
  );

  const cardClassName = `card-select-option card shadow-mps rounded border-0 bg-white overflow-visible pt-4 pb-3 px-3 mt-0 d-flex flex-column w-100 text-start btn-reset-default-style text-decoration-none ${isCampaignCard ? 'card-select-option--campaign-card' : ''
    }`;

  return (
    <div className={`position-relative d-flex flex-column ${className}`}>
      {isCampaign && (
        <div className="flex-shrink-0 mb-2">
          <Badge title={campaignText} colorVariant="yellow" />
        </div>
      )}
      {useCampaignEmptySpace && <div className="d-none d-lg-block flex-shrink-0 mb-2" style={{ height: '30px' }} />}

      {hasRadio ? (
        <label
          htmlFor={safeRadioId}
          className={`${cardClassName} flex-grow-1`}
          aria-label={ariaLabel}
        >
          {cardContent}
        </label>
      ) : hasDetailsHref && isExternal ? (
        <a
          href={detailsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cardClassName} flex-grow-1`}
          onClick={onDetailsClick}
          aria-label={ariaLabel}
        >
          {cardContent}
        </a>
      ) : hasDetailsHref && !isExternal ? (
        <NavLink
          to={detailsHref}
          className={`${cardClassName} flex-grow-1`}
          onClick={onDetailsClick}
          aria-label={ariaLabel}
        >
          {cardContent}
        </NavLink>
      ) : (
        <button
          type="button"
          className={`${cardClassName} flex-grow-1`}
          onClick={handleCardClick}
          aria-label={ariaLabel}
        >
          {cardContent}
        </button>
      )}

      {hasLink && <div className="text-end mt-2 flex-shrink-0 pe-3">
        <Link
          label={tA11yTranslate(linkText).content}
          href={detailsHref}
          onClick={handleLinkClick}
          {...(linkIconLeft && { iconLeft: linkIconLeft })}
          linkStyle="text-primary"
        />
      </div>}
      {useLinkEmptySpace && <div className="d-none d-lg-block flex-shrink-0 mt-2" style={{ height: '24px' }} />}
    </div>
  );
}

export default CardSelectOption;
