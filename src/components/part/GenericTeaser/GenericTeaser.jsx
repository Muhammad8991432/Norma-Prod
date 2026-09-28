import React, { useEffect, useState } from 'react';
import { appKeyCode, isExternalLink } from '@utils/globalConstant';
import { useNavigate } from 'react-router-dom';
import { ButtonSecondary, Ta11yImage, Ta11yText } from '@core/index';
import useCmsImage from '@utils/useCmsImage';
import './GenericTeaser.scss';

export function GenericTeaser({
  heading,
  textColor,
  linkText,
  linkUrl,
  bgColor1 = '',
  bgColor2 = '',
  imageRef,
  customClass = '',
  active = -1,  // -1 means not active, 0 means active, for card focus management (single card vs. multiple cards)
  tabIndex = -1 // -1 means not active, 0 means active, for link focus management
}) {
  // Context
  const navigate = useNavigate();

  // States
  const [bgColor, setBgColor] = useState('');

  // Hooks
  useEffect(() => {
    if (bgColor1 && bgColor2) {
      setBgColor(`linear-gradient(68deg, ${bgColor1} 0%, ${bgColor2} 82.85%)`);
    } else {
      setBgColor(bgColor1);
    }
  }, [bgColor1, bgColor2]);

  // Functions
  const handleClick = (url) => {
    if (isExternalLink(url)) {
      return window.open(url, '_blank');
    }
    navigate(url);
    return url;
  };

  // not used in last version of this card, as the whole card should not be 
  // clickable anymore, but only the link at the bottom (according to MMS)
  // const handleKeyDown = (event) => {
  //   const { keyCode } = event;
  //   if (keyCode === appKeyCode.SPACE || keyCode === appKeyCode.ENTER) {
  //     handleClick(linkUrl);
  //   }	
  // };

  return (
    <div
      style={{ background: bgColor }}

      // Variant a)
      // Card remains focusable and is highlighted by focus ring after
      // first tab, second tab will focus the link at the bottom
      // As consequence we need two tabs back to the ul list to change the slides.

      // className={`generic-teaser d-flex rounded-3 mb-4 animate__animated animate__fadeInUp ${customClass}`}
      // tabIndex={active}

      // Variant b)
      // Card is not focusable anymore, but the link at the bottom is focusable
      // in one tab step. The whole card is not clickable anymore.
      // The current active card always shows a focus ring (like tariff slider), also
      // immediately after page load.
      // Because of the first usage of active to control the tabindex we have this logic:
      // active with value 0 (zero) means active card
      // active with value -1 means non-active card

      className={
        `generic-teaser d-flex rounded-3 mb-4 
         animate__animated animate__fadeInUp ${
            customClass
          } ${
            active ? '' : 'active'
          }
        `}

      // not used in last version of this card, as the whole card should not be 
      // clickable anymore, but only the link at the bottom (according to MMS)
      // onClick={() => handleClick(linkUrl)}
      // onKeyDown={handleKeyDown}
      // role="link"

    >
      <div className="position-relative w-100">
        <div className="generic-teaser-content h-100 d-flex flex-column justify-content-between align-items-start py-6 ps-6">
          <div className="w-100 z-1">
            {heading && (
              <span style={{ color: textColor }}>
                <Ta11yText textContent={heading} className="nc-doomsday-h3 text-left m-0" tag="h3" />
              </span>
            )}
          </div>
          <div className="mb-n2 z-1">
            <ButtonSecondary
              role="link"
              buttonContent={linkText}
              onClick={() => handleClick(linkUrl)}
              teaserTextColor={textColor}
              tabIndex={tabIndex}
            />
            {/* not used in last version of this card, as the whole card should not be 
            clickable anymore, but only the link at the bottom (according to MMS) */}
            {/* <div className="btn btn-secondary-as-text btn-default teaser-link">
              <span className="teaser-card-link text-start" style={{ color: textColor }}>
                <span className="nc-icon-forward" />
                <span>{linkText.content}</span>
              </span>
            </div> */}
          </div>
        </div>
        <Ta11yImage
          className="generic-teaser-img rounded-3 position-absolute bottom-0 end-0"
          imageContent={useCmsImage(imageRef)}
        />
      </div>
    </div>
  );
}

export default GenericTeaser;
