/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// import { useStaticContent } from '@context/StaticContent';
import { useOption, useSpeedOn, useTariff } from '@context/MobileOne';
import { useA11y, useAlert, useLayout } from '@context/Utils';
import { LoadingScreen } from '@core/LoadingScreen';
import { appRoute, appTariffOptionSuccessType } from '@utils/globalConstant';
import { Feedback, NavigationTabs, ScrollToTop } from '@core/index';
import { AppPageContentWrapper } from '@part/AppPageContentWrapper';
import { replaceDynamicCmsContent } from '@utils/a11y/a11yHelpers';
import { PopupModal } from '@part/PopupModal';
import { PopupModalGeneric } from '@part/PopupModalGeneric';
import { NavigationPageTitle } from '@core/NavigationPageTitle';

export function TariffOptionLayout() {
  // Contexts
  const { isLoading } = useLayout();
  const { tA11yTranslate } = useA11y();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    isLoading: isTariffLoading,
    afterLoad,
    showPdfs,
    setShowPdfs,
    tariffOptionSuccess,
    setTariffOptionSuccess,
    getTariffName,
    selectedTariff,
    getCMSText,
    getDayFlatCMSText,
    selectedSpeedOn,
    selectedBookableOption,
    showTariffDetailsExpireModal,
    setShowTariffDetailsExpireModal,
    popupCampaignDataTariffContentsExpire,
    cancelTariffChangeToTheEndError,
    setCancelTariffChangeToTheEndError,
    cancelTariffChangeToTheEndLoading
  } = useTariff();
  const { setIsGenericError } = useAlert();
  const { onLoad, setDayFlat, setSpeedOns } = useSpeedOn();
  const {
    getBookableOptions,
    showOptionBookingCreditReminderModal,
    setShowOptionBookingCreditReminderModal,
    popupCampaignDataOptionBooking
  } = useOption();

  const [isTariffOverview, setIsTariffOverview] = useState(false);
  const [headerContent, setHeaderContent] = useState('nc_tariff_page_title');
  const [isTariffPeriodOverview, setIsTariffPeriodOverview] = useState(false);
  const [isTariffOptionOverview, setIsTariffOptionOverview] = useState(false);
  const [isInternationalOptionOverview, setIsInternationalOptionOverview] = useState(false);
  const [isTariffChange, setIsTariffChange] = useState(false);
  const [isAdditionalOptionBook, setIsAdditionalOptionBook] = useState(false);
  const [isOptionBook, setIsOptionBook] = useState(false);
  const [isSpeedOnBook, setIsSpeedOnBook] = useState(false);
  // NOTE: this state seems to be not used, please see coresponding use for url below
  const [isBookableOptionOnBook, setIsBookableOptionOnBook] = useState(false);
  const [isSpecialOptionBook, setIsSpecialOptionBook] = useState(false);

  useEffect(() => {
    if (pathname.endsWith('/tariff/overview')) {
      setIsTariffOverview(true);
    } else {
      setIsTariffOverview(false);
    }

    if (pathname.includes('/tariff/change')) {
      setIsTariffChange(true);
    } else {
      setIsTariffChange(false);
    }
    if (pathname.includes('/option/book')) {
      setIsOptionBook(true);
    } else {
      setIsOptionBook(false);
    }

    if (pathname.includes('/additional-option/book')) {
      setIsAdditionalOptionBook(true);
    } else {
      setIsAdditionalOptionBook(false);
    }

    if (pathname.includes('/passoffer/book')) {
      setIsSpeedOnBook(true);
    } else {
      setIsSpeedOnBook(false);
    }

    // NOTE: this path seems to be not used, as bookable options have their own path (/option/book/:optionId),
    // but keeping the logic in case it's needed in the future
    if (pathname.includes('/bookable-option/book')) {
      setIsBookableOptionOnBook(true);
    } else {
      setIsBookableOptionOnBook(false);
    }

    if (pathname.includes('/special-option/book')) {
      setIsSpecialOptionBook(true);
    } else {
      setIsSpecialOptionBook(false);
    }

    if (pathname.includes('/overview/month') || pathname.includes('/overview/year')) {
      setIsTariffPeriodOverview(true);
      setHeaderContent(tA11yTranslate('nc_tariff_page_title'));
    } else if (pathname.includes('/option/overview')) {
      setIsTariffOptionOverview(true);
      setHeaderContent(tA11yTranslate('nc_tariff_options_overview_page_title'));
    } else if (pathname.includes('/ausland/overview')) {
      setIsInternationalOptionOverview(true);
      setHeaderContent(tA11yTranslate('nc_tariff_options_overview_page_title'));
    } else {
      setIsTariffPeriodOverview(false);
      setIsTariffOptionOverview(false);
      setIsInternationalOptionOverview(false);
    }
  }, [pathname]);

  useEffect(() => {
    setDayFlat([]);
    setSpeedOns([]);
    onLoad();
    setIsGenericError(false);
    // CLEANUP: after testing
    // setAlert({});
    afterLoad();
    getBookableOptions();
  }, []);

  let headingContent = {};
  let copyTextContent = {};
  let buttonContent = {};

  if (tariffOptionSuccess.type === appTariffOptionSuccessType.TARIFF) {
    headingContent = replaceDynamicCmsContent(
      tA11yTranslate('nc_tariff_details_suc_hdl1'),
      '{TARIFFNAME}',
      getTariffName(selectedTariff.name, selectedTariff.nameSpeed).content
    );
    copyTextContent = tA11yTranslate('nc_tariff_details_suc_txt1');
    buttonContent = tA11yTranslate('nc_tariff_details_suc_btn1');
  } else if (tariffOptionSuccess.type === appTariffOptionSuccessType.TARIFF_TO_THE_END) {
    headingContent = replaceDynamicCmsContent(
      tA11yTranslate('nc_tariff_details_suc_hdl2'),
      '{TariffName}',
      getTariffName(selectedTariff.name, selectedTariff.nameSpeed).content
    );
    copyTextContent = tA11yTranslate('nc_tariff_details_suc_txt2');
    buttonContent = tA11yTranslate('nc_tariff_details_suc_btn2');
  } else if (tariffOptionSuccess.type === appTariffOptionSuccessType.CANCEL_TARIFF_TO_THE_END) {
    headingContent = tA11yTranslate('nc_cancel_tariff_details_suc_txt2');
    copyTextContent = '';
    buttonContent = tA11yTranslate('nc_cancel_tariff_details_suc_btn2');
  } else if (tariffOptionSuccess.type === appTariffOptionSuccessType.ADDITIONAL_OPTION) {
    headingContent = getDayFlatCMSText('name');
    copyTextContent = tA11yTranslate('nc_tariff_options_detail_suc_txt1');
    buttonContent = tA11yTranslate('nc_tariff_options_detail_suc_btn1');
  } else if (tariffOptionSuccess.type === appTariffOptionSuccessType.SPEED_ON) {
    headingContent = getCMSText(
      'nc_tariff_options_detail_suc_hdl1',
      selectedSpeedOn?.volumeData?.volume?.formattedValue,
      '{TARIFFNAME}'
    );
    copyTextContent = tA11yTranslate('nc_tariff_options_detail_suc_txt1');
    buttonContent = tA11yTranslate('nc_tariff_options_detail_suc_btn1');
  } else if (tariffOptionSuccess.type === appTariffOptionSuccessType.SPECIAL_OPTION) {
    headingContent = tA11yTranslate('nc_tariff_options_data_cushion_suc_hdl1');
    copyTextContent = tA11yTranslate('nc_tariff_options_data_cushion_suc_txt1');
    buttonContent = tA11yTranslate('nc_tariff_options_data_cushion_suc_btn1');
  } else if (tariffOptionSuccess.type === appTariffOptionSuccessType.OPTION) {
    headingContent = getCMSText(
      'nc_tariff_options_detail_suc_hdl1',
      selectedBookableOption?.name,
      '{TARIFFNAME}'
    );
    copyTextContent = tA11yTranslate('nc_tariff_options_detail_suc_txt1');
    buttonContent = tA11yTranslate('nc_tariff_options_detail_suc_btn1');
  }

  // show separate error feedback page if cancelling tariff change
  // to the end of the contract failed
  if (cancelTariffChangeToTheEndError) {
    return (
      <>
        {cancelTariffChangeToTheEndLoading ? (
          <ScrollToTop>
            <LoadingScreen />
          </ScrollToTop>
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: 'calc(100vh - 80px)' }}>
            <AppPageContentWrapper>
              <div className="">
                <Feedback
                  icon="sad"
                  headingContent={tA11yTranslate('nc_cancel_tariff_change_feedback_err_hdl1')}
                  copyTextContent={tA11yTranslate('nc_cancel_tariff_change_feedback_err_txt1')}
                  buttonContent={tA11yTranslate('nc_cancel_tariff_change_feedback_err_btn1')}
                  onButtonClick={() => {
                    setTariffOptionSuccess({ isSuccessful: false, type: null });
                    setCancelTariffChangeToTheEndError(false);
                    navigate(appRoute.TARIFF_OVERVIEW_PERIOD_MONTH);
                  }}
                  apiError
                  largerButton
                />
              </div>
            </AppPageContentWrapper>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Use popupCampaignDataOptionBooking for option bookings. */}
      {/* Use popupCampaignDataTariffChange for tariff changes. */}

      {/* {showTopupModal ? getModalContent() : null} */}
      {showOptionBookingCreditReminderModal && popupCampaignDataOptionBooking ? (
        <PopupModal>
          <PopupModalGeneric
            popupCampaignDataParam={popupCampaignDataOptionBooking}
            setModalState={setShowOptionBookingCreditReminderModal}
          />
        </PopupModal>
      ) : null}

      {showTariffDetailsExpireModal ? (
        <PopupModalGeneric
          popupCampaignDataParam={popupCampaignDataTariffContentsExpire}
          setModalState={setShowTariffDetailsExpireModal}
        />
      ) : null}

      {tariffOptionSuccess.isSuccessful ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: 'calc(100vh - 80px)' }}>
          <AppPageContentWrapper>
            <div className="">
              <Feedback
                icon="smile"
                headingContent={headingContent}
                copyTextContent={copyTextContent}
                buttonContent={buttonContent}
                onButtonClick={() => {
                  setTariffOptionSuccess({ isSuccessful: false, type: null });
                  // navigate(appRoute.OPTION_OVERVIEW)
                  navigate(appRoute.DASHBOARD);
                }}
              />
            </div>
          </AppPageContentWrapper>
        </div>
      ) : (
        <AppPageContentWrapper containerType="paddingTopFull">
          <div className="mb-16">
            {isTariffOverview && <NavigationPageTitle title={tA11yTranslate('nc_tariff_overview_page_title')} variant="sm" />}
            {!!(isTariffPeriodOverview || isTariffOptionOverview || isInternationalOptionOverview) && (
              <NavigationPageTitle
                title={headerContent}
                variant="flex-xs"
                isBackButton
                onButtonClick={() => navigate(appRoute.TARIFF_OVERVIEW)}
              />
            )}
            {!isTariffLoading && isTariffChange && (
              <NavigationPageTitle
                title={tA11yTranslate(
                  showPdfs ? 'nc_tariff_documents_page_title' : 'nc_tariff_details_page_title'
                )}
                variant="flex-xs"
                isBackButton
                onButtonClick={() =>
                  showPdfs ? setShowPdfs(false) : navigate(-1)
                }
              />
            )}
            {!!(isAdditionalOptionBook || isOptionBook || isSpeedOnBook || isSpecialOptionBook) && (
              <NavigationPageTitle
                title={tA11yTranslate('nc_tariff_options_detail_page_title')}
                variant="flex-xs"
                isBackButton
                onButtonClick={() => navigate(appRoute.OPTION_OVERVIEW)}
              />
            )}
          </div>
        </AppPageContentWrapper>
      )}
      {!tariffOptionSuccess.isSuccessful && (
        <>
          {isTariffLoading || cancelTariffChangeToTheEndLoading || isLoading ? (
            <ScrollToTop>
              <LoadingScreen />
            </ScrollToTop>
          ) : (
            <Outlet />
          )}
        </>
      )}
    </>
  );
}

export default TariffOptionLayout;
