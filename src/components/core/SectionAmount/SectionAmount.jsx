import React from 'react';
import { useA11y } from '@context/Utils/A11y';
import { Ta11yText } from '@core/Ta11yText';
import './SectionAmount.scss';

export function SectionAmount({ label = '', value, className = '', currencySymbol = '€' }) {
  const { tA11yTranslate } = useA11y();

  const show = value !== null && value !== undefined && value !== '';

  if (!show) return null;

  // MPS: @Ema --> just a note: added replace('.', ',') to String(val) to handle 0.01 from static content
  const formatValue = (val) =>
    typeof val === 'number' ? val.toLocaleString('de-DE') : String(val).replace('.', ',');
  const valueWithCurrency = `${formatValue(value)}${currencySymbol ? ` ${currencySymbol}` : ''}`;

  return (
    <div
      className={className}
      aria-label="section_amount">
      <div className="text-center d-flex flex-column gap-1">
        <Ta11yText textContent={tA11yTranslate(label)} tag="p" className="nc-doomsday-h4 mb-1" />
        <Ta11yText textContent={{ content: valueWithCurrency }} tag="p" className="nc-doomsday-h1 mb-0" />
      </div>
    </div>
  );
}

export default SectionAmount;
