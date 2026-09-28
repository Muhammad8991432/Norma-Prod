import React from 'react';
import Icons from '@core/Utils/Icons/Icons';
import { appInfoBoxType } from '@utils/globalConstant';
import './InfoBoxAddress.scss';
import Ta11yText from '@core/Ta11yText/Ta11yText';

export function InfoBoxAddress({
  text,
  leftIcon,
  type = appInfoBoxType.DARK,
  title,
  addressInfo
}) {
  return (
    <div className={`d-flex p-3 ${type} infobox-arrow`}>
      <div className="me-2" style={{ cursor: 'default' }}>
        {/* NOTE: pass Icons colorType prop if light icons are also needed (used for high contrast mode) */}
        {leftIcon && <Icons name={leftIcon} height={16} width={16} colorType="dark" />}
      </div>
      <div className="flex-grow-1">
        {title && (
          <Ta11yText
            textContent={title}
            className="nc-realtextpro-footnote-bold text-success pb-2 mb-0"
            tag="h2"
          />
        )}
        {text && <Ta11yText textContent={text} className="info-label text-start pb-2" tag="p" />}
        {addressInfo && (
          <Ta11yText
            textContent={addressInfo}
            className="nc-realtextpro-footnote-bold text-darkgreen mb-0"
            tag="address"
          />
        )}
      </div>
    </div>
  );
}

export default InfoBoxAddress;
