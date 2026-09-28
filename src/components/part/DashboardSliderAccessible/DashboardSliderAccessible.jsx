import React, { Children, cloneElement, isValidElement, useRef, useEffect, useState } from 'react';
import { Ta11yText } from '@core/index';
// import { Icons } from '@core/Utils';
import { useA11y } from '@context/Utils';
import { appKeyCode } from '@utils/globalConstant';
import './DashboardSliderAccessible.scss';

// latest version of this slider does not use arrow navigation anymore,
// but we keep this component for possible future use and for reference
// const SliderPreviousArrow = ({ onClick, ariaDisabled, className = '' }) => {
//   const { tA11yTranslate } = useA11y();

//   return (  
//     <button
//       type="button"
//       className={`custom-arrow custom-prev btn-reset-default-style ${className} ${
//         ariaDisabled ? 'disabled' : ''
//       }`}
//       onClick={onClick}
//       aria-label={tA11yTranslate('nc_global_slider_icn_left_aria').ariaLabel}
//       aria-disabled={ariaDisabled}
//     >
//       <Icons name="arrowleftcolor" width={24} height={24} colorType="dark" />
//     </button>
//   );
// };

// latest version of this slider does not use arrow navigation anymore,
// but we keep the function for possible future use and for reference
// const SliderNextArrow = ({ onClick, ariaDisabled, className = '' }) => {
//   const { tA11yTranslate } = useA11y();

//   return (
//     <button
//       type="button"
//       className={`custom-arrow custom-next btn-reset-default-style ${className}  ${
//         ariaDisabled ? 'disabled' : ''
//       }`}
//       onClick={onClick}
//       aria-label={tA11yTranslate('nc_global_slider_icn_right_aria').ariaLabel}
//       aria-disabled={ariaDisabled}
//     >
//       <Icons name="arrowrightcolor" width={24} height={24} colorType="dark" />
//     </button>
//   );
// };

const SliderHeadline = ({ headlineContent }) => (
  headlineContent && (
    <div className="w-100 pt-0 mb-4">
      <Ta11yText textContent={headlineContent} className="nc-doomsday-h4 m-0" tag="h2" />
    </div>
  )
);

