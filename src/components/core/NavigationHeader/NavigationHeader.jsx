/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@dom-digital-online-media/dom-auth-sdk';
import { useLayout } from '@context/Utils';
import { useAccount, useActivation } from '@context/MobileOne';
import { appRoute } from '@utils/globalConstant';
import Icons from '@core/Utils/Icons/Icons';
import { useA11y } from '@context/Utils/A11y';
import { Logo, NavigationLink, PopupCampaignCard } from '@core/index';
import './NavigationHeader.scss';
import { PopupModal } from '@part/PopupModal';

function IconLogin() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_501_19318)">
        <path
          d="M6.16429 22.125H2.84522C2.445 22.125 2.20354 21.9016 2.09526 21.7685C1.90833 21.5385 1.8359 21.2393 1.8967 20.9473C2.87025 16.271 6.99712 12.8559 11.7613 12.7451C11.8407 12.748 11.9202 12.75 12.0002 12.75C12.081 12.75 12.1612 12.748 12.2413 12.745C13.4062 12.7716 14.5442 12.9906 15.6273 13.3973C16.112 13.5795 16.6525 13.334 16.8345 12.8492C17.0166 12.3645 16.7712 11.824 16.2864 11.642C16.1312 11.5837 15.9749 11.5291 15.8179 11.4774C17.3695 10.3135 18.3752 8.45948 18.3752 6.375C18.3752 2.85984 15.5154 0 12.0002 0C8.48503 0 5.62523 2.85984 5.62523 6.375C5.62523 8.46136 6.63267 10.3168 8.18662 11.4805C6.76298 11.9492 5.42704 12.678 4.25789 13.6397C2.1142 15.403 0.623716 17.8625 0.0610756 20.5651C-0.115268 21.412 0.0959506 22.2818 0.640591 22.9515C1.18247 23.6178 1.98604 24 2.84522 24H6.16429C6.68208 24 7.10179 23.5803 7.10179 23.0625C7.10179 22.5447 6.68208 22.125 6.16429 22.125ZM7.50023 6.375C7.50023 3.89367 9.5189 1.875 12.0002 1.875C14.4816 1.875 16.5002 3.89367 16.5002 6.375C16.5002 8.78283 14.5993 10.7549 12.2193 10.8696C12.1463 10.8683 12.0734 10.8672 12.0002 10.8672C11.9269 10.8672 11.8537 10.8682 11.7804 10.8696C9.40083 10.7545 7.50023 8.78259 7.50023 6.375Z"
          fill="currentColor"
        />
        <path
          d="M23.2823 16.1535C22.881 15.2558 21.977 14.6742 20.9772 14.6719H18.0535C18.0514 14.6719 18.0494 14.6719 18.0472 14.6719C16.9925 14.6719 16.0724 15.2934 15.7021 16.2566C15.6529 16.3847 15.5926 16.5462 15.5298 16.7344H9.39167C9.13822 16.7344 8.89559 16.837 8.71901 17.0188L7.10858 18.6776C6.75387 19.043 6.75565 19.6246 7.11256 19.9878L8.75319 21.6571C8.92944 21.8364 9.17037 21.9375 9.42181 21.9375H12.4687C12.9865 21.9375 13.4062 21.5177 13.4062 21C13.4062 20.4822 12.9865 20.0625 12.4687 20.0625H9.8149L9.09172 19.3266L9.78814 18.6094H16.233C16.6649 18.6094 17.0409 18.3143 17.1436 17.8948C17.2195 17.5851 17.3146 17.2874 17.4522 16.9294C17.543 16.6933 17.7709 16.5469 18.0495 16.5469H20.975C21.2401 16.5475 21.4683 16.69 21.5705 16.9187C21.8222 17.4818 22.1227 18.3534 22.1249 19.3087C22.1272 20.271 21.827 21.1626 21.5747 21.7412C21.473 21.9745 21.2428 22.125 20.9859 22.125H18.0254C17.766 22.1244 17.5231 21.9575 17.4209 21.7098C17.3112 21.444 17.2162 21.1404 17.1304 20.7818C17.0099 20.2783 16.5038 19.9678 16.0005 20.0882C15.4969 20.2087 15.1864 20.7147 15.3069 21.2182C15.4157 21.6728 15.5403 22.0675 15.6876 22.4247C16.0813 23.3792 16.9972 23.9976 18.0232 24H20.9822C20.9842 24 20.9861 24 20.9881 24C21.989 23.9999 22.8935 23.4079 23.2934 22.4905C23.6174 21.7475 24.003 20.5916 23.9999 19.3042C23.9969 18.0203 23.608 16.8822 23.2823 16.1535Z"
          fill="currentColor"
        />
        <path
          d="M20.2031 20.25C20.7209 20.25 21.1406 19.8303 21.1406 19.3125C21.1406 18.7947 20.7209 18.375 20.2031 18.375C19.6853 18.375 19.2656 18.7947 19.2656 19.3125C19.2656 19.8303 19.6853 20.25 20.2031 20.25Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_501_19318">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

