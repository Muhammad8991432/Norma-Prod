import React, { useRef, useEffect, useState } from 'react';
import { useA11y } from '@context/Utils/A11y';
import { handleModalFocusTrapPopupSlider } from '@utils/a11y/focusHelpers';
import { Icons } from '@core/Utils';
import { PopupCampaignCard } from '@core/index';
import './PopupCampaignSliderAccessible.scss';

const SliderPreviousArrow = ({ onClick, ariaDisabled, className = '' }) => {
  const { tA11yTranslate } = useA11y();

  return (  
    <button
      type="button"
      className={`custom-arrow custom-prev btn-reset-default-style ${className} ${
        ariaDisabled ? 'disabled' : ''
      }`}
      onClick={onClick}
      aria-label={tA11yTranslate('nc_global_slider_icn_left_aria').ariaLabel}
      aria-disabled={ariaDisabled}
    >
      <Icons name="arrowleftcolor" width={24} height={24} colorType="dark" />
    </button>
  );
};

const SliderNextArrow = ({ onClick, ariaDisabled, className = '' }) => {
  const { tA11yTranslate } = useA11y();

  return (
    <button
      type="button"
      className={`custom-arrow custom-next btn-reset-default-style ${className}  ${
        ariaDisabled ? 'disabled' : ''
      }`}
      onClick={onClick}
      aria-label={tA11yTranslate('nc_global_slider_icn_right_aria').ariaLabel}
      aria-disabled={ariaDisabled}
    >
      <Icons name="arrowrightcolor" width={24} height={24} colorType="dark" />
    </button>
  );
};

