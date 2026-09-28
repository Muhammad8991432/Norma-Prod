import React, { useRef, useEffect, useState } from 'react';
import { useA11y } from '@context/Utils';
import './OptionSliderAccessible.scss';

// new slider component for OptionOverview.jsx

export const OptionSliderAccessible = ({
  sliderId,
  optionsData,
  onSlideChange,
  dotsRef,
  sliderRef,
  children
}) => {
  const [slideWidth, setSlideWidth] = useState(0);
  const { tA11yTranslate } = useA11y();
  const touchStartX = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Dynamically measure slide width
    if (sliderRef.current) {
      const firstSlide = sliderRef.current.querySelector('.bfsg-slide');
      if (firstSlide) {
        const computedStyles = window.getComputedStyle(firstSlide);
        const width = parseFloat(computedStyles.width); // includes bfsg-card-wrapper padding
        const gap = parseInt(computedStyles.marginRight, 10) || 0;
        setSlideWidth(width + gap);
      }
    }
  }, [optionsData]);

  // Trigger `onSlideChange` in a `useEffect` to avoid calling it during render
  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentSlide);
    }
  }, [currentSlide, onSlideChange]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      // updateSlide((prev) => (prev + 1) % children.length); // Move to the next slide
      setCurrentSlide((prev) => (prev + 1) % children.length);
    } else if (e.key === 'ArrowLeft') {
      // updateSlide((prev) => (prev - 1 + children.length) % children.length); // Move to the previous slide
      setCurrentSlide((prev) => (prev - 1 + children.length) % children.length);
    }
  };

  const handleCardClick = (index) => {
    // updateSlide(index);
    setCurrentSlide(index);
  };

  // Swipe functionality for touch devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    // Threshold for swipe detection
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // updateSlide((prev) => (prev - 1 + children.length) % children.length);
        setCurrentSlide((prev) => (prev - 1 + children.length) % children.length);
      } else {
        // updateSlide((prev) => (prev + 1) % children.length);
        setCurrentSlide((prev) => (prev + 1) % children.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="bfsg-option-slider">
      {/* Dots navigation */}
      <ul className="bfsg-slider-dots" ref={dotsRef}>
        {optionsData.map((_, index) => (
          <li
            id={`${sliderId}-dot-${index}`}
            key={`${sliderId}-dot-${index}`}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            aria-label={`${tA11yTranslate('nc_slider-options_active-index_aria').ariaLabel} ${
              index + 1
            }`}
            aria-selected={currentSlide === index}
            onClick={() => handleCardClick(index)}
            aria-hidden={true}
          />
        ))}
      </ul>
      {/* Slides */}
      <div className="bfsg-slider-list">
        <ul
          ref={sliderRef}
          role="listbox"
          aria-label={tA11yTranslate('nc_slider-options_list_aria').ariaLabel}
          tabIndex="0"
          aria-activedescendant={`${sliderId}-option-item-${currentSlide}`}
          className="bfsg-slider-track"
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart} // Swipe functionality for touch devices
          onTouchEnd={handleTouchEnd} // Swipe functionality for touch devices
        >
          {React.Children.map(children, (child, index) => (
            <li
              className="slider-item"
              key={`${sliderId}-option-item-${index}`}
              id={`${sliderId}-option-item-${index}`}
              role="option"
              aria-selected={currentSlide === index}
              onClick={() => handleCardClick(index)}
              style={{
                transform: `translateX(-${currentSlide * slideWidth}px)`, // Adjust for active card position
                transition: 'transform 0.5s ease'
              }}>
              <div className={`bfsg-slide ${currentSlide === index ? 'active' : ''}`}>
                <div>
                  <div className="bfsg-card-wrapper">
                    {/* Render children directly */}
                    {child}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OptionSliderAccessible;
