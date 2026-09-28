import React from 'react';
import './FooterMain.scss';
import { useLayout } from '@context/Utils';
import Icons from '@core/Utils/Icons/Icons';
import { AppPageContentWrapper } from '@part/AppPageContentWrapper';
import { Logo, FooterInfo, FooterLinks } from '@core/index';
import useCmsImage from '@utils/useCmsImage';
import { Ta11yImage } from '@core/index';
import { useA11y } from '@context/Utils/A11y';

export function FooterMain() {
  const { showFooter } = useLayout();
  const { tA11yTranslate } = useA11y();

  const phoneNumber1Content = tA11yTranslate('nc_ftr_txt2').content;
  const email1Content = tA11yTranslate('nc_ftr_txt7');
  const phoneNumber2Content = tA11yTranslate('nc_ftr_txt5').content;
  const linkContentChip = tA11yTranslate('nc_ftr_chip_lnk1');

  return (
    <div>
      {showFooter && (
        <footer>
          <FooterInfo infoText={tA11yTranslate('nc_ftr_txt1').content} />

          <div className="bg-mint-60 py-8">
            <AppPageContentWrapper containerType="noPadding">
              <div className="row pb-10">
                <div className="col-12 col-sm-10 pe-0 pe-lg-10">
                  <div>
                    <div className="pb-10">
                      {/* <NavigationLink> */}
                      <Logo variant="yellow" height="65.218px" />
                      {/* </NavigationLink> */}
                    </div>
                    <div className="pb-10 pb-sm-0">
                      <p className="pb-4 nc-doomsday-h5">{tA11yTranslate('nc_ftr_hdl1').content}</p>
                      <div className="pb-2">
                        <span>
                          <a
                            tabIndex={0}                            
                            href={`tel: ${phoneNumber1Content}`}
                            aria-label={`${tA11yTranslate('nc_logo_phone_alt').ariaLabel} ${phoneNumber1Content}`}
                            className="nc-link-doomsday">
                              <Icons
                                name="calldarkgreen"
                                height={16}      
                                colorType="dark" // for high contrast mode
                                containerClass="d-inline-block me-10px"
                              />
                            <span>{phoneNumber1Content}</span>
                          </a>
                        </span>
                      </div>
                      <div className="pb-2">
                        <span>
                          {/* <Link
                            key={'email1'}
                            linkStyle={`${appLinkStyle.PRIMARY} mb-3`}
                            href={email1Content.url}
                            iconColorType="dark"
                            >
                            <Ta11yText tag="span" textContent={email1Content} className="ms-10px" />
                          </Link> */}
                          <a
                            tabIndex={0}
                            href={email1Content.url}
                            aria-label={`${tA11yTranslate('nc_logo_email_alt').ariaLabel} ${email1Content.content}`}
                            className="nc-link-doomsday mb-3">
                              <Icons
                                name="maildarkgreen"
                                colorType="dark" // for high contrast mode                                
                                height={16}
                                containerClass="d-inline-block me-10px"
                              />
                              {email1Content.content}
                          </a>
                        </span>
                      </div>
                      <div className="nc-realtextpro-footnote">
                        <p className="pb-1">{tA11yTranslate('nc_ftr_txt3').content}</p>
                        <p className="pb-6">{tA11yTranslate('nc_ftr_txt4').content}</p>
                      </div>
                      <div className="pb-2">
                        <span>
                          <a
                            tabIndex={0}
                            href={`tel: ${phoneNumber2Content}`}
                            aria-label={`${tA11yTranslate('nc_logo_mobile_alt').ariaLabel} ${phoneNumber2Content}`}
                            className="nc-link-doomsday">
                              <Icons
                                name="phonedarkgreen"
                                height={16}
                                colorType="dark" // for high contrast mode
                                containerClass="d-inline-block me-10px"
                              />
                            {phoneNumber2Content}
                          </a>
                        </span>
                      </div>
                      <p className="nc-realtextpro-footnote">
                        {tA11yTranslate('nc_ftr_txt6').content}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-2 px-md-0 d-sm-flex flex-column align-items-end justify-content-end">
                  <div>
                    <a
                      className="d-inline-block"
                      href={linkContentChip.url}
                      target="_blank"
                      rel="noreferrer">
                      <Ta11yImage imageContent={useCmsImage('nc_footer_chip_logo_img1')} />
                    </a>
                  </div>
                </div>
              </div>

              <FooterLinks />
            </AppPageContentWrapper>
          </div>
        </footer>
      )}
    </div>
  );
}

export default FooterMain;
