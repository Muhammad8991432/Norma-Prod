/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import { Ta11yText, Ta11yImage, Link, ButtonPrimary, Icons } from '@core/index';
import {
  appButtonTypes,
  appLinkStyle,
  getDataExpiryTime,
  isExternalLink
} from '@utils/globalConstant';
import useCmsImage from '@utils/useCmsImage';
import { useLocation, useNavigate } from 'react-router-dom';
import { replaceDynamicCmsContent, tA11y } from '@utils/a11y/a11yHelpers';
import { useA11y, useLayout } from '@context/Utils';
import './PopupCampaignCard.scss';
import { handleModalFocusTrap } from '@utils/a11y/focusHelpers';
import { useOption, useTariff } from '@context/MobileOne';

export const PopupCampaignCard = ({
  data,
  onCardClose,
  isActive = true,
  hasFocusTrap = true,
  firstHeadlineIdSuffix = '', // used in PopupCampaignSliderAccessible
  lastSliderCardAriaLabel = null, // used if is last card in PopupCampaignSliderAccessible
  isLastPopupCampaignCardInSlider = false
}) => {
  // Context
  const navigate = useNavigate();
  const { setShowHeader, setShowFooter } = useLayout();
  const cardRef = useRef(null);
  const focusHeadingRef = useRef(null);
  const { selectedTariff, selectedSpeedOn, selectedBookableOption, selectedAdditionalOption } =
    useTariff();
  const { showCancelModal } = useOption();
  const { tA11yTranslate } = useA11y();
  const { pathname } = useLocation();

  // State
  const [dynamicContent, setDynamicContent] = useState(null);

  useEffect(() => {
    if (pathname.includes('/tariff/change')) {
      setDynamicContent({
        pattern: '{AMOUNT}',
        replacement: tA11yTranslate(selectedTariff?.price)?.content
      });
    } else if (pathname.includes('/additional-option/book')) {
      setDynamicContent({
        pattern: '{AMOUNT}',
        replacement: selectedAdditionalOption?.price?.formattedValue
      });
    } else if (pathname.includes('/passoffer/book')) {
      setDynamicContent({
        pattern: '{AMOUNT}',
        replacement: selectedSpeedOn?.price?.formattedValue
      });
    } else if (pathname.includes('/option/book')) {
      setDynamicContent({ pattern: '{AMOUNT}', replacement: selectedBookableOption?.price });
    }
  }, []);

  // Constants
  // const imageHeight = '184px';
  const closeIconAriaLabel = tA11yTranslate('nc_global_icn_close_aria').ariaLabel;

  let hasContentFocus = false;

  // Functions
  const handleClick = (url) => {
    if (typeof url === 'function') {
      return url();
    }
    if (isExternalLink(url)) {
      return window.open(url, '_blank');
    }
    setShowHeader(true);
    setShowFooter(true);
    navigate(url);
    return url;
  };

  // Handle modal focus trap only for this single card
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && hasFocusTrap) {
      handleModalFocusTrap(e, cardRef);
    }
  };

  // Hooks
  useEffect(() => {
    // The focus should be set either to the first heading or the first focusable element
    if (isActive && cardRef.current) {
      cardRef.current.classList.add('animate__animated', 'animate__fadeInUp', 'animate__fast');
      const focusableElements = cardRef.current.querySelectorAll(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      // The keyboard focus should be set to the first heading if available
      if (focusHeadingRef.current) {
        focusHeadingRef.current.focus();
      }
      // or otherwise to the first focusable element.
      else if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getCopyContent = (text) => {
    if (dynamicContent) {
      return replaceDynamicCmsContent(
        tA11yTranslate(text),
        dynamicContent.pattern,
        dynamicContent.replacement
      );
    }
    return tA11yTranslate(text);
  };

  const getHeadlineText = (text) => {
    if (showCancelModal) {
      let headlineText = tA11yTranslate(text);
      headlineText = replaceDynamicCmsContent(
        headlineText,
        '{OPTIONNAME}',
        `${showCancelModal.name || ''}`
      );
      const { expiryDate } = getDataExpiryTime(
        showCancelModal.endDateTime || showCancelModal.endDate
      );
      headlineText = replaceDynamicCmsContent(headlineText, '{ENDDATE}', expiryDate);
      return headlineText;
    }
    return tA11yTranslate(text);
  };

  const renderContent = (element, index) => {
    let firstHeadingId = '';
    switch (element.type) {
      case 'headline':
        if (firstHeadlineIdSuffix && !hasContentFocus) {
          hasContentFocus = true;
          firstHeadingId = `content-focus-${firstHeadlineIdSuffix}`;
        }
        return (
          <div className="mt-6 pe-4" key={index}>
            <Ta11yText
              textContent={getHeadlineText(element.txt)}
              tag={element?.tag ? element.tag : 'h3'}
              className={`nc-doomsday-h3 text-left ${firstHeadingId !== '' ? 'popup-campaign-focus-heading' : ''
                }`}
              id={firstHeadingId}
              tabIndex={firstHeadingId !== '' ? -1 : undefined}
              ref={firstHeadingId !== '' ? focusHeadingRef : null}
            />
          </div>
        );

      case 'copy':
        return (
          <div className="mt-6 pe-4" key={index}>
            <Ta11yText
              textContent={getCopyContent(element.txt)}
              tag={element?.tag ? element.tag : 'p'}
              className="nc-realtextpro-copy text-left"
            />
          </div>
        );

      case 'footnote':
        return (
          <div className="mt-6 pe-4" key={index}>
            <Ta11yText
              textContent={tA11y(element.txt)}
              className="nc-realtextpro-footnote"
              tag={element.tag || 'p'}
            />
          </div>
        );

      case 'iconCopy':
        return (
          <div className="mt-6 pe-4" key={index}>
            <div className="d-flex align-items-center">
              <Icons name={element.iconSourceWeb || 'checkcirclemint'} width={24} height={24} colorType="primary" />
              <Ta11yText
                textContent={getCopyContent(element.txt)}
                tag={element?.tag ? element.tag : 'p'}
                className="nc-realtextpro-copy ms-2"
              />
            </div>
          </div>
        );

      case 'image': {
        const cmsImage = useCmsImage(element.imageWeb || element.imageSource);
        return (
          <div
            className={`w-100 popup-campaign-image-wrapper${
              index === 0 && !data.imageSource ? '' : ' mt-6'
            } text-center${cmsImage?.is_responsive_image === 'False' ? ' mt-6' : ' is-responsive-cms-image'}`}
            style={
              cmsImage?.is_responsive_image === 'False'
                ? { height: '64px' }
                : { height: `${cmsImage?.responsive_image?.basic_height}px` }
            }
            key={index}
          >
            <Ta11yImage
              imageContent={cmsImage}
              className="popup-campaign-image z-2"
              noImgFluid={!(cmsImage?.is_responsive_image === 'False')}
              style={
                cmsImage?.is_responsive_image === 'False'
                  ? { height: '64px' }
                  : {
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      height: `${cmsImage?.responsive_image?.basic_height}px`,
                      width: 'auto'
                    }
              }
            />
          </div>
        );
      }

      case 'button': {
        return (
          <div className="mt-6 px-4" key={index}>
            <ButtonPrimary
              buttonType={appButtonTypes.PRIMARY[element?.variantWeb || 'DEFAULT']}
              buttonContent={tA11y(element.buttonTitle)}
              onClick={() => handleClick(element.redirectionLinkWeb)}
              icon={element.buttonIconWeb}
            />
          </div>
        );
      }

      case 'link':
        if (element.action) {
          return (
            <div className="mt-6 text-center px-4" key={index}>
              <button
                type="button"
                className={`btn-reset-default-style nc-link ${appLinkStyle.PRIMARY} nc-link-doomsday border-0 bg-transparent d-inline-block`}
                onClick={() => onCardClose(data.id)}>
                <span className="d-flex align-items-center justify-content-start">
                  <Icons
                    name="closecolor"
                    colorType="dark" // for high contrast mode
                    className="link-icon pe-3"
                    height={16}
                  />
                  <Ta11yText textContent={tA11y(element.txt)} tag="span" />
                </span>
              </button>
            </div>
          );
        }
        return (
          <div className="mt-6 text-center" key={index}>
            <Link
              onClick={() => {
                if (element.action) {
                  onCardClose(data.id);
                } else {
                  handleClick(element.redirectionLinkWeb);
                }
              }}
              {...(element.action
                ? { iconLeft: 'closecolor' }
                : {
                    iconLeft: element.iconVariant === "iconLeft" ? element.iconSourceWeb : null,
                    iconRight: element.iconVariant === "iconRight" ? element.iconSourceWeb : null
                }
              )}
              iconColorType="dark" // for high contrast mode
              linkStyle={appLinkStyle.PRIMARY}>
              <Ta11yText textContent={tA11y(element.txt)} tag="span" />
            </Link>
          </div>
        );

      case 'customButtonComponent':
        return (
          <div className="mt-6 px-4" key={index}>
            {element.customButtonComponent}
          </div>
        );
      default:
        return null;
    }
  };

  const renderPopupCard = () => (
    <div
      className={`position-relative ${
        isLastPopupCampaignCardInSlider ? 'popup-slider-last-popup' : ''
      } popup-campaign-wrapper bg-white rounded-24 pt-8 pb-12 ps-6 pe-0`}
      id={data.id}
      ref={cardRef}>
      {data.topClose && (
        <div className="position-absolute z-3 top-0 end-0 me-2 mt-2">
          <div className="bg-white p-4 border-0 rounded-circle">
            <button
              type="button"
              className={`btn-reset-default-style nc-link ${appLinkStyle.PRIMARY} nc-link-doomsday border-0 rounded-circle bg-white d-inline-block`}
              aria-label={closeIconAriaLabel}
              onClick={() => onCardClose(data.id)}>
              <Icons
                name="closecolor"
                colorType="dark" // for high contrast mode
                width={24}
                height={24}
                alt={tA11yTranslate('nc_popup_close').content}
              />
            </button>
          </div>
        </div>
      )}
      <div className="popup-campaign-scroll pe-6">{data.content.map(renderContent)}</div>
    </div>
  );

  return lastSliderCardAriaLabel ? (
    <div
      className="slider-item active"
      role="group"
      aria-roledescription="slide"
      aria-label={
        `${lastSliderCardAriaLabel && lastSliderCardAriaLabel.hasAriaLabel
          ? lastSliderCardAriaLabel.ariaLabel
          : ''
        } 1 ${tA11yTranslate('nc_global_slider_index-of_txt').ariaLabel} 1` // 1 of 1
      }>
      {renderPopupCard()}
    </div>
  ) : (
    renderPopupCard()
  );
};

export default PopupCampaignCard;
