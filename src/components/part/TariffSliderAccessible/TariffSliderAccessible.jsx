import React, { useRef, useEffect, useState } from 'react';
import { useA11y } from '@context/Utils';
import { TariffCard } from '@part/TariffCard';
import { Link } from '@core/index';
import { appLinkStyle } from '@utils/globalConstant';
import './TariffSliderAccessible.scss';

export const TariffSliderAccessible = ({
  bookableTariffs,
  bookableTariffsEtcOne,
  setTariffActivationForm,
  pdfLinks = []
}) => {
  const dotsRef = useRef(null);
  const sliderRef = useRef(null);
  const touchStartX = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const { tA11yTranslate } = useA11y();

  // Reset to first slide when bookableTariffs changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [bookableTariffs]);

  useEffect(() => {
    // Dynamically measure slide width
    if (sliderRef.current) {
      const firstSlide = sliderRef.current.querySelector('.bfsg-tariff-slide');
      if (firstSlide) {
        const computedStyles = window.getComputedStyle(firstSlide);
        const width = parseFloat(computedStyles.width); // includes bfsg-card-wrapper padding
        const gap = parseInt(computedStyles.marginRight, 10) || 0;
        setSlideWidth(width + gap);
      }
    }
  }, [bookableTariffs]);

  useEffect(() => {
    if (bookableTariffs && bookableTariffs.length > 0) {
      const {
        id = 0,
        name = '',
        nameSpeed = '',
        currentPrice = '',
        additionalInfo: { primaryColor } = { primaryColor: '' }
      } = bookableTariffs[currentSlide];
      const { price: currentAmount = 0 } =
        bookableTariffsEtcOne.find((tariff) => tariff.id === id) || {};
      setTariffActivationForm({
        chosenTariffId: id,
        chosenTariffName: name,
        chosenTariffSpeed: nameSpeed,
        tariffColor: primaryColor,
        tariffPrice: currentPrice,
        tariffAmount: currentAmount,
        tariffAmountAsStr: currentAmount.toString()
      });
    }
  }, [currentSlide]);

  const handleCardClick = (index) => {
    setCurrentSlide(index); // Set the clicked slide as the current slide
  };

  const handleArrowClick = (direction) => {
    if (direction === 'next') {
      setCurrentSlide((prev) => Math.min(prev + 1, bookableTariffs.length - 1)); // Move to the next slide, but don't exceed the last slide
    } else if (direction === 'prev') {
      setCurrentSlide((prev) => Math.max(prev - 1, 0)); // Move to the previous slide, but don't go below the first slide
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      setCurrentSlide((prev) => (prev + 1) % bookableTariffs.length); // Move to the next slide
    } else if (e.key === 'ArrowLeft') {
      setCurrentSlide((prev) => (prev - 1 + bookableTariffs.length) % bookableTariffs.length); // Move to the previous slide
    }
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
      // Infinite swiping
      if (deltaX > 0) {
        // Swipe right
        setCurrentSlide((prev) => (prev - 1 + bookableTariffs.length) % bookableTariffs.length);
      } else {
        // Swipe left
        setCurrentSlide((prev) => (prev + 1) % bookableTariffs.length);
      }

      // Limit swiping to the first and last slide
      // setCurrentSlide((prev) => {
      //   if (deltaX > 0) {
      //     // Swipe right
      //     return prev > 0 ? prev - 1 : prev;
      //     // Swipe left
      //     return prev < bookableTariffs.length - 1 ? prev + 1 : prev;
      //   }
      // });
    }
    touchStartX.current = null;
  };

  if (bookableTariffs.length === 1) {
    const tariff = bookableTariffs[0];
    const pdf = pdfLinks.find((p) => p.tariffID === tariff.id);
    
    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <TariffCard {...tariff} visibleShortCard={false} sizeVariant="large" />

        {/* PDF link for single tariff */}
        {pdf && (
          <div className="bfsg-pdf-link d-flex justify-content-center pt-4 pb-4">
            <Link
              linkStyle={appLinkStyle.PRIMARY}
              href={pdf.redirectionURL}
              label={tA11yTranslate(pdf.name).content}
              iconLeft="docsdark"
            />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="bfsg-tariff-slider pb-4">
      {/* Dots navigation */}
      <ul className="bfsg-slider-dots" ref={dotsRef}>
        {bookableTariffs.map((_, index) => (
          <li
            key={`dot-${index}`}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            aria-label={`${tA11yTranslate('nc_slider-tariff_active-index_aria').ariaLabel} ${
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
          aria-label={tA11yTranslate('nc_slider-tariff_list_aria').ariaLabel}
          tabIndex="0"
          aria-activedescendant={`tariff-activation-product-${currentSlide}`}
          className="bfsg-slider-track"
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart} // Swipe functionality for touch devices
          onTouchEnd={handleTouchEnd} // Swipe functionality for touch devices
        >
          {bookableTariffs.map((tariff, index) => {
            const pdf = pdfLinks.find((p) => p.tariffID === tariff.id);
            
            return (
              <li
                className="slider-item"
                key={`tariff-activation-product-${tariff.id}`}
                id={`tariff-activation-product-${index}`}
                role="option"
                aria-selected={currentSlide === index}
                onClick={() => handleCardClick(index)}
                style={{
                  transform: `translateX(-${currentSlide * slideWidth}px)`, // Adjust for active card position
                  transition: 'transform 0.5s ease'
                }}>
                <div className={`bfsg-tariff-slide ${currentSlide === index ? 'active' : ''}`}>
                  <div>
                    <div className="bfsg-card-wrapper">
                      <TariffCard {...tariff} visibleShortCard={true} />
                    </div>
                  </div>
                  {/* PDF link for each tariff - matched by tariff ID */}
                  {pdf && (
                    <div
                      className="bfsg-pdf-link d-flex justify-content-center pt-4 pb-4"
                      aria-hidden={currentSlide !== index}
                      onClick={(e) => e.stopPropagation()}> {/* Prevent card selection on PDF click */}
                      <Link
                        linkStyle={appLinkStyle.PRIMARY}
                        href={pdf.redirectionURL}
                        label={tA11yTranslate(pdf.name).content}
                        iconLeft="docsdark"
                        tabIndex={currentSlide === index ? 0 : -1} // Only tabbable when card is active
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TariffSliderAccessible;
