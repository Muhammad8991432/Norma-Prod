/* eslint-disable max-len */
import React, { useState } from 'react';
import { appIcons, appLinkStyle, appRoute } from '@utils/globalConstant';
import { Ta11yText, Link, BubbleTabs, PopupCampaignCard } from '@core/index';
import { useA11y } from '@context/Utils';
import { useTariff } from '@context/MobileOne';
import './TariffActive.scss';
import { replaceDynamicCmsContent, tA11y } from '@utils/a11y/a11yHelpers';
import useCmsImage from '@utils/useCmsImage';
import { useStaticContent } from '@context/StaticContent';
import { PopupModal } from '@part/index';
import { useNavigate } from 'react-router-dom';

export function TariffActive({
  data: {
    additionalInfo: {
      primaryColor
      // legalText
    },
    id,
    name,
    nameSpeed,
    header,
    duration,
    price,
    showInCsc
    // bullets,
    // strikeGB,
    // strikePrice,
    // bubbleSvg
  },
  isPaused = false,
  endDate = '30.4.2025',
  // updateDate = '15.06.2025',
  isPendingCard = false
}) {
  const { tA11yTranslate } = useA11y();
  const { getTariffName } = useTariff();
  const navigate = useNavigate();
  const { staticContentData } = useStaticContent();
  const tariffName = getTariffName(name, nameSpeed).content;
  const PDFsData = staticContentData?.nc_pdfPib?.listRedirection;
  const PDFData = PDFsData.find((pdf) => pdf.tariffID === id);

  const [showInCscClicked, setShowInCscClicked] = useState(false);
  const [showPausedClicked, setShowPausedClicked] = useState(false);

  const popupCampaignData = {
    id: 1,
    startDate: '',
    endDate: '',
    topClose: true,
    intialMonthDays: '',
    label: '',
    content: [
      {
        type: 'image',
        image: '',
        imageWeb: showPausedClicked ? 'nc_icon_paused_content1' : 'nc_icon_info_content1'
      },
      {
        type: 'headline',
        tag: 'h2',
        txt: showPausedClicked ? 'nc_tariff_popup_paused_hdl1' : 'nc_tariff_popup_lte_hdl1'
      },
      {
        type: 'copy',
        tag: 'p',
        txt: showPausedClicked ? 'nc_tariff_popup_paused_txt1' : 'nc_tariff_popup_lte_txt1'
      },

      {
        type: 'button',
        buttonTitle: showPausedClicked ? 'nc_tariff_popup_paused_btn1' : 'nc_tariff_popup_lte_btn1',
        buttonBackgroundcolor: '',
        buttonBackgroundcolorDark: '',
        buttonTitleColor: '',
        buttonTitleColorDark: '',
        variantWeb: 'DEFAULT',
        redirectionLink: '',
        redirectionLinkWeb: () => {
          if (showPausedClicked) {
            setShowPausedClicked(false);
            // MPS: Note: changed to new MPS topup overview page
            navigate(appRoute.MPS_TOPUP_OVERVIEW);
          }
          setShowInCscClicked(false);
        }
      }
    ]
  };

  if (showPausedClicked) {
    popupCampaignData.content.push({
      type: 'link',
      txt: 'nc_tariff_popup_paused_lnk1',
      action: 'closePopup'
    });
  }

  const getModalContent = () => (
    <PopupModal>
      <PopupCampaignCard
        data={popupCampaignData}
        onCardClose={() => {
          setShowInCscClicked(false);
          setShowPausedClicked(false);
        }}
      />
    </PopupModal>
  );

  return (
    <div
      className={`card py-8 px-6 rounded-3 ${
        isPaused ? 'bg-gray-80' : 'bg-darkgreen'
      } text-white tariff-active-main`}>
      {showInCscClicked || showPausedClicked ? getModalContent() : null}
      <div className="top-content">
        {!isPendingCard ? (
          <Ta11yText
            tag="h2"
            className="nc-doomsday-h3 mb-0"
            textContent={tA11yTranslate(
              isPaused ? 'nc_global_tariff_paused_card_hdl1' : 'nc_global_tariff_active_card_hdl1'
            )}
          />
        ) : (
          <Ta11yText
            tag="h2"
            className="nc-doomsday-h3 mb-0"
            textContent={tA11yTranslate('nc_global_tariff_change_card_hdl1')}
          />
        )}
        {!showInCsc && !isPaused ? (
          <Link
            onClick={() => setShowInCscClicked(true)}
            iconLeft="infowhite"
            iconHeight={16}
            linkStyle={`${appLinkStyle.WHITE} mt-3`}>
            <Ta11yText tag="span" textContent={tA11yTranslate('nc_global_tariff_lte_lnk1')} />
          </Link>
        ) : null}
        {isPaused ? (
          <Link
            onClick={() => setShowPausedClicked(true)}
            iconLeft="infowhite"
            iconHeight={16}
            linkStyle={`${appLinkStyle.WHITE} mt-3`}>
            <Ta11yText tag="span" textContent={tA11yTranslate('nc_global_tariff_paused_lnk1')} />
          </Link>
        ) : null}
      </div>
      <span className="w-100 border-bottom border-white-20 d-flex my-6 opacity-25" />
      <div className="bottom-content">
        <div className="header-section d-flex justify-content-between align-items-end">
          <Ta11yText
            tag="span"
            className="nc-doomsday-h2 m-0"
            textContent={tA11yTranslate(header)}
          />
          <div className="mb-3">
            <BubbleTabs text={tariffName} bubbleColor={primaryColor} index={1} />
          </div>
        </div>
        <div className="text-content mt-3 ">
          {/* {
                        bullets.map((bullet) => (
                            <Ta11yText
                                tag={'p'}
                                className='nc-realtextpro-copy text-white'
                                textContent={tA11yTranslate(bullet.bullet)}
                            />
                        ))
                    } */}
          {/* <Ta11yText
                        tag={'p'}
                        className='nc-realtextpro-copy'
                        textContent={{ content: 'Allnet+SMS Flat' }}
                    /> */}
          <p>
            <Ta11yText
              tag="span"
              className="nc-realtextpro-copy"
              textContent={tA11yTranslate(price)}
            />
            <Ta11yText
              tag="span"
              className="nc-realtextpro-copy"
              textContent={tA11yTranslate(duration)}
            />
          </p>
          {endDate && !isPaused && !isPendingCard && (
            <div className="mt-3">
              <Ta11yText
                tag="p"
                className="nc-realtextpro-footnote"
                textContent={replaceDynamicCmsContent(
                  tA11yTranslate('nc_global_tariff_active_card_available_until_txt1'),
                  '{date}',
                  endDate
                )}
              />
            </div>
          )}
          {isPendingCard && (
            <div className="mt-3">
              <Ta11yText
                tag="p"
                className="nc-realtextpro-footnote"
                textContent={replaceDynamicCmsContent(
                  tA11yTranslate('nc_global_tariff_change_card_available_from_txt1'),
                  '{TT.MM.YY}',
                  endDate
                )}
              />
            </div>
          )}
        </div>
        {PDFData?.name ? (
          <div className="bottom-link-content mt-5">
            <Link
              href={PDFData?.redirectionURL}
              iconLeft="docs"
              iconHeight={16}
              linkStyle={`${appLinkStyle.WHITE}`}>
              <Ta11yText tag="span" textContent={tA11yTranslate(PDFData?.name)} />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default TariffActive;
