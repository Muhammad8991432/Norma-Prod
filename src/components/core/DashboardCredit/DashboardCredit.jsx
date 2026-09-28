import React from 'react';
import { useA11y } from '@context/Utils/A11y';
import { Icons } from '@core/Utils';
import { replaceDynamicCmsContent } from '@utils/a11y/a11yHelpers';
import { Ta11yText } from '@core/index';
import './DashboardCredit.scss';

export function DashboardCredit({ credit, text, onClick, isCreditLow = false, showPlusIcon }) {
  const { tA11yTranslate } = useA11y();

  const creditContent = credit
    ? replaceDynamicCmsContent(tA11yTranslate('nc_global_currency'), '{amount}', credit)
    : ''; // show empty string if credit is null or undefined

  return (
    <div className="d-flex justify-content-between align-items-center dashboard-credit animate__animated animate__zoomIn">
      <div className="up-div">
        <Icons name="walletdark" width={24} height={24} colorType="dark" />

        <div className="d-inline-flex text align-items-baseline">
          <h2>
            <Ta11yText
              textContent={text}
              tag="span"
              className="nc-realtextpro-copy m-0 credit-text text-gray-100"
            />
            {creditContent && (
              <Ta11yText
                textContent={creditContent}
                tag="span"
                className={`nc-doomsday-h3 mb-0 credit-price ${isCreditLow ? 'text-danger' : ''}`}
              />
            )}
          </h2>
        </div>
      </div>
      {showPlusIcon && (
        <div className="plus-icon">
          <button
            type="button"
            className="border-0 bg-transparent p-0"
            aria-label={tA11yTranslate('nc_global_icn_topup_aria').ariaLabel}
            onClick={onClick}>
            <Icons name="plusdarkgreen" width={28} height={28} colorType="dark" />
          </button>
        </div>
      )}
    </div>
  );
}

export default DashboardCredit;
