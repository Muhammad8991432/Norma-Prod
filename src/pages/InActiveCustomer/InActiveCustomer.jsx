import React, { useEffect } from 'react';
import { AppPageContentWrapper } from '@part/index';
import Ta11yText from '@core/Ta11yText';
import { replaceDynamicCmsContent } from '@utils/a11y/a11yHelpers';
import { useA11y, useLayout } from '@context/Utils';
import { useAccount, useCustomer } from '@context/MobileOne';
import "./InActiveCustomer.scss";
import Ta11yImage from '@core/Ta11yImage';
import useCmsImage from '@utils/useCmsImage';
import { InfoBoxSupport } from '@core/InfoBoxSupport';
import { ButtonPrimary } from '@core/ButtonPrimary';
import { appButtonTypes } from '@utils/globalConstant';

export function InActiveCustomer() {
  const { tA11yTranslate } = useA11y();
  const { personalData: { firstName = '' } } = useCustomer();
  const { onLogoutPress } = useAccount();
  const { setShowHeader } = useLayout();

  useEffect(() => {
    setShowHeader(true)
  }, [])

  const getHeadlineWithName = (foreName) => {
    const headlineContent = tA11yTranslate('nc_dboard_hdl1');
    let updatedHeadlineContent;
    if (foreName) {
      updatedHeadlineContent = replaceDynamicCmsContent(headlineContent, '{Vorname}', foreName);
      return updatedHeadlineContent;
    }
    updatedHeadlineContent = replaceDynamicCmsContent(headlineContent, /\s{Vorname}/, '');
    return updatedHeadlineContent;
  };
  
  return (
    <>
      <AppPageContentWrapper>
        <div className='in-active-customer-section'>
          <div className="w-100 pt-8">
            <Ta11yText
              textContent={getHeadlineWithName(firstName)}
              className="nc-doomsday-h3 m-0"
              tag="h1"
            />
          </div>
          <div className="card-container rounded-3 pt-17 px-6 mt-8 text-center">
            <Ta11yText
              textContent={tA11yTranslate('nc_dboard_new_inrealisation_hdl1')}
              className="nc-doomsday-h3 m-0"
              tag="h2"
            />
            <Ta11yText
              textContent={tA11yTranslate('nc_dboard_new_inrealisation_txt1')}
              className="nc-realtextpro-copy text-gray-100 m-0"
              tag="p"
            />
            <Ta11yImage
              imageContent={useCmsImage('nc_dboard_new_inrealisation_app_content-1')}
            />
          </div>
          <div className='py-8'>
            <InfoBoxSupport />
          </div>
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <ButtonPrimary
                buttonContent={tA11yTranslate('nc_dboard_new_inrealisation_btn1')}
                onClick={() => onLogoutPress()}
                buttonType={appButtonTypes.PRIMARY.DEFAULT}
              />
            </div>
          </div>
        </div>
      </AppPageContentWrapper>
    </>
  );
}

export default InActiveCustomer;
