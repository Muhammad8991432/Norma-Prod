import React from 'react';
import Icons from '@core/Utils/Icons/Icons';
import { Ta11yText } from '@core/index';
import './CardIconHeadlineDescription.scss';
import { useA11y } from '@context/Utils';

const TYPE_CONFIG = {
  ownNumber: {
    icon: 'iconUser',
    defaultHeadline: 'Eigene Rufnummer',
    defaultDescription: '{phone number}'
  },
  otherNumber: {
    icon: 'iconPhone',
    defaultHeadline: 'Andere Rufnummer',
    defaultDescription: '{phone number}'
  },
  topupHistory: {
    icon: 'iconcardgray100',
    defaultHeadline: '{dd.mm.yyyy} {hh:mm}',
    defaultDescription: '{payment-method}'
  }
};

export function CardIconHeadlineDescription({
  type = 'ownNumber',
  data = {},
  leftIcon = '',
  onClick,
  className = '',
  ariaLabel = ''
}) {
  const { tA11yTranslate } = useA11y();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.ownNumber;
  const headline = data.headline != null ? data.headline : config.defaultHeadline;
  const description = data.description != null ? data.description : config.defaultDescription;
  const isHistoryType = type === 'topupHistory' && data.headlineDate;
  const combinedLabel = ariaLabel || (isHistoryType
    ? `${data.headlineDate} ${data.headlineTime || ''}, ${description}`
    : `${headline}, ${description}`);

  const renderHeadline = () => {
    if (isHistoryType) {
      return (
        <span className="card-icon-headline-desc-headline d-flex align-items-baseline gap-2 mb-0">
          <Ta11yText textContent={tA11yTranslate(data.headlineDate)} tag="span" className="nc-doomsday-h5" />
          {data.headlineTime && (
            <Ta11yText textContent={tA11yTranslate(data.headlineTime)} tag="span" className="nc-realtextpro-copy" />
          )}
        </span>
      );
    }
    return <Ta11yText textContent={tA11yTranslate(headline)} tag="span" className="card-icon-headline-desc-headline nc-doomsday-h5 d-block mb-0" />;
  };

  const content = (
    <>
      <span className="card-icon-headline-desc-icon d-inline-flex align-items-center justify-content-center" aria-hidden="true">
        <Icons name={leftIcon || config.icon} width={30} height={30} colorType="dark" alt="" />
      </span>
      <span className="card-icon-headline-desc-body flex-grow-1 text-start text-gray-100">
        {renderHeadline()}
        <Ta11yText textContent={tA11yTranslate(description)} tag="span" className="card-icon-headline-desc-desc nc-realtextpro-footnote d-block" />
      </span>
      <span className="card-icon-headline-desc-chevron d-inline-flex align-items-center" aria-hidden="true">
        <Icons name="arrowrightgrey" width={24} height={24} alt="" />
      </span>
    </>
  );

  const cardClassName = `card-icon-headline-desc d-flex align-items-center gap-3 w-100 py-3 px-4 shadow-mps bg-white border-0 text-start btn-reset-default-style ${className}`.trim();

  return (
    <button
      type="button"
      className={cardClassName}
      onClick={onClick}
      aria-label={combinedLabel}
    >
      {content}
    </button>
  );
}

export default CardIconHeadlineDescription;