export const PopupCampaignSliderAccessible = ({
  slidesData,
  updateSlidesData,
  hidePopup,
  sliderContent = null,  // contains aria label for slider
  slideContent = null,   // contains aria label for selected slide
  idPrefix = 'popup-slider-one'
}) => {
  // Contexts
  const { tA11yTranslate } = useA11y();

  const sliderRef = useRef(null);
  const firstSlideRef = useRef(null);
  const dotsRef = useRef(null);
  const touchStartX = useRef(null);
  const isFirstRender = useRef(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [firstSlideWidth, setFirstSlideWidth] = useState(0);

  // Handle modal focus trap
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      handleModalFocusTrapPopupSlider(e, sliderRef);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      const { width: sliderItemsWidth } = sliderRef.current.getBoundingClientRect();
      setSliderWidth(sliderItemsWidth);
      const { width: firstSlideElementWidth } = firstSlideRef.current.getBoundingClientRect();
      setFirstSlideWidth(firstSlideElementWidth);

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  // const handleFocusOnSlideChange = (newIndex) => {
  const handleFocusOnSlideChange = (newIndex, slideDeleted = false) => {
    let activeSlideHeadingId = '';
    let activeSlideHeadingElement = null;
    const slideInfoElement = document.createElement('span');
    // let headingAriaLabel = '';
    if (sliderRef.current) {
      activeSlideHeadingId = `content-focus-first-headline-${newIndex}`;
      activeSlideHeadingElement = sliderRef.current.querySelector(`#${activeSlideHeadingId}`);
      if (slideDeleted) {
        slideInfoElement.innerText = `${
          slideContent && slideContent.hasAriaLabel ? slideContent.ariaLabel : ''
        } ${newIndex + 1} ${tA11yTranslate('nc_global_slider_index-of_txt').ariaLabel} ${
          slidesData.length
        }`;
        slideInfoElement.tabIndex = -1; // Make it focusable
        slideInfoElement.className = 'visually-hidden'; // Add a class for screen readers
        activeSlideHeadingElement.after(slideInfoElement);
      }
    }
    // The keyboard focus should be set to the first heading if available
    if (activeSlideHeadingElement) {
      activeSlideHeadingElement.focus();
      if (slideDeleted) {
        setTimeout(() => {
          slideInfoElement.focus();
        }, 100); // Delay to ensure focus is set correctly
      }
    }
    // or otherwise to the first focusable element if available.
    else {
      const focusableElements = sliderRef.current.querySelectorAll(
        '.active a[href], .active button, .active textarea, .active input, .active select, .active [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  };

  const handleArrowClick = (direction) => {
    if (direction === 'next') {
      // Move to the next slide, but don't exceed the last slide
      setCurrentSlide((index) => Math.min(index + 1, slidesData.length - 1));
    } else if (direction === 'prev') {
      // Move to the previous slide, but don't go below the first slide
      setCurrentSlide((index) => Math.max(index - 1, 0));
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      // threshold for swipe
      if (deltaX > 0) {
        handleArrowClick('prev');
      } else {
        handleArrowClick('next');
      }
    }
    touchStartX.current = null;
  };

  const handleCardClose = (id) => {
    if (slidesData.length > 1) {
      if (currentSlide === slidesData.length - 1 && slidesData.length > 2) {
        isFirstRender.current = true;
        handleArrowClick('prev');
      }
      const updatedPopupData = slidesData.filter((card) => card.id !== id);
      updateSlidesData(updatedPopupData);
    } else {
      hidePopup();
    }
  };

  // useEffect(() => {
  //   setTimeout(() => handleFocusOnSlideChange(currentSlide), 300);
  // }, [currentSlide, slidesData]);

  useEffect(() => {
    setTimeout(() => handleFocusOnSlideChange(currentSlide), 300);
  }, [currentSlide]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      setTimeout(() => handleFocusOnSlideChange(currentSlide, true), 300);
    }
  }, [slidesData]);

  // Listen for window resize events and recalculate sliderWidth and firstSlideWidth dynamically
  useEffect(() => {
    const updateDimensions = () => {
      if (sliderRef.current && firstSlideRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
        setFirstSlideWidth(firstSlideRef.current.offsetWidth);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <>
      <section
        id={`${idPrefix}`}
        className="popup-slider-accessible p-0 mb-4"
        aria-roledescription="carousel"
        aria-label={`${
          sliderContent && sliderContent.hasAriaLabel ? sliderContent.ariaLabel : ''
        }`}>
        <div className="slider-inner pt-6" style={{ overflow: 'hidden' }} ref={sliderRef}>
          <div
            className="slider-items"
            style={{
              left: `${sliderWidth / 2}px - ${firstSlideWidth / 2}px))`,
              width: `calc(${slidesData.length} * ${sliderWidth}px`
            }}
            id={`${idPrefix}-items`}
            aria-live="off"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>
            {slidesData.map((card, index) => (
              <div
                ref={index === 0 ? firstSlideRef : null}
                key={`${idPrefix}-${index}`}
                className={`slider-item ${index === currentSlide ? 'active' : 'inactive'}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${
                  slideContent && slideContent.hasAriaLabel ? slideContent.ariaLabel : ''
                } ${index + 1} ${tA11yTranslate('nc_global_slider_index-of_txt').ariaLabel} ${
                  slidesData.length
                }`}
                style={{
                  transform: `translateX(-${currentSlide * sliderWidth}px)`, // Adjust for active card position
                  transition: 'transform 0.5s ease'
                }}>
                <PopupCampaignCard
                  data={card}
                  onCardClose={handleCardClose}
                  isActive={index === currentSlide}
                  // this is needed to include the arrow navigation in the focus order
                  hasFocusTrap={false}
                  firstHeadlineIdSuffix={`first-headline-${index}`}
                />
              </div>
            ))}
          </div>

          <div className="controls mt-6">
            <SliderPreviousArrow
              aria-controls={`${idPrefix}-items`}
              ariaDisabled={currentSlide === 0}
              onClick={() => handleArrowClick('prev')}
            />
            <SliderNextArrow
              aria-controls={`${idPrefix}-items`}
              ariaDisabled={currentSlide === slidesData.length - 1}
              onClick={() => handleArrowClick('next')}
            />
            {/* Dots navigation */}
            <ul className="slider-dots" ref={dotsRef}>
              {slidesData.map((_, index) => (
                <li
                  key={`dot-${index}`}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-hidden // NEW
                />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default PopupCampaignSliderAccessible;