function IconLogout() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_494_6583)">
        <path
          d="M12 0C12.5681 0 13.0286 0.460513 13.0286 1.02857C13.0286 1.59663 12.5681 2.05715 12 2.05715C6.50873 2.05715 2.05715 6.50873 2.05715 12C2.05715 17.4914 6.50873 21.9429 12 21.9429C12.5681 21.9429 13.0286 22.4034 13.0286 22.9715C13.0286 23.5395 12.5681 24 12 24C5.37259 24 0 18.6275 0 12C0 5.37259 5.37259 0 12 0Z"
          fill="currentColor"
        />
        <path
          d="M18.1299 8.61303C17.7282 8.21135 17.7282 7.56009 18.1299 7.15841C18.5316 6.75673 19.1827 6.75673 19.5844 7.15841L23.6987 11.2727C24.1004 11.6744 24.1004 12.3256 23.6987 12.7273L19.5844 16.8416C19.1827 17.2433 18.5316 17.2433 18.1299 16.8416C17.7282 16.4399 17.7282 15.7887 18.1299 15.387L20.4882 13.0286H9.25716C8.6891 13.0286 8.22858 12.5681 8.22858 12C8.22858 11.432 8.6891 10.9714 9.25716 10.9714H20.4882L18.1299 8.61303Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_494_6583">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function NavigationHeader() {
  const [isMobile, setMobile] = useState(window.innerWidth <= 1200);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const location = useLocation();
  const { isUserLoggedIn } = useAuth();
  const { isLogoutClicked, setIsLogoutClicked, onLogoutPress } = useAccount();
  const { showHeader, setShowFooter } = useLayout();
  const { phoneNumberInitialValue, setPhoneNumberActivationForm } = useActivation();
  const { tA11yTranslate } = useA11y();

  // Functions
  // Used to determine if the current route is active (active nav link has different style and isn't clickable)
  const isActiveRoute = (route) => location.pathname.startsWith(route);
  const isExactActiveRoute = (route) => location.pathname === route;

  const handleToggleOffcanvas = () => {
    setShowOffcanvas((prev) => !prev);
  };

  const onClickBack = () => {
    setPhoneNumberActivationForm(phoneNumberInitialValue);
  };

  const hideLogoutModal = () => {
    setIsLogoutClicked(false);
    setShowFooter(true);
  };

  useEffect(() => {
    hideLogoutModal();
    const handleResizeScreen = () => {
      setMobile(window.innerWidth < 1200);
    };

    handleResizeScreen();
    window.addEventListener('resize', handleResizeScreen);

    return () => {
      window.removeEventListener('resize', handleResizeScreen);
    };
  }, []);

  useEffect(() => {
    setShowOffcanvas(false);
  }, [location]);

  useEffect(() => {
    if (isLogoutClicked) {
      setShowFooter(false);
    }
  }, [isLogoutClicked]);

  const popupLogoutData = {
    id: 1,
    startDate: '',
    endDate: '',
    intialMonthDays: '',
    topClose: true,
    label: '',
    content: [
      {
        type: 'image',
        image: 'nc_account_logout_content-1',
        imageWeb: 'nc_account_logout_content-1'
      },
      {
        type: 'headline',
        tag: 'h2',
        txt: 'nc_account_logout_popup_hdl1'
      },
      {
        type: 'button',
        buttonTitle: 'nc_account_logout_popup_btn1',
        buttonBackgroundcolor: '',
        buttonBackgroundcolorDark: '',
        buttonTitleColor: '',
        buttonTitleColorDark: '',
        variantWeb: 'mint',
        redirectionLink: '',
        redirectionLinkWeb: () => onLogoutPress()
      },
      {
        type: 'link',
        txt: 'nc_account_logout_popup_lnk1',
        action: 'closePopup'
      }
    ]
  };

  return (
    <>
      <div className={`${showHeader ? 'z-3' : ''}`}>
        {location.pathname === appRoute.DASHBOARD && (
          <span className="visually-hidden" aria-hidden="true" id="dashboard-welcome-text">
            {tA11yTranslate('nc_dboard_welcome_txt').content}
          </span>
        )}
        <nav
          className="navbar-custom navbar-expand-xl d-flex align-items-center"
          style={{ minHeight: '80px' }}>
          <div className="container-md w-100">
            <div className="row px-3 px-md-0">
              <div className="col-12 col-md-8 offset-md-2">
                <div className="d-flex justify-content-between align-items-center flex-grow-1">
                  {isUserLoggedIn ? (
                    <NavigationLink
                      to={appRoute.DASHBOARD}
                      isActiveNavLink={isActiveRoute(appRoute.DASHBOARD)}>
                      <Logo variant="mintWhite" height="56.105px" />
                    </NavigationLink>
                  ) : (
                    <NavigationLink
                      to={appRoute.LANDING_PAGE}
                      onClick={onClickBack}
                      isActiveNavLink={isExactActiveRoute(appRoute.LANDING_PAGE)}>
                      <Logo variant="mintWhite" height="56.105px" />
                    </NavigationLink>
                  )}
                  {location.pathname !== appRoute.INACTIVE_CUSTOMER ? <button
                    className="navbar-toggler border-0 bg-transparent d-xl-none"
                    type="button"
                    onClick={handleToggleOffcanvas}
                    aria-label={tA11yTranslate('nc_global_icn_open_menu_aria').ariaLabel}>
                    <Icons name="iconBurger" colorType="dark" />
                  </button> : null}

                  <div
                    className={`offcanvas offcanvas-end ${showOffcanvas ? 'show vh-100' : ''}`} // NOTE: close transition does not work smoothly
                    tabIndex="-1"
                    id="offcanvasNavbar"
                    style={{ width: showOffcanvas ? '100%' : '0%' }}>
                    <div className="offcanvas-header px-0" style={{ minHeight: '80px' }}>
                      <div className="container-md w-100">
                        <div className="row px-3 px-md-0">
                          <div className="col-12 col-md-8 offset-md-2">
                            <div className="d-flex justify-content-between align-items-center flex-grow-1">
                              <NavigationLink
                                to={appRoute.LANDING_PAGE}
                                isActiveNavLink={isActiveRoute(appRoute.LANDING_PAGE)}>
                                <Logo variant="mintWhite" height="56.105px" />
                              </NavigationLink>
                              <button
                                type="button"
                                onClick={handleToggleOffcanvas}
                                aria-label={
                                  tA11yTranslate('nc_global_icn_close_menu_aria').ariaLabel
                                }
                                className="border-0 bg-transparent">
                                <Icons name="iconClose" colorType="dark" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`offcanvas-body animate__animated animate__fadeInRightBig animate__delay ${isMobile ? 'offcanvas-body-mobile' : ''
                        }`}>
                      {location.pathname !== appRoute.INACTIVE_CUSTOMER ? <ul className="navbar-nav mx-auto justify-content-end flex-grow-1 col-12 col-sm-8 px-2 px-sm-3 px-md-4 px-lg-0 ps-xl-3 py-15 py-xl-0">
                        {isUserLoggedIn ? (
                          <>
                            <span className="d-xl-flex justify-content-xl-center flex-xl-grow-1">
                              <li className="nav-item ps-xl-6 pe-xl-8">
                                <NavigationLink
                                  to={appRoute.DASHBOARD}
                                  isMobile={isMobile}
                                  isActiveNavLink={isActiveRoute(appRoute.DASHBOARD)}>
                                  {tA11yTranslate('nc_global_login_nav_hme_txt').content}
                                </NavigationLink>
                              </li>
                              <li className="nav-item pe-xl-8">
                                <NavigationLink
                                  to={appRoute.TARIFF_OPTION}
                                  isMobile={isMobile}
                                  isActiveNavLink={isActiveRoute(appRoute.TARIFF_OPTION)}>
                                  {tA11yTranslate('nc_global_login_nav_trf_txt').content}
                                </NavigationLink>
                              </li>
                              <li className="nav-item pe-xl-8">
                                <NavigationLink
                                  // MPS: Note: changed to new MPS topup overview page
                                  to={appRoute.MPS_TOPUP_OVERVIEW}
                                  isMobile={isMobile}
                                  // MPS: Note: changed to new MPS topup overview page
                                  isActiveNavLink={isActiveRoute(appRoute.MPS_TOPUP_BASE)}>
                                  {tA11yTranslate('nc_global_login_nav_topup_txt').content}
                                </NavigationLink>
                              </li>
                              <li className="nav-item pe-xl-8">
                                <NavigationLink
                                  to={appRoute.NEWS}
                                  isMobile={isMobile}
                                  isActiveNavLink={isActiveRoute(appRoute.NEWS)}>
                                  {tA11yTranslate('nc_global_login_nav_news_txt').content}
                                </NavigationLink>
                              </li>
                              <li className="nav-item pe-xl-8">
                                <NavigationLink
                                  to={appRoute.ACCOUNT}
                                  isMobile={isMobile}
                                  isActiveNavLink={isActiveRoute(appRoute.ACCOUNT) || isActiveRoute(appRoute.MPS_ACCOUNT_BASE)}>
                                  {tA11yTranslate('nc_global_login_nav_knto_txt').content}
                                </NavigationLink>
                              </li>
                            </span>
                            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
                            <li className="nav-item">
                              <NavigationLink
                                iconRight={<IconLogout />}
                                isMobile={isMobile}
                                onClick={() => setIsLogoutClicked(true)}>
                                <span>
                                  {/* Logout nav link */}
                                  {tA11yTranslate('nc_login_nav_lnk1').content}
                                </span>
                              </NavigationLink>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="nav-item pe-xl-8">
                              <NavigationLink
                                to={appRoute.ACTIVATION}
                                isMobile={isMobile}
                                onClick={onClickBack}
                                isActiveNavLink={isActiveRoute(appRoute.ACTIVATION)}>
                                {tA11yTranslate('nc_reg_nav_lnk1').content}
                              </NavigationLink>
                            </li>

                            <li className="nav-item">
                              <NavigationLink
                                to={appRoute.LOGIN}
                                isMobile={isMobile}
                                iconRight={<IconLogin />}
                                onClick={onClickBack}
                                isActiveNavLink={isActiveRoute(appRoute.LOGIN)}>
                                <span> {tA11yTranslate('nc_reg_nav_lnk2').content}</span>
                              </NavigationLink>
                            </li>
                          </>
                        )}
                      </ul> : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {isLogoutClicked && (
        <PopupModal>
          <PopupCampaignCard data={popupLogoutData} onCardClose={hideLogoutModal} />
        </PopupModal>
      )}
    </>
  );
}

export default NavigationHeader;
