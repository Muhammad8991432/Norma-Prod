import React from 'react';
import './TariffBadge.scss';
import { Ta11yText } from '@core/index';
import { tA11y } from '@utils/a11y/a11yHelpers';

const tariffColorsMap = {
  'Smart S': '#C23945',
  'Smart M': '#F36C05',
  'Smart L': '#77255F',
  'Smart 6': '#215374',
  Start: '#12837F'
};

export function TariffBadge({ bgColor: customBgColor, tariffName, tariffSpeed }) {
  if (!tariffName) {
    return null;
  }

  const bgColor = customBgColor || tariffColorsMap[tariffName];

  return (
    <div className="tariff-badge nc-doomsday-footnote" style={{ backgroundColor: bgColor }}>
      {/* <Ta11yText textContent={tA11y(tariffName)} tag="span" /> */}
      <Ta11yText
        textContent={{
          content: `${tA11y(tariffName)?.content || ''} ${tA11y(tariffSpeed)?.content || ''}`
        }}
        tag="span"
      />
    </div>
  );
}

export default TariffBadge;
