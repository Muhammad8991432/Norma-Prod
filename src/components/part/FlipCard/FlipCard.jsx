/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTariff } from '@context/MobileOne';
import { useA11y } from '@context/Utils';
import { appTariffStatus, appRoute, appButtonTypes } from '@utils/globalConstant';
import { replaceDynamicCmsContent } from '@utils/a11y/a11yHelpers';
import { FlipIcon } from '.';
import './FlipCard.scss';
import { Ta11yText, NavigationTabList, CounterBar, ButtonPrimary, ButtonSecondary, Icons } from '@core/index';

const DEFAULT_USAGE = {
  headlineText: ' ',
  // headlineText2: ' ',
  subHeadLineText: ' ',
  endDate: false,
  // noData: false,
  volumePercentage: 0,
  frontLinkText: '',
  frontLinkTarget: ''
};

export function FlipCard({
  status = appTariffStatus.ACTIVE,
  isFlip = true,
  number = '',
  tariffInfo: {
    name,
    nameSpeed,
    additionalInfo,
  } = { name: '', nameSpeed: '', additionalInfo: {} },
  usageInfo: { VOICE, SMS, DATA } = {
    VOICE: DEFAULT_USAGE,
    SMS: DEFAULT_USAGE,
    DATA: DEFAULT_USAGE
  }
}) {
  const frontSideButtonRef = useRef(null);
  const backSideButtonRef = useRef(null);
  // Contexts
  const navigate = useNavigate();
  const { tA11yTranslate } = useA11y();
  const { getTariffName } = useTariff();

  // Constants
  const frontFlipIconContent = tA11yTranslate('nc_global_icn_flipcard_aria');
  const backFlipIconContent = tA11yTranslate('nc_global_icn_bckflip_aria');

  const frontLink1Text = tA11yTranslate('nc_global_dboard_lnk1');
  const frontLink1Target = appRoute.OPTION_OVERVIEW;
  const frontLink2Text = tA11yTranslate('nc_global_dboard_lnk2');
  const frontLink2Target = appRoute.OPTION_OVERVIEW;

  const backLink1Text = tA11yTranslate('nc_global_dboard_flipcard_lnk1');
  const backLink1Target = appRoute.TARIFF_OVERVIEW;
  const backLink2Text = tA11yTranslate('nc_global_dboard_flipcard_lnk2');
  // MPS: Note: changed to new MPS topup overview page
  const backLink2Target = appRoute.MPS_TOPUP_OVERVIEW;
  const backLink3Text = tA11yTranslate('nc_global_dboard_flipcard_lnk3');
  const backLink3Target = appRoute.OPTION_OVERVIEW;

  const tariffChangeButtonText = tA11yTranslate('nc_dashboard_btn_reload');
  const dashboardApiErrorButtonText = tA11yTranslate('nc_dashboard_btn_reload');

  const pausedLinkText = tA11yTranslate('nc_dboard_pause_card_lnk1');
  // MPS: Note: changed to new MPS topup overview page
  const pausedLinkTarget = appRoute.MPS_TOPUP_OVERVIEW;

  const numberText = replaceDynamicCmsContent(tA11yTranslate('nc_dboard_dts_number'), '{NUMBER}', number);

  const flipCardTabs = [
    {
      text: 'nc_global_dboard_min_tab',
      icon: 'minutesgray100',
      bubbleIcon: 'minutes'
    },
    { text: 'nc_global_dboard_data_tab', icon: 'datagray100', bubbleIcon: 'data' },
    { text: 'nc_global_dboard_sms_tab', icon: 'smsgray100', bubbleIcon: 'sms' }
  ];

  // States
  const [volumePercentage, setVolumePercentage] = useState(DATA.volumePercentage);
  const [headlineText, setHeadlineText] = useState(DATA.headlineText);
  // const [headlineText2, setHeadlineText2] = useState(DATA.headlineText2);
  const [subHeadLineText, setSubHeadLineText] = useState(DATA.subHeadLineText);
  const [endDate, setEndDate] = useState(DATA.endDate);
  // const [noData, setNoData] = useState(DATA.noData);
  const [frontLinkText, setFrontLinkText] = useState(frontLink1Text);
  const [frontLinkTarget, setFrontLinkTarget] = useState(frontLink1Target);
  const [currentView, setCurrentView] = useState('DATA');
  const [currentTariffTabIndex, setCurrentTariffTabIndex] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (currentView === 'VOICE') {
      setHeadlineText(VOICE.headlineText);
      setSubHeadLineText(VOICE.subHeadLineText);
      setEndDate(VOICE.endDate);
      setVolumePercentage(VOICE.volumePercentage);
      setFrontLinkText(frontLink2Text);
      setFrontLinkTarget(frontLink2Target);
    } else if (currentView === 'DATA') {
      setHeadlineText(DATA.headlineText);
      setSubHeadLineText(DATA.subHeadLineText);
      setEndDate(DATA.endDate);
      setVolumePercentage(DATA.volumePercentage);
      setFrontLinkText(frontLink1Text);
      setFrontLinkTarget(frontLink1Target);
    } else if (currentView === 'SMS') {
      setHeadlineText(SMS.headlineText);
      setSubHeadLineText(SMS.subHeadLineText);
      setEndDate(SMS.endDate);
      setVolumePercentage(SMS.volumePercentage);
      setFrontLinkText(frontLink2Text);
      setFrontLinkTarget(frontLink2Target);
    }
  }, [DATA, SMS, VOICE, currentView]);

  const onChange = (i) => {
    setCurrentTariffTabIndex(i);
    if (i === 0) {
      setHeadlineText({ content: ''});
      setSubHeadLineText({ content: ''});
      setCurrentView('VOICE');
    } else if (i === 1) {
      setHeadlineText({ content: ''});
      setSubHeadLineText({ content: ''});
      setCurrentView('DATA');
    } else if (i === 2) {
      setHeadlineText({ content: ''});
      setSubHeadLineText({ content: ''});
      setCurrentView('SMS');
    }
  };

  const switchTabs = (index) => {
    onChange(index);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setTimeout(() => {
      if (isFlipped) {
        frontSideButtonRef.current.focus();
      } else {
        backSideButtonRef.current.focus();
      }
    }, 0);
  };

  const handleLinkClick = (link) => {
    navigate(link)
  };

  // rendering the component

  // tariff change in progress
  // changes in BFSG rewrite: appTariffStatus.IN_CHANGE is not documented in 
  // ETC One API documentation (PDF-file). Thus changed to appTariffStatus.ACTIVATION_PENDING
  // Old condition: (status === appTariffStatus.IN_CHANGE || status === appTariffStatus.ACTIVATION_PENDING)
  if (status === appTariffStatus.ACTIVATION_PENDING) {
    return (
      <div className="flip-card h-100">
        <div className="card-container">
          <div className="card card-different-status flex-column justify-content-center py-6 px-4 ">
            <div className="row text-center">
              <Icons name="coffeemint" />
            </div>
            <div className="row text-center py-4">
              <Ta11yText textContent={tA11yTranslate('nc_dboard_change_tariff_card_hdl1')} className="nc-doomsday-h3 m-0" tag="h2" />
            </div>
            <div className="row text-center pb-8">
              <Ta11yText textContent={tA11yTranslate('nc_dboard_change_tariff_card_txt1')} className="nc-realtextpro-copy text-gray-100 m-0" tag="p" />
            </div>
            <div className="row">
              <div className="d-flex justify-content-center">
                <div className="w-80">
                  <ButtonPrimary
                    buttonType={appButtonTypes.PRIMARY.DEFAULT}
                    buttonContent={tariffChangeButtonText}
                    onClick={() => window.location.reload()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // tariff is paused
  if (status === appTariffStatus.PAUSED) {
    return (
      <div className="flip-card h-100">
        <div className="card-container">
          <div className="card card-different-status flex-column justify-content-center py-6 px-4 ">
            <div className="row text-center">
              <Icons name="pausemint" />
            </div>
            <div className="row text-center py-4">
              <Ta11yText textContent={tA11yTranslate('nc_dboard_pause_card_hdl1')} className="nc-doomsday-h3 m-0" tag="h2" />
            </div>
            <div className="row text-center pb-8">
              <Ta11yText textContent={tA11yTranslate('nc_dboard_pause_card_txt1')} className="nc-realtextpro-copy text-gray-100 m-0" tag="p" />
            </div>
            <div className="row">
              <div className="d-flex justify-content-center">
                <ButtonSecondary
                  role="link"
                  tabIndex={0}
                  type={appButtonTypes.SECONDARY.DEFAULT}
                  icon="forwardprimary"
                  iconColorType="dark"
                  buttonContent={pausedLinkText}
                  onClick={() => handleLinkClick(pausedLinkTarget)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // not all relevant data could have been loaded
  if (status === appTariffStatus.ERROR) {
    return (
      <div className="flip-card h-100">
        <div className="card-container">
          <div className="card card-different-status flex-column justify-content-center py-6 px-4 ">
            <div className="row text-center">
              <Icons name="nodatamint" />
            </div>
            <div className="row text-center pt-4 pb-8">
              <Ta11yText textContent={tA11yTranslate('nc_dboard_no_data_card_hdl1')} className="nc-doomsday-h3 m-0" tag="h2" />
            </div>
            <div className="row">
              <div className="d-flex justify-content-center">
                <div className="w-80">
                  <ButtonPrimary
                    buttonType={appButtonTypes.PRIMARY.DEFAULT}
                    buttonContent={dashboardApiErrorButtonText}
                    onClick={() => window.location.reload()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // tariff is active
  return (
    <div className={`flip-card h-100 ${isFlipped ? 'flipped' : ''}`}>
      <div className={`card-container `}>
        <div
          className="card animate__animated animate__flipInY py-6 px-4"
          style={isFlipped ? { background: additionalInfo.primaryColor } : {}}
        >

          {/* Front Side */}
          <div className="card-front">
            <div className="row">
              <div className="d-flex justify-content-between col-12">
                <div style={{ color: additionalInfo.primaryColor }}>
                  <Ta11yText textContent={getTariffName(name, nameSpeed)} className="nc-doomsday-h3 m-0" tag="h2" />
                </div>
              </div>
              <div className="col-12">
                <Ta11yText textContent={numberText} className="nc-realtextpro-footnote text-gray-80 m-0"  tag="p" />
              </div>
            </div>
            <div>
              {isFlip && (
                <button
                  ref={frontSideButtonRef}
                  type="button"
                  className="border-0 bg-transparent p-0"
                  aria-label={frontFlipIconContent?.ariaLabel ? frontFlipIconContent?.ariaLabel : ''}
                  onClick={handleFlip}
                  style={{ position: 'absolute', top: '24px', right: '24px' }}
                >
                  <FlipIcon color={additionalInfo.primaryColor} />
                </button>
              )}
            </div>
            <div className="visually-hidden">
              <Ta11yText
                id="tablist-tariff-description"
                textContent={tA11yTranslate('nc_db_tariff_tablist_label')}
                className="nc-doomsday-h3 m-0"
                tag="p"
              />
            </div>
            <div className="row pt-6 px-2">
              {/* Implementation is based on this APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/ */}
              <NavigationTabList
                tabs={flipCardTabs}
                bubbleColor={additionalInfo.primaryColor} // tariff color
                defaultActive={1}
                showIcons
                onChange={
                  (index) => {
                    onChange(index);
                  }
                }
                switchTabs={
                  (index) => {
                    switchTabs(index);
                  }
                }
                aria-labelledby="tablist-tariff-description"
                controlIdPrefix="tariff-tabpanel-"
              />
            </div>
            {/* "virtual tabpanels" for role="tablist" defined in above component NavigationTabList */}
            {/* virtual because we only defined one real tabpanel filled with content by conditional rendering */}
            {/* Tabpanels which are not visible need to be hidden. This is here fulfilled by faking them. */}

            {/* Faking empty tabpanels for the other tabs according to currentTariffTabIndex, */}
            {/* to enable screen reader output e.g. "tab 1 of 3" */}

            {/* case SMS tab is selected */}
            { currentTariffTabIndex === 2 && (
              <>
                <div role="tabpanel" tabIndex={0} id="tariff-tabpanel-0" className="d-none" aria-labelledby="tab-0" />
                <div role="tabpanel" tabIndex={0} id="tariff-tabpanel-1" className="d-none" aria-labelledby="tab-1" />
              </>
            )}

            {/* case DATA tab is selected */}
            { currentTariffTabIndex === 1 && (
              <div role="tabpanel" tabIndex={0} id="tariff-tabpanel-0" className="d-none" aria-labelledby="tab-0" />
            )}

            <div
              role="tabpanel"
              tabIndex={0}
              id={`tariff-tabpanel-${currentTariffTabIndex}`}
              aria-labelledby={`tab-${currentTariffTabIndex}`}
            >
              <div className="row mt-13">
                {(currentView === "DATA" && DATA.volumePercentage === 0) ? (
                  <div className="d-flex align-items-center justify-content-between volume-text">
                    <div className="text-center w-100" style={{ color: additionalInfo.primaryColor, lineHeight: '36px' }}>
                      <Ta11yText
                        textContent={headlineText}
                        className="nc-doomsday-h3 m-0"
                        tag="p"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-baseline justify-content-between volume-text">
                    <span style={{ color: additionalInfo.primaryColor, display: 'inline-block' }}>
                      <Ta11yText
                        tag="span"
                        textContent={headlineText}
                        className="nc-doomsday-h1 m-0"
                      />
                      &nbsp;
                    </span>
                    <span style={{ display: 'inline-block' }}>
                      <Ta11yText
                        tag="span"
                        textContent={subHeadLineText}
                        className="nc-realheadpro-h4 m-0 text-gray-100"
                      />
                    </span>
                  </div>
                )}
                <div className="col-12 text-center pt-0">
                  <CounterBar color={additionalInfo.primaryColor} progress={volumePercentage} barStyles="my-2" />
                </div>
                {endDate ? (
                  <div className="col-12 nc-realtextpro-footnote text-gray-100 pt-1">{endDate}</div>
                ) : (
                  <div className="col-12 nc-realtextpro-footnote text-gray-100 pt-1" />
                )}
              </div>
              <div className="mt-8 d-flex justify-content-center">
                <ButtonSecondary
                  role="link"
                  tabIndex={0}
                  type={appButtonTypes.SECONDARY.DEFAULT}
                  icon="forwardprimary"
                  iconColorType="dark"
                  customClass="tariff-card-front-link"
                  buttonContent={frontLinkText}
                  onClick={() => handleLinkClick(frontLinkTarget)}
                />
              </div>
            </div>

            {/* case DATA tab is selected */}
            { currentTariffTabIndex === 1 && (
              <div role="tabpanel" tabIndex={0} id="tariff-tabpanel-2" className="d-none" aria-labelledby="tab-2" />
            )}

            {/* case VOICE tab is selected */}
            { currentTariffTabIndex === 0 && (
              <>
                <div role="tabpanel" tabIndex={0} id="tariff-tabpanel-1" className="d-none" aria-labelledby="tab-1" />
                <div role="tabpanel" tabIndex={0} id="tariff-tabpanel-2" className="d-none" aria-labelledby="tab-2"/>
              </>
            )}
          </div>

          {/* Back Side */}
          <div className="card-back flex-column justify-content-between">
            <div className="w-100 d-flex flex-column">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <Ta11yText textContent={getTariffName(name, nameSpeed)} className="nc-doomsday-h3 m-0" tag="h3" />
              </div>
              <div className="w-100">
                <Ta11yText textContent={numberText} className="nc-realtextpro-footnote text-white-60 m-0"  tag="p" />
              </div>
              <div>
                <button
                  ref={backSideButtonRef}
                  type="button"
                  className="border-0 bg-transparent p-0 icon reverse-icon"
                  aria-label={backFlipIconContent?.ariaLabel ? backFlipIconContent?.ariaLabel : ''}
                  onClick={handleFlip}
                  style={{ position: 'absolute', top: '0', right: '0' }}
                >
                  <FlipIcon color="white" />
                </button>
              </div>
            </div>
            <div className="mt-16 w-100">
              <Link to={backLink1Target} className="d-flex align-items-center justify-content-between py-2 link">
                <div className="left-section d-flex align-items-center ">
                  <Icons name="change" className="white-opacity" />
                  <Ta11yText
                    tag="p"
                    textContent={backLink1Text}
                    className="mx-3 nc-doomsday-h4 text-white-60 mt-1"
                  />
                </div>
                <Icons name="forward" />
              </Link>
              <span className="w-100 white-opacity border-bottom border-white-40 d-flex my-4" />
              <Link to={backLink2Target} className="d-flex align-items-center justify-content-between py-2 link">
                <div className="left-section d-flex align-items-center ">
                  <Icons name="coins" className="white-opacity" />
                  <Ta11yText
                    tag="p"
                    textContent={backLink2Text}
                    className="mx-3 nc-doomsday-h4 text-white-60 mt-1"
                  />
                </div>
                <Icons name="forward" />
              </Link>
              <span className="w-100 white-opacity border-bottom border-white-40 d-flex my-4" />
              <Link to={backLink3Target} className="d-flex align-items-center justify-content-between py-2 link">
                <div className="left-section d-flex align-items-center ">
                  <Icons name="tariff" className="white-opacity" />
                  <Ta11yText
                    tag="p"
                    textContent={backLink3Text}
                    className="mx-3 nc-doomsday-h4 text-white-60 mt-1"
                  />
                </div>
                <Icons name="forward" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
