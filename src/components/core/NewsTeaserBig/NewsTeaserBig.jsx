import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, ButtonSecondary, Ta11yText } from '@core/index';
import { appButtonTypes, isExternalLink } from '@utils/globalConstant';
import './NewsTeaserBig.scss';
import useCmsImage from '@utils/useCmsImage';
import { buildGradientStyle } from '@utils/teaserGradient';
import { useA11y } from '@context/Utils';

const TYPE_CONFIG = {
  green: { contentClass: 'bg-darkgreen text-white', buttonType: appButtonTypes.SECONDARY.MINT, icon: 'forwardmint' },
  mint: { contentClass: 'bg-mint-100 text-white', buttonType: appButtonTypes.SECONDARY.LIGHT, icon: 'forward' },
  white: { contentClass: 'bg-white bg-opacity-50 text-darkgreen', buttonType: appButtonTypes.SECONDARY.DEFAULT, icon: 'forwarddark' },
  yellow: { contentClass: 'bg-yellow-100 text-darkgreen', buttonType: appButtonTypes.SECONDARY.DEFAULT, icon: 'forwarddark' },
  red: { contentClass: 'bg-red text-white', buttonType: appButtonTypes.SECONDARY.LIGHT, icon: 'forward' },
};

export function NewsTeaserBig({
  type = 'green',
  imageSrc = '',
  imageAlt = '',
  hasChip = false,
  chipTitle = '',
  chipTitleColor = '',
  headline = '',
  description = '',
  teaserTextColor,
  buttonText = 'Button secondary',
  buttonHref = '',
  onButtonClick,
  className = '',
  badgeColor = 'mint',
  active = -1,  // -1 = not active (no border), 0 = active (show focus border)
  tabIndex = -1, // -1 = not tabbable (non-active slide), 0 = tabbable (active slide)
  chipIcon = 'likedarkgreen',
  // Gradient / style props from CMS data
  teaserStyle = 'plain',  // "plain" | "gradient"
  bgColor1 = '',
  bgColor2 = '',
  linearGradient = 'leftToRight'
}) {
  const { tA11yTranslate } = useA11y();
  const navigate = useNavigate();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.green;

  // Compute gradient inline style — same logic as NewsTeaserSmall
  const gradientStyle = buildGradientStyle(teaserStyle, bgColor1, bgColor2, linearGradient);

  const useGradient = Boolean(gradientStyle);

  const handleButtonClick = () => {
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
    <article className={`news-teaser-big rounded-3 overflow-hidden shadow-mps ${useGradient ? '' : config.contentClass} ${className} ${active === 0 ? 'active' : ''}`} style={gradientStyle || undefined}>
      <div className="news-teaser-big-image-wrapper position-relative">
        <div className="news-teaser-big-image">
          {imageSrc ? (
            <img src={useCmsImage(imageSrc)?.media_url_display} alt={imageAlt || ''} className="h-100 object-fit-cover" />
          ) : (
            <div className="news-teaser-big-placeholder" aria-hidden="true" />
          )}
        </div>
        {hasChip && (
          <div className="news-teaser-big-badge position-absolute top-0 start-0 m-5">
            <Badge
              title={(chipTitle)}
              colorVariant={badgeColor || 'mint'}
              icon={chipIcon || undefined}
              textAndIconColor={chipTitleColor || '#074D52'}
            />
          </div>
        )}
      </div>
      <div
        className={`news-teaser-big-content p-4 d-flex flex-column gap-3 ${useGradient ? 'text-white' : config.contentClass}`}
      >
        <Ta11yText
          textContent={tA11yTranslate(headline)}
          tag="h3"
          style={{ color: teaserTextColor || '#fff' }}
          className="nc-doomsday-h3 mb-0"
        />
        <Ta11yText
          textContent={tA11yTranslate(description)}
          tag="p"
          style={{ color: teaserTextColor || '#fff' }}
          className="nc-realtextpro-fillin small opacity-75 mb-0"
        />
        <div className="mt-auto news-teaser-big-button">
          <ButtonSecondary
            label={buttonText}
            buttonContent={tA11yTranslate(buttonText)}
            type={useGradient ? appButtonTypes.SECONDARY.LIGHT : config.buttonType}
            icon={useGradient ? 'forward' : config.icon}
            iconColorType="dark"
            onClick={handleButtonClick}
            tabIndex={tabIndex}
          />
        </div>
      </div>
    </article>
  );
}

export default NewsTeaserBig;
