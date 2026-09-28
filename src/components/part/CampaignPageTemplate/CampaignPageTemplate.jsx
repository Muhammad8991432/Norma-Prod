import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NavigationPageTitle,
  Ta11yText,
  ButtonPrimary,
  ButtonWrapper,
  Ta11yImage,
  ErrorSupportBox,
  Link
} from '@core/index';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { Icons } from '@core/Utils';
import { appButtonTypes, appLinkStyle, isExternalLink } from '@utils/globalConstant';
import useCmsImage from '@utils/useCmsImage';
import './CampaignPageTemplate.scss';

export function CampaignPageTemplate({
  campaignData,
  blocks = [],
  navigationTitle,
  navigationVariant = 'flex-xs',
  onBackClick,
  copyIconName = 'checkcirclemint',
  showError = false
}) {
  const navigate = useNavigate();

  // Functions
  const handleClick = (url) => {
    if (typeof url === 'function') {
      return url();
    }
    if (isExternalLink(url)) {
      return window.open(url, '_blank');
    }
    navigate(url);
    return url;
  };

  const handleButtonClick = (redirectUrl) => {
    if (redirectUrl) {
      if (isExternalLink(redirectUrl)) {
        return window.open(redirectUrl, '_blank');
      }
      navigate(redirectUrl);
    }
  };

  const renderContentItem = (item, index) => {
    const baseKey = `${item.type}-${index}`;
    switch (item.type) {
      case 'headline':
        return (
          <div key={baseKey} className="row w-100">
            <div className="col-12">
              <Ta11yText
                textContent={tA11y(item.txt)}
                className="nc-doomsday-h3"
                tag={item.tag || 'h2'}
              />
            </div>
          </div>
        );

      case 'image': {
        const imageContent = useCmsImage(item.imageWeb || item.imageSource);
        return (
          <div key={baseKey} className="row w-100">
            <div className="col-12 d-flex justify-content-center">
              {imageContent && (
                <Ta11yImage imageContent={imageContent} className="img-fluid campaign-img" />
              )}
            </div>
          </div>
        );
      }

      case 'copy':
        return (
          <div key={baseKey} className="row w-100">
            <div className="col-12 d-flex align-items-center">
              <Ta11yText
                textContent={tA11y(item.txt)}
                className="nc-realtextpro-copy mb-0"
                tag={item.tag || 'p'}
              />
            </div>
          </div>
        );

      case 'iconCopy':
        return (
          <div key={baseKey} className="row w-100">
            <div className="col-12 d-flex align-items-center">
              <div className="me-4 d-flex align-items-center">
                <Icons name={item.iconSourceWeb || copyIconName} width={24} height={24} colorType="primary" />
              </div>
              <Ta11yText
                textContent={tA11y(item.txt)}
                className="nc-realtextpro-copy"
                tag={item.tag || 'p'}
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div key={baseKey} className='w-100'>
            <ButtonWrapper>
              <ButtonPrimary
                buttonContent={tA11y(item.buttonTitle)}
                onClick={() => handleButtonClick(item.redirectionLinkWeb || item.redirectionLink)}
                buttonType={appButtonTypes.PRIMARY[item?.variantWeb || 'DEFAULT']}
                customClass="justify-content-center"
                icon={item.buttonIconWeb}
              />
            </ButtonWrapper>
          </div>
        );

      case 'link':
        return (
          <div className="text-center" key={index}>
            <Link
              onClick={() => {
                if (item.action) {
                  onCardClose(data.id);
                } else {
                  handleClick(item.redirectionLinkWeb);
                }
              }}
              iconLeft={item.iconVariant == "iconLeft" ? item.iconSourceWeb : null}
              iconRight={item.iconVariant == "iconRight" ? item.iconSourceWeb : null}
              iconColorType="dark" // for high contrast mode
              linkStyle={appLinkStyle.PRIMARY}>
              <Ta11yText textContent={tA11y(item.txt)} tag="span" />
            </Link>
          </div>
        );

      case 'footnote':
        return (
          <div key={baseKey} className="row w-100">
            <div className="col-12">
              <Ta11yText
                textContent={tA11y(item.txt)}
                className="nc-realtextpro-footnote"
                tag={item.tag || 'p'}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="campaign-page-template d-flex flex-column gap-16">
      <div className="row">
        <div className="col-12">
          <NavigationPageTitle
            title={navigationTitle || tA11y(campaignData.campaignName)}
            variant={navigationVariant}
            isBackButton
            onButtonClick={onBackClick}
          />
        </div>
      </div>
      {showError && (
        <div className="row mt-12">
          <div className="col-12">
            <ErrorSupportBox isGenericApiError />
          </div>
        </div>
      )}
      <div className='d-flex align-items-center flex-column gap-6'>
        {!showError && blocks.map((item, index) => renderContentItem(item, index))}
      </div>
    </div>
  );
}

export default CampaignPageTemplate;