// eslint-disable-next-line arrow-body-style
export const DashboardSliderAccessible = ({
  slidingComponents,
  headlineContent,
  sliderContent,  // contains aria label for slider
  slideContent,   // contains aria label for selected slide
  idPrefix = 'slider-one',
  className = '',
  measureOnResize = false,  // set true when using NewsTeaserSmall inside the slider
  setParentState = null  // optional function to pass current slide index to parent component
}) => {
  // Contexts
  const { tA11yTranslate } = useA11y();

  const sliderRef = useRef(null);
  const firstSlideRef = useRef(null);
  const dotsRef = useRef(null);
  const touchStartX = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [firstSlideWidth, setFirstSlideWidth] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      const { width: sliderItemsWidth } = sliderRef.current.getBoundingClientRect();
      setSliderWidth(sliderItemsWidth);
      const { width: firstSlideElementWidth } = firstSlideRef.current.getBoundingClientRect();
      setFirstSlideWidth(firstSlideElementWidth);
    }

    if (!measureOnResize) return undefined;

    // Only for NewsTeaserSmall usage: re-measure on every container resize
    // so the per-slide translateX stays correct across breakpoints.
    const measure = () => {
      if (sliderRef.current && firstSlideRef.current) {
        const { width: sliderItemsWidth } = sliderRef.current.getBoundingClientRect();
        setSliderWidth(sliderItemsWidth);
        const { width: firstSlideElementWidth } = firstSlideRef.current.getBoundingClientRect();
        setFirstSlideWidth(firstSlideElementWidth);
      }
    };

    const ro = new ResizeObserver(measure);
    if (sliderRef.current) ro.observe(sliderRef.current);

    return () => ro.disconnect();
  }, [measureOnResize]);

  // latest version of this slider does not use arrow navigation anymore,
  // but we keep the function for possible future use and for reference
  // const handleArrowClick = (direction) => {
  //   if (direction === 'next') {
  //     // Move to the next slide, but don't exceed the last slide
  //     setCurrentSlide((index) => Math.min(index + 1, slidingComponents.length - 1));
  //     // add setParentState to update parent component with current slide index
  //   } else if (direction === 'prev') {
  //     // Move to the previous slide, but don't go below the first slide
  //     setCurrentSlide((index) => Math.max(index - 1, 0));
  //     // add setParentState to update parent component with current slide index
  //   }
  // };

  const handleKeyDown = (e) => {
    const { keyCode } = e;

    if (keyCode === appKeyCode.ARROW_RIGHT) {
      setCurrentSlide((prev) => {
        const newIndex = (prev + 1) % slidingComponents.length;
        if (setParentState) setParentState(newIndex);
        return newIndex;
      });
    }
    if (keyCode === appKeyCode.ARROW_LEFT) {
      setCurrentSlide((prev) => {
        const newIndex = (prev - 1 + slidingComponents.length) % slidingComponents.length;
        if (setParentState) setParentState(newIndex);
        return newIndex;
      });
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    if (setParentState) setParentState(index);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) { // threshold for swipe
      if (deltaX > 0) {
        setCurrentSlide((prev) => {
          const newIndex = (prev - 1 + slidingComponents.length) % slidingComponents.length;
          if (setParentState) setParentState(newIndex);
          return newIndex;
        });
      } else {
        setCurrentSlide((prev) => {
          const newIndex = (prev + 1) % slidingComponents.length;
          if (setParentState) setParentState(newIndex);
          return newIndex;
        });
      }
    }
    touchStartX.current = null;
  };

  // we only have one component to render, so we don't need the slider
  if (slidingComponents?.length === 1) {
    const onlyChild = slidingComponents[0];
    return (
      <>
        <SliderHeadline headlineContent={headlineContent} />
        <div className="d-flex justify-content-center align-items-center mb-6">
          {isValidElement(onlyChild)
            ? cloneElement(onlyChild, {
              tabIndex: 0,
              active: -1,
              index: 0
            })
            : onlyChild}
        </div>
      </>
    );
  }

  return (
    <>
      <SliderHeadline headlineContent={headlineContent} />
      <div
        id={`${idPrefix}`}
        className={`dashboard-slider-accessible p-0 mb-4 ${className}`}
        // aria-roledescription="carousel"
        aria-label={`${sliderContent.hasAriaLabel ? sliderContent.ariaLabel : ''}`}
      >
        <div className="slider-inner">
          <div className="controls">
            {/* latest version of this slider does not use arrow navigation anymore,
            but we keep the implementation for possible future use and for reference */}
            {/* <SliderPreviousArrow
              aria-controls={`${idPrefix}-items`}
              ariaDisabled={currentSlide === 0}
              onClick={() => handleArrowClick('prev')}
            />
            <SliderNextArrow
              aria-controls={`${idPrefix}-items`}
              ariaDisabled={currentSlide === (slidingComponents.length - 1)}
              onClick={() => handleArrowClick('next')}
            /> */}

            {/* Dots navigation */}
            <ul className="slider-dots" ref={dotsRef}>
              {slidingComponents.map((_, index) => (
                <li
                  key={`dot-${index}`}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-hidden
                />
              ))}
            </ul>
          </div>

          <ul
            className="slider-items"
            style={{ transform: `translateX(calc(50% - ${firstSlideWidth / 2}px))` }}
            id={`${idPrefix}-items`}
            ref={sliderRef}
            role="listbox"
            tabIndex="0"
            aria-activedescendant={`${idPrefix}-${currentSlide}`}
            // aria-live="off"
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {Children.map(slidingComponents, (child, index) => {
              if (isValidElement(child)) {
                return (
                  <li
                    ref={index === 0 ? firstSlideRef : null}
                    key={`${idPrefix}-${index}`}
                    id={`${idPrefix}-${index}`}
                    className={`slider-item ${index === currentSlide ? 'active' : ''}`}
                    role="option"
                    aria-selected={currentSlide === index}
                    // aria-label={`${slideContent.hasAriaLabel ? slideContent.ariaLabel : ''} ${
                    //   index + 1
                    // } ${tA11yTranslate('nc_global_slider_index-of_txt').ariaLabel} ${
                    //   slidingComponents.length
                    // }`}
                    style={{
                      transform: `translateX(-${currentSlide * firstSlideWidth}px)`, // Adjust for active card position
                      transition: 'transform 0.5s ease'
                    }}
                  >
                    {cloneElement(child, {
                      active: index === currentSlide ? 0 : -1,
                      tabIndex: index === currentSlide ? 0 : -1,
                      index
                    })}
                  </li>
                );
              }
              return null;
            })}
          </ul>

        </div>

      </div>
    </>
  );
}

export default DashboardSliderAccessible;
