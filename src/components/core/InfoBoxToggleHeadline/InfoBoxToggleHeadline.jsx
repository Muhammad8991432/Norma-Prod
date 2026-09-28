import React, { useId } from 'react';
import { appInfoBoxType } from '@utils/globalConstant';
import { buildGradientStyle } from '@utils/teaserGradient';
import './InfoBoxToggleHeadline.scss';
import { Badge } from '@core/Badge';
import { ButtonToggle } from '../ButtonToggle';

// NOTE: pass Icons colorType prop if light icons are also needed (used for high contrast mode)

export function InfoBoxToggleHeadline({
  badgeText,
  badgeIcon,
  badgeColorVariant,
  headline,
  copyText,
  labelColor = '',
  type = appInfoBoxType.TOGGLE,
  onToggleChange = () => { },
  value = false,
  cardCampaign = false,
  // Gradient / solid background props (used when cardCampaign = true)
  cardStyle = 'plain',      // "plain" | "gradient"
  bgColor1 = '',
  bgColor2 = '',
  linearGradient = 'leftToRight'
}) {
  const onToggleChangeHandler = (val) => {
    onToggleChange(val);
  };

  // Create unique IDs
  const headlineId = useId();
  const descriptionId = useId();

  // Compute gradient style when cardCampaign is active
  const gradientStyle = cardCampaign
    ? buildGradientStyle(cardStyle, bgColor1, bgColor2, linearGradient)
    : null;

  // Background: gradient (inline) > solid bgColor1 (inline) > mint class (default)
  const bgClass = cardCampaign && !gradientStyle && !bgColor1 ? '' : !cardCampaign ? 'bg-mint-80' : '';
  const bgInlineStyle = gradientStyle
    ? gradientStyle
    : cardCampaign && bgColor1
      ? { background: bgColor1 }
      : {};

  return (
    <div
      className={`d-flex flex-column ${type} ${bgClass} infobox-arrow px-4 py-4`}
      style={bgInlineStyle}
    >
      {badgeText && (
        <div className="mb-4">
          <Badge
            title={badgeText}
            icon={badgeIcon || 'likedarkgreen'}
            colorVariant={badgeColorVariant || 'white'}
          />
        </div>
      )}
      <div className="d-flex align-items-top">
        <div className="flex-grow-1 pe-3">
          {headline && (
            <div id={headlineId} className="info-headline pt-1">
              <h3 className="nc-doomsday-h5" style={labelColor ? { color: labelColor } : undefined}>{headline}</h3>
            </div>
          )}
          {copyText && (
            <div id={descriptionId} className="info-label" style={labelColor ? { color: labelColor } : undefined}>
              {copyText}
            </div>
          )}
        </div>

        {!cardCampaign && <div>
          <ButtonToggle
            onChange={onToggleChangeHandler}
            value={value}
            ariaLabelledby={headlineId}
            ariaDescribedby={descriptionId}
          />
        </div>}
      </div>
    </div>
  );
}

export default InfoBoxToggleHeadline;
