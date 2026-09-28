import React, { useRef, useCallback } from 'react';
import { useA11y } from '@context/Utils/A11y';
import { appKeyCode } from '@utils/globalConstant';
import './AmountSelection.scss';
import { Badge } from '../Badge';
import { ButtonRadio } from '../ButtonRadio';
import { Ta11yText } from '../Ta11yText';

export function AmountSelection({
  recommendationTariffName = null,
  recommendedOptionId = null,
  options = [],
  value = '',
  onChange = () => {},
  className = '',
  recommendationLabel = 'Passend zu Ihrem {tariffname} Tarif',
  ariaLabel = '',
  ariaLabelKey = '',
  invalid = false
}) {
  const { tA11yTranslate } = useA11y();
  const optionRefs = useRef([]);

  const hasRecommendedOption =
    recommendedOptionId && options.some((o) => o.id === recommendedOptionId);
  const showBanner =
    Boolean(hasRecommendedOption) || Boolean(recommendationTariffName && hasRecommendedOption);
  const bannerText =
    showBanner && recommendationTariffName
      ? recommendationLabel.replace(/\{tariffname\}/gi, recommendationTariffName)
      : recommendationLabel;
  const bannerId = recommendedOptionId
    ? `amount-selection-banner-${recommendedOptionId}`
    : undefined;

  const groupLabel =
    ariaLabel ||
    (ariaLabelKey
      ? tA11yTranslate(ariaLabelKey).ariaLabel || tA11yTranslate(ariaLabelKey).content
      : '') ||
    'Amount selection';

  // BFSG WCAG 2.2 compliant: Focus returns to selected item, or first if nothing selected
  const selectedIndex = options.findIndex((e) => e.id === value);
  const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const focusOption = useCallback(
    (index) => {
      const i = Math.max(0, Math.min(index, options.length - 1));
      if (optionRefs.current[i]) {
        optionRefs.current[i].focus();
      }
    },
    [options.length]
  );

  const handleKeyDown = useCallback(
    (event, index) => {
      const { keyCode } = event;
      let newIndex = -1;

      if (keyCode === appKeyCode.ARROW_DOWN || keyCode === appKeyCode.ARROW_RIGHT) {
        newIndex = index + 1;
        if (newIndex >= options.length) newIndex = 0;
      } else if (keyCode === appKeyCode.ARROW_UP || keyCode === appKeyCode.ARROW_LEFT) {
        newIndex = index - 1;
        if (newIndex < 0) newIndex = options.length - 1;
      } else if (keyCode === appKeyCode.HOME) {
        newIndex = 0;
      } else if (keyCode === appKeyCode.END) {
        newIndex = options.length - 1;
      } else if (keyCode === appKeyCode.ENTER || keyCode === appKeyCode.SPACE) {
        event.preventDefault();
        onChange(options[index].id);
        return;
      }

      if (newIndex !== -1) {
        event.preventDefault();
        focusOption(newIndex);
        onChange(options[newIndex].id);
      }
    },
    [options, onChange, focusOption]
  );

  return (
    <div className={`amount-selection ${className}`}>
      {/* Use fieldset+legend for the radio group:
           - legend is read once when entering the group (NVDA/JAWS expected pattern)
           - avoids NVDA reading "Amount selection Gruppierung" on every option */}
      <fieldset className="border-0 p-0 m-0">
        <legend className="visually-hidden">{groupLabel}</legend>
        <div className="d-flex align-items-center flex-column gap-2">
          {options.map((option, index) => {
            const isSelected = value === option.id;
            const optionId = `amount-selection-option-${option.id}`;
            const isRecommendedOption = option.id === recommendedOptionId;
            const showBannerAboveThisOption = showBanner && isRecommendedOption;

            return (
              <React.Fragment key={option.id}>
                {showBannerAboveThisOption && (
                  <div className="d-flex justify-content-start w-100 mb-2">
                    <Badge title={bannerText} colorVariant="yellow" />
                  </div>
                )}
                <button
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  id={optionId}
                  role="radio"
                  aria-checked={isSelected}
                  aria-posinset={index + 1} // aria-posinset is the position of the current item in the set
                  aria-setsize={options.length} // aria-setsize is the total number of items in the set
                  aria-describedby={showBannerAboveThisOption ? bannerId : undefined}
                  tabIndex={currentIndex === index ? 0 : -1}
                  className={`d-flex align-items-center justify-content-between w-100 py-3 px-5 input-group input-group-lg cursor-pointer font-family-inherit font-size-inherit text-start transition-border-color-0-2s-ease-box-shadow-0-2s-ease ${
                    showBannerAboveThisOption ? 'border border-yellow-100' : ''
                  }`}
                  onClick={() => onChange(option.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}>
                  <Ta11yText
                    textContent={tA11yTranslate(option.label)}
                    tag="span"
                    className="nc-doomsday-h4 mt-1 text-gray-100"
                  />
                  <ButtonRadio
                    id={optionId}
                    radioContent={option.label}
                    name="payment-field"
                    value={isSelected}
                    noLabel={true}
                    invalid={invalid}
                  />
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

export default AmountSelection;
