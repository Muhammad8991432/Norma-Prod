/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useA11y } from '@context/Utils';
import { Link, Ta11yText } from '@core/index';
import { Icons } from '@core/Utils';
import { appKeyCode, appLinkStyle, appRoute } from '@utils/globalConstant';
import './DashboardActiveOption.scss';
import { useOption } from '@context/MobileOne';

export function DashboardActiveOption({
  type = '',
  volume = '',
  volumePercentage = 0,
  amount = '',
  remainingPeriod = '',
  stageType = '',
  noCounterAvailable = false,
  customClass = '',
  active = -1,  // -1 means not active, 0 means active, for card focus management (single card vs. multiple cards)
  tabIndex = -1, // -1 means not active, 0 means active, for link focus management,
  bookedOption
}) {
  // Contexts
  const navigate = useNavigate();
  const { tA11yTranslate } = useA11y();
  const { setShowCancelModal } = useOption();

  // Functions
  const handleClick = () => {
    navigate(appRoute.OPTION_OVERVIEW)
  };

  // not used in last version of this card, as the whole card should not be 
  // clickable anymore, but only the link at the bottom (according to MMS)
  // const handleKeyDown = (event) => {
  //   const { keyCode } = event;
  //   if (keyCode === appKeyCode.SPACE || keyCode === appKeyCode.ENTER) {
  //     handleClick();
  //   }	
  // };

  return (
    <div
      // Variant a)
      // Card remains focusable and is highlighted by focus ring after
      // first tab, second tab will focus the link at the bottom
      // As consequence we need two tabs back to the ul list to change the slides.

      // className={`dashboard-active-option rounded-3 bg-white px-4 py-3 mb-4 animate__animated animate__zoomIn animate__delay-1s ${customClass}`}
      // tabIndex={active}

      // Variant b)
      // Card is not focusable anymore, but the link at the bottom is focusable
      // in one tab step. The whole card is not clickable anymore.
      // The current active card always shows a focus ring (like tariff slider), also
      // immediately after page load.
      // Because of the first usage of active to control the tabindex we have this logic:
      // active with value 0 (zero) means active card
      // active with value -1 means non-active card

      className={
        `dashboard-active-option rounded-3 bg-white px-4 py-3 mb-4 
         animate__animated animate__zoomIn animate__delay-1s ${
            customClass
          } ${
            active ? '' : 'active'
          }
        `}

      // not used in last version of this card, as the whole card should not be 
      // clickable anymore, but only the link at the bottom (according to MMS)
      // onClick={handleClick}
      // onKeyDown={handleKeyDown}
      // role="link"
    >
      <div className="d-flex align-items-center justify-content-start">
        <div>
          <Icons name="speedgray100" colorType="dark" />
        </div>
        <div>
          <h3 className="nc-realheadpro-subhead text-gray-100 m-0 ps-2 pt-1">{type}</h3>
        </div>
      </div>
      <div className="d-flex flex-column pt-6">
        {stageType === 'SSD' || noCounterAvailable ? (
          <>
            <div className="col-12 p-0">
              {/* current implementation as Figma layout only shows "Data volume consumed" as special case */}
              <Ta11yText
                textContent={tA11yTranslate('nc_global_dboard_data_flat_txt1')}
                className="nc-doomsday-h5 text-left no-data-volume-no-counter m-0"
                tag="p"
              />
              {/* former implementation of special cases (Norma Refresh 2024) */}
              {/* <h4 className="nc-doomsday-h4 text-orange text-start m-0">
                {stageType === 'SSD'
                  ? t('nc_dboard_generic_card_stage_ssd_txt')
                  : t('nc_no_data_available')}
              </h4> */}
            </div>
          </>
        ) : (
          <div className="d-flex flex-row">
            <div className="col-6 d-flex align-items-center justify-content-start p-0">
              <Ta11yText textContent={volume} className="nc-doomsday-h3 text-left m-0" tag="p" />
            </div>
            {amount ? (
              <div className="col-6 d-flex align-items-center justify-content-end p-0">
                <p className="nc-realtextpro-copy m-0">{amount}</p>
              </div>
            ) : (
              <div className="col-6 d-flex align-items-center justify-content-end p-0" />
            )}
          </div>
        )}
        <div className="col-12 py-1 p-0">
          <div className="progress" aria-hidden="true">
            <div
              className="progress-bar bg-orange rounded-pill"
              style={{
                width: `${volumePercentage}%`
              }}
            />
          </div>
        </div>
        {remainingPeriod ? (
          <div className="col-12 p-0 pt-2">
            <p className="nc-realtextpro-footnote text-gray-100 m-0 text-start">
              {remainingPeriod}
            </p>
          </div>
        ) : (
          <div className="col-12 empty-expiry-date p-0 pt-2" />
        )}
        <div className="col-12 nc-doomsday-footnote-link px-0 pt-6">
          {bookedOption?.cancellable ? 
            <Link 
              tabIndex={tabIndex}
              linkStyle={`${appLinkStyle.PRIMARY}`}
              onClick={() => setShowCancelModal(bookedOption)}
            >
              <Ta11yText textContent={tA11yTranslate('nc_global_cncl_options_lnk1')} tag="span" />
            </Link> :
            <Link 
              tabIndex={tabIndex}
              linkStyle={`${appLinkStyle.PRIMARY}`}
              onClick={handleClick}
            >
              <Ta11yText textContent={tA11yTranslate('nc_dboard_opt_lnk1')} tag="span" />
            </Link>
          }
        </div>
        {/* not used in last version of this card, as the whole card should not be 
        clickable anymore, but only the link at the bottom (according to MMS) */}
        {/* <div className="col-12 nc-doomsday-footnote-link px-0 pt-6">
          <div className="text-primary nc-link-doomsday border-0 bg-transparent d-inline-block">
            <span className="d-flex align-items-center justify-content-start">
              <span className="link-children">
                <Ta11yText textContent={tA11yTranslate('nc_dboard_opt_lnk1')} tag="span" />
              </span>
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default DashboardActiveOption;
