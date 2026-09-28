/* eslint-disable no-nested-ternary */
import React from 'react';
import { useA11y } from '@context/Utils';
import { Ta11yText, Link, CounterBar } from '@core/index';
import { Icons } from '@core/Utils';
import { appLinkStyle, appTariffStatusKey } from '@utils/globalConstant';
import './SpecialDataCard.scss';

export function SpecialDataCard({ bookedOption, customClass = '', active = -1, tabIndex }) {
  const { tA11yTranslate } = useA11y();

  const isPaused = bookedOption?.status === appTariffStatusKey.PAUSED;
  const bgColor = isPaused
    ? '#575C61' // $gray-80 for paused state
    : bookedOption?.bgColor || '#12837F'; // Default to mint color

  // Get headline text (already processed with dynamic content in Dashboard)
  const headlineText = bookedOption?.headlineText || '';

  const volumePrefixText = tA11yTranslate(bookedOption?.volumePrefixKey)?.content || '';
  const detailsLinkText = tA11yTranslate(bookedOption?.detailsLinkKey);

  // Calculate volume text and percentage (the same way as GenericDataCard)
  const remainingPercentage = parseFloat(
    `${bookedOption?.remainingVolumePercentage}`.replace(',', '.'),
    10
  );
  const percentage =
    remainingPercentage > 100 ? 100 : remainingPercentage < 0 ? 0 : remainingPercentage * 100;

  // Get volume text for display
  const volumeText = bookedOption?.remainingVolume;
  const totalVolumeText = bookedOption?.initialVolume;

  // Get pre-formatted availability text from Dashboard
  const formattedAvailabilityText = bookedOption?.availabilityText || '';

  return (
    <div
      className={`special-data-card rounded-3 px-4 py-4 
        animate__animated animate__zoomIn animate__delay-1s ${customClass} ${
        active ? '' : 'active'
      }`}
      style={{ backgroundColor: bgColor }}>
      <div className="d-flex align-items-center justify-content-start">
        <div>
          <Icons name={bookedOption?.iconName || 'feather'} colorType="light" />
        </div>
        <div>
          <h3 className="nc-doomsday-h5 text-white m-0 ps-3 pt-1">{headlineText}</h3>
        </div>
      </div>

      <div className="d-flex flex-column pt-4">
        <div className="d-flex flex-row">
          <div className="col-6 d-flex align-items-center justify-content-start p-0">
            <p className="nc-doomsday-h2 text-white text-left m-0">{volumeText}</p>
          </div>
          <div className="col-6 d-flex align-items-center justify-content-end p-0">
            <p className="nc-realtextpro-copy text-white m-0">
              {volumePrefixText} {totalVolumeText}
            </p>
          </div>
        </div>

        <div className="col-12 py-1 p-0">
          <CounterBar
            color="white"
            progress={percentage?.toString() || '0'}
            barStyles="bg-white-40-important"
          />
        </div>

        {formattedAvailabilityText && (
          <div className="col-12 p-0 pt-1">
            <p className="nc-realtextpro-footnote text-white m-0 text-start">
              {formattedAvailabilityText}
            </p>
          </div>
        )}

        {bookedOption?.onDetailsClick && (
          <div className="col-12 nc-doomsday-footnote-link text-white px-0 pt-4">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link
              tabIndex={tabIndex}
              linkStyle={`${appLinkStyle.WHITE}`}
              onClick={bookedOption.onDetailsClick}>
              <Ta11yText textContent={detailsLinkText} tag="span" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpecialDataCard;
