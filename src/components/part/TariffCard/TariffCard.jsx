import React from 'react';
import './TariffCard.scss';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { scaleFontSize } from '@utils/globalConstant';
import { Ta11yText } from '@core/index';
import { Icons } from '@core/Utils';

export const mapTariffCardProps = (tariff) => ({
  id: tariff.id,
  name: tariff.name,
  nameSpeed: tariff.nameSpeed,
  nameSvg: tariff.bubbleSvg,
  ribbonText: tariff.additionalInfo?.ribbon?.copy,
  oldDataVolume: tariff.strikeGB,
  currentDataVolume: tariff.header,
  bulletFeatures: tariff.bullets,
  currentPrice: tariff.price,
  duration: tariff.duration,
  oldPrice: tariff.strikePrice,
  additionalInfo: tariff.additionalInfo,
  showInActivation: tariff.showInActivationList
});

export const TariffCard = ({
  id,
  name,
  nameSvg,
  ribbonText = '',
  oldDataVolume = '',
  currentDataVolume = '',
  bulletFeatures = [],
  currentPrice = '',
  duration = '',
  oldPrice = '',
  additionalInfo = {},
  sizeVariant = 'small', // small (default), large
  customClass,
  visibleShortCard = false,
  isActive = false,
  isPaused = false
}) => {
  const shortCardBulletFeatures = bulletFeatures.filter((bullet) => bullet.visibleSmall); // if bullet has visibleSmall:true
  const displayedBulletFeatures = visibleShortCard ? shortCardBulletFeatures : bulletFeatures; // if visibleSmall:true show only shortCardBulletFeatures, else show all bullet features

  const isCardLarge = sizeVariant === 'large';

  const ribbonTextFontSize = scaleFontSize(16, sizeVariant);
  const oldDataVolumeFontSize = scaleFontSize(20, sizeVariant);
  const currentDataVolumeFontSize = scaleFontSize(44, sizeVariant);
  const currentPriceFontSize = scaleFontSize(26, sizeVariant);
  const durationFontSize = scaleFontSize(16, sizeVariant);
  const oldPriceFontSize = scaleFontSize(18, sizeVariant);

  return (
    <section id={`tariff${id}`} className={`tariff-product pt-2 pb-2 ${customClass}`}>
      <div
        className={`${
          isCardLarge ? 'large-card' : 'default-card'
        } tariff-card position-relative flex-grow-1 my-1`}>
        <>
          {(isActive || isPaused) && (
            <div className="active-tariff py-4 h-100 w-100 border border-2 border-gray-20 rounded-4 d-flex flex-column align-items-center justify-content-center">
              <h3 className="text-center mb-0" aria-label={tA11y(nameSvg).ariaLabel}>
                <Ta11yText textContent={tA11y(nameSvg)} className="tariff-name-bubble" tag="span" />
              </h3>
              <div className="active-tariff-content flex-grow-1 w-100 mt-n7 d-flex flex-column align-items-center justify-content-center">
                <div className="">
                  <Icons
                    name={isActive ? 'checkdarkgreen' : 'groupdarkgreen'}
                    size={24}
                    colorType="dark"
                  />
                </div>
                <div className="py-5">
                  <Ta11yText
                    textContent={isActive ? tA11y('Tarif ist aktiv') : tA11y('Tarif ist pausiert')} // TODO: add cms keys
                    tag="h3"
                    className={'nc-doomsday-h4 fw-medium text-nowrap'}
                  />
                </div>
              </div>
            </div>
          )}
        </>

        <div className="bg-white pt-4 border border-2 border-gray-20 rounded-4 h-100 w-100">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <h3 className="text-center mb-0" aria-label={tA11y(nameSvg).ariaLabel}>
              <Ta11yText textContent={tA11y(nameSvg)} className="tariff-name-bubble" tag="span" />
            </h3>
            <ul className="list-unstyled flex-grow-1 mx-2 w-100 text-center pt-3 mb-0">
              {ribbonText && (
                <li
                  className="ribbon-text d-flex align-items-center justify-content-center w-100 mb-3 text-center"
                  style={{
                    fontSize: ribbonTextFontSize,
                    backgroundColor: additionalInfo.ribbon?.bgColor,
                    color: additionalInfo.ribbon?.fontColor
                  }}>
                  <Ta11yText
                    textContent={tA11y(ribbonText)}
                    className="nc-buttontxt text-center mb-0 py-6px"
                    tag="span"
                  />
                </li>
              )}
              {oldDataVolume && (
                <li
                  className="px-10px nc-doomsday-h4 text-gray-100"
                  style={{
                    fontSize: oldDataVolumeFontSize
                  }}>
                  <Ta11yText textContent={tA11y(oldDataVolume)} tag="span" />
                </li>
              )}

              <li
                className="nc-doomsday-h1 px-10px d-inline-block pb-3"
                style={{
                  color: additionalInfo.primaryColor,
                  fontSize: currentDataVolumeFontSize
                }}>
                <Ta11yText textContent={tA11y(currentDataVolume)} tag="span" />
              </li>

              {displayedBulletFeatures &&
                displayedBulletFeatures.length > 0 &&
                displayedBulletFeatures.map((elem, index) => (
                  <li key={index} className="tariff-bullet text-gray-100 px-10px pb-3">
                    <Ta11yText textContent={tA11y(elem.bullet)} tag="span" />
                  </li>
                ))}

              <li
                className="pt-3 text-white w-100 nc-doomsday-h3"
                style={{
                  backgroundColor: additionalInfo.primaryColor,
                  fontSize: currentPriceFontSize,
                  // if oldPrice field is not available, set border radius and add padding to this <li>
                  borderBottomLeftRadius: oldPrice ? '0' : '28px',
                  borderBottomRightRadius: oldPrice ? '0' : '28px',
                  paddingBottom: oldPrice ? '0' : '10px'
                }}>
                <span>
                  <Ta11yText textContent={tA11y(currentPrice)} tag="span" />
                </span>
                <span
                  className="nc-realtextpro-copy"
                  style={{
                    backgroundColor: additionalInfo.primaryColor,
                    fontSize: durationFontSize
                  }}>
                  {' '}
                  <Ta11yText textContent={tA11y(duration)} tag="span" />
                </span>
              </li>

              {oldPrice && (
                <li
                  className="pb-10px pt-1 nc-doomsday-h5 text-white w-100"
                  style={{
                    backgroundColor: additionalInfo.primaryColor,
                    borderBottomLeftRadius: '28px',
                    borderBottomRightRadius: '28px'
                    // fontSize: oldPriceFontSize // UNCOMMENT if font scaling is needed
                  }}>
                  <Ta11yText textContent={tA11y(oldPrice)} className="" tag="span" />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TariffCard;
