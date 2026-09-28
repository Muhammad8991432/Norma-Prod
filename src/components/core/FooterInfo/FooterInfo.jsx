import React from 'react';
import useCmsImage from '@utils/useCmsImage';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { AppPageContentWrapper } from '@part/AppPageContentWrapper';
import { Ta11yImage } from '@core/index';

export function FooterInfo({ infoText }) {
  const imageContentIos = useCmsImage('nc_appstore_badge');
  const imageContentAndroid = useCmsImage('nc_playstore_badge');
  const linkContentIos = tA11y('nc_ftr_app_store_lnk1');
  const linkContentAndroid = tA11y('nc_ftr_play_store_lnk1');

  return (
    <div className="bg-primary py-4">
      <AppPageContentWrapper containerType="noPadding">
        <div className="row">
          <div className="col-sm-7 col-lg-9 d-flex align-items-center">
            <p className="nc-realtextpro-footnote text-white mb-4 mb-sm-0">{infoText}</p>
          </div>
          <div className="col-sm-5 col-lg-3 d-flex align-items-center justify-content-center justify-content-lg-start">
            <ul className="list-unstyled d-flex gap-3 m-0">
              <li>
                <a
                  className="d-inline-block"
                  href={linkContentIos.url}
                  aria-label={linkContentIos.ariaLabel}
                  target="_blank"
                  rel="noreferrer">
                  <Ta11yImage
                    imageContent={imageContentIos}
                    // style={{ height: '29.556px' }}
                  />
                </a>
              </li>
              <li>
                <a
                  className="d-inline-block"
                  href={linkContentAndroid.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={linkContentAndroid.ariaLabel}
                  >
                  <Ta11yImage
                    imageContent={imageContentAndroid}
                    // style={{ height: '29.556px' }}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </AppPageContentWrapper>
    </div>
  );
}

export default FooterInfo;
