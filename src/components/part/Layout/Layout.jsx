/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { appRoute } from '@utils/globalConstant';
import { Meta } from '@core/Meta';
import { useA11y } from '@context/Utils/A11y';
import { useTitle } from '@context/Utils/Title';

export function withLayout(WrappedComponent) {
  // Wrap all of the components into one layout.
  function Layout(props) {
    const location = useLocation();
    const { announceTitle } = useTitle();
    const { tA11yTranslate, getGlobalMetaTitles } = useA11y();
    const hasAnnouncedRef = useRef(false);
    const currentPathRef = useRef(location.pathname);

    // META: Page titles
    // NOTE: To override the page titles defined in this file, import the `Meta` component directly into the desired page and set the title there.

    // global page titles
    const { globalPageTitle, globalSuccessPageTitle, globalErrorPageTitle } = getGlobalMetaTitles();

    // main pages page titles
    const homePageTitle = tA11yTranslate('nc_global_meta_title_hme').content;
    // const activationPageTitle = tA11yTranslate('nc_global_meta_title_activation').content;  // this is handled in src/pages/Activation/Step0/Step0.jsx
    const loginPageTitle = tA11yTranslate('nc_global_meta_title_login').content;
    const tariffPageTitle = tA11yTranslate('nc_global_meta_title_trf').content;
    const tariffOptPageTitle = tA11yTranslate('nc_global_meta_title_trf-opt').content;
    const tariffRoamPageTitle = tA11yTranslate('nc_global_meta_title_trf-roam').content;
    const topupPageTitle = tA11yTranslate('nc_global_meta_title_topup').content;
    const helpServicePageTitle = tA11yTranslate('nc_global_meta_title_srvc').content;
    const accountPageTitle = tA11yTranslate('nc_global_meta_title_knto').content;
    const errorPageTitle = tA11yTranslate('nc_global_meta_title_404_txt').content;

    // subpages: login page titles
    const loginForgotPasswordPageTitle = tA11yTranslate('nc_global_meta_title_forget_pw').content;
    const changeEmailPageTitle = tA11yTranslate('nc_global_meta_title_change-email').content;
    const newEmailPageTitle = tA11yTranslate('nc_global_meta_title_new-pw').content;
    const changeHotlinePinPageTitle = tA11yTranslate('nc_global_meta_title_change-hlp').content;
    const evnDetailsPageTitle = tA11yTranslate('nc_global_meta_title_evn-details').content;
    const topUp2PageTitle = tA11yTranslate('nc_global_meta_title_topup2').content;

    const cancelContractPageTitle = tA11yTranslate('nc_global_meta_title_terminat').content;
    const consentPageTitle = tA11yTranslate('nc_global_meta_title_consent').content;
    const consentDetailsPageTitle = tA11yTranslate('nc_global_meta_title_consent-details').content;

    // subpages: account // post-login page titles
    const accountPersonalDataPageTitle = tA11yTranslate('nc_global_meta_title_pers_data').content;
    // const accountTopupsPageTitle = tA11yTranslate('nc_global_meta_title_topup2').content;
    const accountReferFriendPageTitle = tA11yTranslate('nc_global_meta_title_ref_friend').content;
    const accountConsentPageTitle = tA11yTranslate('nc_global_meta_title_consent').content;
    // const accountCancelPageTitle = tA11yTranslate('nc_global_meta_title_terminat').content;
    // const accountLogoutPageTitle = tA11yTranslate('nc_global_meta_title_logout').content;
    const campaignSpecialOptionPageTitle = tA11yTranslate(
      'nc_global_meta_title_campaign_cushion'
    ).content;

    const helpServiceContactPageTitle = tA11yTranslate('nc_global_meta_title_srvc_cntct').content;
    const helpServiceFaqPageTitle = tA11yTranslate('nc_global_meta_title_srvc_fq').content;
    const helpServiceVideoPageTitle = tA11yTranslate('nc_global_meta_title_srvc_vd').content;
    const helpServiceLegalPageTitle = tA11yTranslate('nc_global_meta_title_srvc_lgl').content;
    const helpServiceAccssbltyPageTitle = tA11yTranslate(
      'nc_global_meta_title_srvc_accssblty'
    ).content;
    const helpServiceSimLockPageTitle = tA11yTranslate('nc_global_meta_title_srvc_sm-lck').content;

    const routeToTitleMap = {
      // for exact route matches
      [appRoute.LANDING_PAGE]: `${homePageTitle}`,
      // [appRoute.ACTIVATION]: `${activationPageTitle}`, // this is handled in src/pages/Activation/Step0/Step0.jsx
      [appRoute.LOGIN]: `${loginPageTitle}`,
      [appRoute.DASHBOARD]: `${homePageTitle}`,
      [appRoute.TARIFF_OVERVIEW]: `${tariffPageTitle}`,
      [appRoute.OPTION_OVERVIEW]: `${tariffOptPageTitle}`,
      [appRoute.AUSLAND_OVERVIEW]: `${tariffRoamPageTitle}`,
      // MPS: this entry needs to be checked
      [appRoute.TOPUP]: `${topupPageTitle}`,
      [appRoute.HELP_SERVICES_OVERVIEW]: `${helpServicePageTitle}`,
      [appRoute.ACCOUNT_OVERVIEW]: `${accountPageTitle}`,
      [appRoute.NOT_FOUND]: `${errorPageTitle}`,
      [appRoute.FORGOT_PASSWORD]: `${loginForgotPasswordPageTitle}`,
      [appRoute.ACCOUNT_PRIVATE_DATA_CHANGE_EMAIL]: `${changeEmailPageTitle}`,
      [appRoute.ACCOUNT_PRIVATE_DATA_NEW_PASSWORD]: `${newEmailPageTitle}`,
      [appRoute.ACCOUNT_PRIVATE_DATA_CHANGE_HOTLINE_PIN]: `${changeHotlinePinPageTitle}`,
      [appRoute.ACCOUNT_PRIVATE_DATA_EVN_DETAILS]: `${evnDetailsPageTitle}`,
      [appRoute.ACCOUNT_CANCEL_CONTRACT]: `${cancelContractPageTitle}`,
      [appRoute.ACCOUNT_PRIVATE_DATA_CHANGE_CONSENT]: `${consentPageTitle}`,
      [appRoute.ACCOUNT_DATENPOLSTER]: `${campaignSpecialOptionPageTitle}`,

      [appRoute.CONSENT_DATA_DETAILS]: `${consentDetailsPageTitle}`,

      // subpages: account
      [appRoute.ACCOUNT_PRIVATE_DATA]: `${accountPersonalDataPageTitle}`,
      [appRoute.ACCOUNT_REFER_FRIEND]: `${accountReferFriendPageTitle}`,
      [appRoute.ACCOUNT_DOCUMENT]: `${accountConsentPageTitle}`,
      [appRoute.HELP_SERVICES_CONTACT]: `${helpServiceContactPageTitle}`,
      [appRoute.HELP_SERVICES_FAQ]: `${helpServiceFaqPageTitle}`,
      [appRoute.HELP_SERVICES_VIDEO]: `${helpServiceVideoPageTitle}`,
      [appRoute.HELP_SERVICES_LEGAL]: `${helpServiceLegalPageTitle}`,
      [appRoute.HELP_SERVICES_ACCESSIBILITY]: `${helpServiceAccssbltyPageTitle}`,
      [appRoute.HELP_SERVICES_SIM_LOCK]: `${helpServiceSimLockPageTitle}`,

      // for nested routes
      prefix: [
        { prefix: appRoute.TARIFF_OPTION, title: `${tariffPageTitle}` },
        // { prefix: appRoute.TOPUP, title: `${topupPageTitle}` },
        { prefix: appRoute.HELP_SERVICES, title: `${helpServicePageTitle}` },
        { prefix: appRoute.ACCOUNT, title: `${accountPageTitle}` }
      ],

      // titles are read on these pages, this is used to bypass the prefix check for nested routes
      // MPS: this entry needs to be checked
      excludeInPrefixCheck: [
        appRoute.ACCOUNT_CONTRACT_DETAILS,
        appRoute.TOPUP_ONLINE_CALLBACK,
        appRoute.MPS_TOPUP_RESULT
      ]
    };

    function getPageTitleForPath(currentRoute) {
      // check for exact route matches
      if (routeToTitleMap[currentRoute]) {
        return `${globalPageTitle} - ${routeToTitleMap[currentRoute]}`;
      }
      // check for nested routes
      if (routeToTitleMap.prefix) {
        if (!routeToTitleMap.excludeInPrefixCheck.includes(currentRoute)) {
          const matched = routeToTitleMap.prefix.find(({ prefix }) =>
            currentRoute.startsWith(prefix)
          );
          if (matched) {
            return `${globalPageTitle} - ${matched.title}`;
          }
        }
      }

      if (!routeToTitleMap.excludeInPrefixCheck.includes(currentRoute)) {
        // fallback
        return globalPageTitle;
      }
      return false; // return false if no match found
    }

    const pageTitle = getPageTitleForPath(location.pathname);

    const isTranslationReady =
      pageTitle &&
      !pageTitle.includes('nc_global_meta_title') &&
      globalPageTitle &&
      !globalPageTitle.includes('nc_global_meta_title');

    if (currentPathRef.current !== location.pathname) {
      hasAnnouncedRef.current = false;
      currentPathRef.current = location.pathname;
    }

    useEffect(() => {
      if (isTranslationReady && !hasAnnouncedRef.current) {
        const timeoutId = setTimeout(() => {
          announceTitle(pageTitle, true);
          hasAnnouncedRef.current = true;
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    }, [isTranslationReady, pageTitle, announceTitle]);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (isTranslationReady && !hasAnnouncedRef.current) {
          announceTitle(pageTitle, true);
          hasAnnouncedRef.current = true;
        }
      }, 800);

      return () => clearTimeout(timeoutId);
    }, []);

    const isSpecialRoute = [
      '/activation',
      // '/force-password-change',
      '/forgot-password',
      '/'
    ].includes(location.pathname);

    if (isSpecialRoute) {
      return (
        <div>
          {isTranslationReady && <Meta title={pageTitle} key={`meta-step-${pageTitle}`} />}
          <WrappedComponent {...props} />
        </div>
      );
    }

    return (
      <>
        {isTranslationReady && <Meta title={pageTitle} key={`meta-step-${pageTitle}`} />}
        <WrappedComponent {...props} />
      </>
    );
  }

  return Layout;
}

export default withLayout;
