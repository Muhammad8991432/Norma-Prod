import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../Badge';
import { ButtonSecondary } from '../ButtonSecondary';
import { isExternalLink } from '@utils/globalConstant';
import { buildGradientStyle } from '@utils/teaserGradient';
import './NewsTeaserSmall.scss';
import useCmsImage from '@utils/useCmsImage';
import { useA11y } from '@context/Utils';

const TYPE_CONFIG = {
  green: { infoClass: 'bg-darkgreen text-white' },
  mint: { infoClass: 'bg-mint-100 text-white' },
  white: { infoClass: 'bg-white bg-opacity-50 text-darkgreen' },
  yellow: { infoClass: 'bg-yellow-100 text-darkgreen' },
  red: { infoClass: 'bg-red text-white' }
};

export function NewsTeaserSmall({
  type = 'green',
  hasImage = false,
  hasChip = false,
  headline = '',
  chipTitle = '',
  chipTitleColor = '',
  teaserTitleColor,
  chipIcon = 'likedarkgreen',
  imageSrc = '',
  imageAlt = '',
  className = '',
  badgeColor = 'mint',
  badgeTextClass = 'nc-doomsday-medium title',
  active = -1,  // -1 = not active (no border), 0 = active (show focus border)
  tabIndex = 0,
  // If buttonHref is empty, the teaser has no link and will not be clickable.
  // If buttonHref is provided, it will navigate to the link on click.
  // If onButtonClick is provided, it will call the function on click instead of navigating.
  buttonHref = '',
  onButtonClick,
  // Gradient / style props from CMS data
  teaserStyle = 'plain',   // "plain" | "gradient"
  bgColor1 = '',
  bgColor2 = '',
  linearGradient = 'leftToRight',
  contentAlign = 'justify-content-between'
}) {
  const { tA11yTranslate } = useA11y();
  const navigate = useNavigate();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.green;

  const gradientStyle = buildGradientStyle(teaserStyle, bgColor1, bgColor2, linearGradient);
  const useGradient = Boolean(gradientStyle);
  const infoClass = `news-teaser-info p-4 p-md-4 rounded-start text-start ${useGradient ? 'text-white' : config.infoClass}`;
  const infoAlignClass = hasChip ? 'd-flex flex-column gap-4' : 'd-flex align-items-center justify-content-center';

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
      return;
    }
    if (buttonHref) {
      if (isExternalLink(buttonHref)) {
        window.open(buttonHref, '_blank');
      } else {
        navigate(buttonHref);
      }
    }
  };

  return (
    <div
      className={`news-teaser-small shadow-mps rounded overflow-hidden ${className} ${
        active === 0 ? 'active' : ''
      }`}>
      <div
        className={`d-flex flex-md-row h-100 ${useGradient ? '' : config.infoClass}`}
        style={gradientStyle || undefined}>
        <div className={`${infoAlignClass} ${infoClass} rounded-md-0 w-50 ${contentAlign}`}>
          {hasChip && (
            <div className="mb-2 badge-clip-wrapper">
              <Badge
                title={chipTitle}
                icon={chipIcon || undefined}
                colorVariant={badgeColor || 'mint'}
                textClass={badgeTextClass}
                textAndIconColor={chipTitleColor || '#074D52'}
              />
            </div>
          )}
          {buttonHref ? (
            <ButtonSecondary
              style={{ color: teaserTitleColor ? teaserTitleColor : '#fff', wordBreak: 'break-word' }}
              label={tA11yTranslate(headline).content || headline}
              buttonContent={tA11yTranslate(headline)}
              onClick={handleClick}
              tabIndex={tabIndex}
              customClass="news-teaser-small-headline-btn"
            />
          ) : (
            <span
              className="news-teaser-small-headline-btn news-teaser-small-headline-txt"
              style={{ color: teaserTitleColor ? teaserTitleColor : '#fff', wordBreak: 'break-word' }}
            >
              {tA11yTranslate(headline).content || headline}
            </span>
          )}
        </div>
        {hasImage && (
          <div
            className={`news-teaser-image rounded-end d-flex align-items-center justify-content-center w-50 ${
              hasImage && !useGradient ? config.infoClass : !hasImage ? 'bg-light' : ''
            }`}>
            {imageSrc ? (
              <img
                src={useCmsImage(imageSrc)?.media_url_display}
                alt={imageAlt || ''}
                className="news-teaser-img"
              />
            ) : (
              <span className="news-teaser-small-placeholder" aria-hidden="true"></span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsTeaserSmall;
