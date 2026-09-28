/* eslint-disable import/no-unresolved */
import React, { lazy, useEffect } from 'react';
import {
  Routes,
  Route,
  useSearchParams,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import { appStorage } from '@config/AppConfig';
import { useAuth } from '@dom-digital-online-media/dom-auth-sdk';

import { withLayout } from '@part/Layout/Layout';
import { appRoute, storageKeys } from '@utils/globalConstant';

import { useConfig } from '@config/ContextManager';

import { MainLayout } from '@part/MainLayout';
import { ActivationLayout } from '@part/ActivationLayout';
import { PublicOnlineTopUpLayout } from '@part/PublicOnlineTopUpLayout';
import { TariffOptionLayout } from '@part/TariffOptionLayout';

// import { PaymentVerification } from '@pages/Activation/PaymentVerification';
import { PaymentCallbackHandler } from '@modules/Payment/components';
import { ConsentDetails } from '@part/ConsentDetails';
import { InActiveCustomer } from '@pages/InActiveCustomer';
import { FallBack } from './FallBack';
import { PrivateRoute, PublicRoute, TestRoute } from './PrivateRoute';

// Lazy load all pages
// TODO: Implement data loading for each page with suspense
// https://reactrouter.com/en/main/route/lazy
const Test = lazy(() => import('@pages/Test/Test/Test'));
const Test2 = lazy(() => import('@pages/Test/Test2/Test2'));
const Test3 = lazy(() => import('@pages/Test/Test3/Test3'));
const Test4 = lazy(() => import('@pages/Test/Test4/Test4'));
const TestIcons = lazy(() => import('@pages/Test/TestIcons/TestIcons'));

const Activation = lazy(() => import('@pages/Activation'));

const Dashboard = lazy(() => import('@pages/Dashboard'));
const Home = lazy(() => import('@pages/Home'));
const Login = lazy(() => import('@pages/Login'));
const NotFound = lazy(() => import('@pages/NotFound'));
const RateAppRedirect = lazy(() => import('@pages/RateAppRedirect'));
const StoreRedirect = lazy(() => import('@pages/StoreRedirect'));

const TariffOverview = lazy(() => import('@pages/TariffOption/TariffOverview/TariffOverview'));
const TariffOverviewPeriod = lazy(() => import('@pages/TariffOption/TariffOverviewPeriod/TariffOverviewPeriod'));
const OptionOverview = lazy(() => import('@pages/TariffOption/OptionOverview/OptionOverview'));
const AuslandOverview = lazy(() => import('@pages/TariffOption/AuslandOverview/AuslandOverview'));

const TariffDetail = lazy(() => import('@pages/TariffOption/TariffDetail/TariffDetail'));
const OptionDetail = lazy(() => import('@pages/TariffOption/OptionDetail/OptionDetail'));
const SpecialOptionDetail = lazy(() =>
  import('@pages/TariffOption/SpecialOptionDetail/SpecialOptionDetail')
);
const AdditionalOptionDetail = lazy(() =>
  import('@pages/TariffOption/AdditionalOptionDetail/AdditionalOptionDetail')
);
const SpeedOnDetail = lazy(() => import('@pages/TariffOption/SpeedOnDetail/SpeedOnDetail'));
const AutoTopUpDetails = lazy(() => import('@pages/TopUp/MpsTopUp/AutoTopUpDetails/AutoTopUpDetails'));

// New MPS TopUp Flow
const MpsTopUp = lazy(() => import('@pages/TopUp/MpsTopUp/MpsTopUp'));

// Public Online TopUp steps (individual routes)
const PublicOnlineTopUpStep1 = lazy(() => import('@pages/TopUp/PublicOnlineTopUp/Step1/Step1'));
const PublicOnlineTopUpStep2 = lazy(() => import('@pages/TopUp/PublicOnlineTopUp/Step2/Step2'));
const PublicOnlineTopUpStep3 = lazy(() => import('@pages/TopUp/PublicOnlineTopUp/Step3/Step3'));

// Help & Services
const ServiceOverview = lazy(() => import('@pages/Service/Overview'));
const ServiceContact = lazy(() => import('@pages/Service/Contact'));
const ServiceFaq = lazy(() => import('@pages/Service/Faq'));
const ServiceLegal = lazy(() => import('@pages/Service/Legal'));
const ServiceVideo = lazy(() => import('@pages/Service/Video'));
const ServiceAccessibility = lazy(() => import('@pages/Service/Accessibility'));
const ServiceSimLock = lazy(() => import('@pages/Service/SimLock'));
const News = lazy(() => import('@pages/News/News'));
const NewsCampaign = lazy(() => import('@pages/NewsCampaign/NewsCampaign'));

const AccountOverview = lazy(() => import('@pages/Account/Overview'));
const AccountReferFriend = lazy(() => import('@pages/Account/ReferFriend'));
const AccountDataCushion = lazy(() => import('@pages/Account/DataCushion'));
const AccountManageAutoTopup = lazy(() => import('@pages/Account/ManageAutoTopup/ManageAutoTopup'));
const AccountManageAutoTopupDeleteSuccess = lazy(() =>
  import('@pages/Account/ManageAutoTopup/ManageAutoTopupDeleteSuccess')
);
const AccountManageAutoTopupDeleteError = lazy(() =>
  import('@pages/Account/ManageAutoTopup/ManageAutoTopupDeleteError')
);
const AccountManageAutoTopupAmount = lazy(() =>
  import('@pages/Account/ManageAutoTopup/ManageAutoTopupAmount')
);
const AccountManageAutoTopupFeedbackSuccess = lazy(() =>
  import('@pages/Account/ManageAutoTopup/ManageAutoTopupFeedbackSuccess')
);
const AccountManageAutoTopupFeedbackError = lazy(() =>
  import('@pages/Account/ManageAutoTopup/ManageAutoTopupFeedbackError')
);
const AccountDocument = lazy(() => import('@pages/Account/Document'));
const AccountPrivateDataOverview = lazy(() =>
  import('@pages/Account/PrivateData/PrivateDataOverview')
);

const AccountPrivateDataChangeConsent = lazy(() =>
  import('@pages/Account/PrivateData/ChangeConsent')
);
const AccountPrivateDataChangeEmail = lazy(() => import('@pages/Account/PrivateData/ChangeEmail'));
const AccountPrivateDataChangeHotlinePin = lazy(() =>
  import('@pages/Account/PrivateData/ChangeHotlinePin')
);
const AccountPrivateDataNewPassword = lazy(() => import('@pages/Account/PrivateData/NewPassword'));

const AccountTariffOption = lazy(() => import('@pages/Account/TariffOption'));
const EvnDetails = lazy(() => import('@pages/Account/PrivateData/EvnDetails'));
const ContractDetails = lazy(() => import('@pages/Account/ContractDetails'));
const EmployeeBonusDetails = lazy(() => import('@pages/Account/EmployeeBonusDetails'));
const CancelContract = lazy(() => import('@pages/Account/CancelContract'));

const ForgotPassword = lazy(() => import('@pages/ForgotPassword'));

const AccountPaymentMethods = lazy(() => import('@pages/Account/PaymentMethods/PaymentMethods'));
const AccountAddPaymentMethods = lazy(() =>
  import('@pages/Account/AddPaymentMethods/AddPaymentMethods')
);
const AccountAddPaymentMethodsFeedback = lazy(() =>
  import('@pages/Account/AddPaymentMethods/AddPaymentMethodsFeedback')
);
const AccountManagePaymentMethod = lazy(() =>
  import('@pages/Account/ManagePaymentMethod/ManagePaymentMethod')
);
const AccountDeletePaymentMethodSuccess = lazy(() =>
  import('@pages/Account/ManagePaymentMethod/DeletePaymentMethodSuccess')
);
const AccountDeletePaymentMethodError = lazy(() =>
  import('@pages/Account/ManagePaymentMethod/DeletePaymentMethodError')
);

export function AllRoutes() {
  // Constants

  // States

  // Contexts
  const location = useLocation();
  const navigate = useNavigate();

  const { verifyLogin, setUserLogin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    config: { storage }
  } = useConfig();

  // Functions
  const getAccess = async (code) => {
    try {
      const codeVerifier = await storage.getItem(appStorage.AUTH_CODE_VERIFIER);

      if (code && codeVerifier) {
        await storage.encryptedSetItem(appStorage.AUTH_CODE, code);
        // eslint-disable-next-line no-debugger
        const { data } = await verifyLogin(code, codeVerifier);

        await storage.encryptedSetItem(appStorage.AUTH_TOKEN, data.access_token);
        await storage.encryptedSetItem(appStorage.AUTH_REFRESH_TOKEN, data.refresh_token);
        await storage.encryptedSetItem(appStorage.USER_AUTH_DATA, JSON.stringify(data));

        // Clear up url;
        setSearchParams('');
        // Check if user is comming from previous route
        const APP_PREVIOUS_ROUTE_STORAGE = 'navigateTo';
        if (localStorage && localStorage.getItem(APP_PREVIOUS_ROUTE_STORAGE)) {
          setTimeout(() => {
            const previousRoute = localStorage.getItem(APP_PREVIOUS_ROUTE_STORAGE);
            localStorage.removeItem(APP_PREVIOUS_ROUTE_STORAGE);
            navigate(previousRoute);
          }, 150);
        }
        return true;
      }
      setUserLogin(false);
      setSearchParams('');
      return false;
    } catch (error) {
      setSearchParams('');
      return false;
    }
  };

  const oauthValidate = async () => {
    const accessToken = await storage.encryptedGetItem(appStorage.AUTH_TOKEN);
    const refreshToken = await storage.encryptedGetItem(appStorage.AUTH_REFRESH_TOKEN);
    if (accessToken && refreshToken) {
      setUserLogin(true);
    } else {
      setUserLogin(false);
    }
    return accessToken && refreshToken;
  };

  const callbackValidator = async () => {
    try {
      const sessionState = searchParams.get(storageKeys.SESSION_STATE);
      const code = searchParams.get(storageKeys.CODE);

      // eslint-disable-next-line no-debugger
      if (code && sessionState) {
        await storage.encryptedSetItem(storageKeys.CODE, code);
        await storage.encryptedSetItem(storageKeys.SESSION_STATE, sessionState);
        await getAccess(code);
      } else {
        await oauthValidate();
      }
    } catch (error) {
      // pass
    }
  };

  // Hooks
  // Authentication callback
  useEffect(() => {
    callbackValidator();
  }, []);

  useEffect(() => {
    // "document.documentElement.scrollTo" is the magic for React Router Dom v6
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Optional if you want to skip the scrolling animation
    });
  }, [location.pathname]);

  return (
    <Routes>
      {/* Testing UI Page */}
      <Route
        index
        path={appRoute.TEST}
        element={
          <React.Suspense fallback={<FallBack />}>
            <TestRoute>
              <Test />
            </TestRoute>
          </React.Suspense>
        }
      />
      <Route
        index
        path={appRoute.TEST2}
        element={
          <React.Suspense fallback={<FallBack />}>
            <TestRoute>
              <Test2 />
            </TestRoute>
          </React.Suspense>
        }
      />
      <Route
        index
        path={appRoute.TEST3}
        element={
          <React.Suspense fallback={<FallBack />}>
            <TestRoute>
              <Test3 />
            </TestRoute>
          </React.Suspense>
        }
      />
      <Route
        index
        path={appRoute.TEST4}
        element={
          <React.Suspense fallback={<FallBack />}>
            <TestRoute>
              <Test4 />
            </TestRoute>
          </React.Suspense>
        }
      />
      <Route
        index
        path={appRoute.TEST_ICONS}
        element={
          <React.Suspense fallback={<FallBack />}>
            <TestRoute>
              <TestIcons />
            </TestRoute>
          </React.Suspense>
        }
      />

      {/* Main Layout Routes */}
      <Route path="" element={<MainLayout />}>
        <Route
          path={appRoute.INACTIVE_CUSTOMER}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <InActiveCustomer />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          index
          path={appRoute.LANDING_PAGE}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                <Home />
              </PublicRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.LOGIN}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                <Login />
              </PublicRoute>
            </React.Suspense>
          }
        />

        <Route
          path={appRoute.FORGOT_PASSWORD}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            </React.Suspense>
          }
        />

        {/* Authenticated Routes */}
        <Route
          path={appRoute.DASHBOARD}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </React.Suspense>
          }
        />

        {/* Tariff Routes */}
        <Route path={appRoute.TARIFF_OPTION} element={<TariffOptionLayout />}>
          <Route
            path={appRoute.TARIFF_OVERVIEW}
            element={
              <React.Suspense fallback={<FallBack />}>
                <PrivateRoute>
                  <TariffOverview />
                </PrivateRoute>
              </React.Suspense>
            }
          />

          <Route
            path={appRoute.TARIFF_OVERVIEW_PERIOD(false)}
            element={
              <React.Suspense fallback={<FallBack />}>
                <PrivateRoute>
                  <TariffOverviewPeriod />
                </PrivateRoute>
              </React.Suspense>
            }
          />

          <Route
            path={appRoute.OPTION_OVERVIEW}
            element={
              <React.Suspense fallback={<FallBack />}>
                <PrivateRoute>
                  <OptionOverview />
                </PrivateRoute>
              </React.Suspense>
            }
          />

          <Route
            path={appRoute.AUSLAND_OVERVIEW}
            element={
              <React.Suspense fallback={<FallBack />}>
                <PrivateRoute>
                  <AuslandOverview />
                </PrivateRoute>
              </React.Suspense>
            }
          />

          <Route
            path={appRoute.TARIFF_DETAIL(false)}
            element={
              <React.Suspense fallback={<FallBack />}>
                <PrivateRoute>
                  <TariffDetail />
                </PrivateRoute>
              </React.Suspense>
            }
          />

          <Route
            path={appRoute.OPTION_DETAIL(false)}
            element={
              <React.Suspense fallback={<FallBack />}>
                <PrivateRoute>
                  <OptionDetail />
                </PrivateRoute>
              </React.Suspense>
            }
          />

          <Route
            path={appRoute.ADDITIONAL_OPTION_DETAIL(false)}
            element={
              <React.Suspense fallback={<FallBack />}>
                <PrivateRoute>
                  <AdditionalOptionDetail />
                </PrivateRoute>
              </React.Suspense>
            }
          />

          <Route
            path={appRoute.PASSOFFER_DETAIL(false)}
            element={
              <React.Suspense fallback={<FallBack />}>
                <PrivateRoute>
                  <SpeedOnDetail />
                </PrivateRoute>
              </React.Suspense>
            }
          />

          <Route
            path={appRoute.SPECIAL_OPTION_DETAIL(false)}
            element={
              <React.Suspense fallback={<FallBack />}>
                <PrivateRoute>
                  <SpecialOptionDetail />
                </PrivateRoute>
              </React.Suspense>
            }
          />
        </Route>

        {/* Tariff & Options default navigation redirect */}
        <Route
          index
          path={appRoute.TARIFF_OPTION}
          element={<Navigate to={appRoute.TARIFF_OVERVIEW} replace />}
        />

        {/* Topup Routes */}
        {/* MPS: New TopUp Flow - base path is /topup/mps, MPS_TOPUP_OVERVIEW itself is /topup/mps/overview */}
        <Route
          path="/topup/mps/*"
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <MpsTopUp />
              </PrivateRoute>
            </React.Suspense>
          }
        />

        {/* Help & Services */}
        <Route
          path={appRoute.HELP_SERVICES_OVERVIEW}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                {/* <HelpServicesOverview /> */}
                <ServiceOverview />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.NEWS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <News />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.NEWS_CAMPAIGN}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <NewsCampaign />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.HELP_SERVICES_CONTACT}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                {/* <HelpServicesContact /> */}
                <ServiceContact />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.HELP_SERVICES_FAQ}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                {/* <HelpServicesFaq /> */}
                <ServiceFaq />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.HELP_SERVICES_LEGAL}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                {/* <HelpServicesPrivacyPolicy /> */}
                <ServiceLegal />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.HELP_SERVICES_VIDEO}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                {/* <HelpServicesServiceVideo /> */}
                <ServiceVideo />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.HELP_SERVICES_ACCESSIBILITY}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <ServiceAccessibility />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.HELP_SERVICES_SIM_LOCK}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <ServiceSimLock />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        {/* Help & Services default navigation redirect */}
        <Route
          index
          path={appRoute.HELP_SERVICES}
          element={<Navigate to={appRoute.HELP_SERVICES_OVERVIEW} replace />}
        />

        {/* Account */}
        <Route
          path={appRoute.ACCOUNT_OVERVIEW}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountOverview />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_REFER_FRIEND}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountReferFriend />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_MANAGE_AUTO_TOPUP}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountManageAutoTopup />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_MANAGE_AUTO_TOPUP_DELETE_SUCCESS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountManageAutoTopupDeleteSuccess />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_MANAGE_AUTO_TOPUP_DELETE_ERROR}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountManageAutoTopupDeleteError />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_MANAGE_AUTO_TOPUP_AMOUNT}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountManageAutoTopupAmount />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_AUTO_TOPUP_FEEDBACK_SUCCESS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountManageAutoTopupFeedbackSuccess />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_AUTO_TOPUP_FEEDBACK_ERROR}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountManageAutoTopupFeedbackError />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_AUTOTOPUP_DETAILS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AutoTopUpDetails />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_DOCUMENT}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountDocument />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_PRIVATE_DATA}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountPrivateDataOverview />
              </PrivateRoute>
            </React.Suspense>
          }
        />

        {/* Sub Private Data Routes */}
        <Route
          path={appRoute.ACCOUNT_PRIVATE_DATA_CHANGE_CONSENT}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountPrivateDataChangeConsent />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_PRIVATE_DATA_CHANGE_EMAIL}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountPrivateDataChangeEmail />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_PRIVATE_DATA_CHANGE_HOTLINE_PIN}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountPrivateDataChangeHotlinePin />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_PRIVATE_DATA_NEW_PASSWORD}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountPrivateDataNewPassword />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_TARIFF_OPTION}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountTariffOption />
              </PrivateRoute>
            </React.Suspense>
          }
        />

        {/* 2026-01 --> route is used */}
        <Route
          path={appRoute.ACCOUNT_PRIVATE_DATA_EVN_DETAILS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <EvnDetails />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_CONTRACT_DETAILS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <ContractDetails />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_EMPLOYEE_BONUS_DETAILS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <EmployeeBonusDetails />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_CANCEL_CONTRACT}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <CancelContract />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_DATENPOLSTER}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountDataCushion />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_PAYMENT_METHODS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountPaymentMethods />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_ADD_PAYMENT_METHODS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountAddPaymentMethods />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_MANAGE_PAYMENT_METHOD}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountManagePaymentMethod />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_DELETE_PAYMENT_METHOD_SUCCESS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountDeletePaymentMethodSuccess />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.ACCOUNT_DELETE_PAYMENT_METHOD_ERROR}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PrivateRoute>
                <AccountDeletePaymentMethodError />
              </PrivateRoute>
            </React.Suspense>
          }
        />
        {/* Account default navigation redirect */}
        <Route
          index
          path={appRoute.ACCOUNT}
          element={<Navigate to={appRoute.ACCOUNT_OVERVIEW} replace />}
        />

        {/* Public Paths */}
        <Route
          path={appRoute.NOT_FOUND}
          element={
            <React.Suspense fallback={<FallBack />}>
              <NotFound />
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.CONSENT_DATA_DETAILS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <ConsentDetails />
            </React.Suspense>
          }
        />

        {/* Redirects users to the appropriate app store (iOS/Android) based on their platform when visiting the app review route */}
        <Route
          path={appRoute.APP_REVIEW_REDIRECT}
          element={
            <React.Suspense fallback={<FallBack />}>
              <RateAppRedirect />
            </React.Suspense>
          }
        />

        {/* Handle all URLs starting with /dl and render <StoreRedirect /> which redirects to the appropriate app store */}
        <Route
          path={`${appRoute.STORE_REDIRECT}/*`}
          element={
            <React.Suspense fallback={<FallBack />}>
              <StoreRedirect />
            </React.Suspense>
          }
        />
      </Route>

      {/* Public Online TopUp - individual step routes (with specific layout, no iframe solution anymore) */}
      <Route path={appRoute.PUBLIC_ONLINE_TOPUP_NUMBER} element={<PublicOnlineTopUpLayout />}>
        <Route
          path=""
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                {/* <RedirectionWrapper> */}
                  <PublicOnlineTopUpStep1 />
                {/* </RedirectionWrapper> */}
              </PublicRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.PUBLIC_ONLINE_TOPUP_AMOUNT}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                {/* <RedirectionWrapper> */}
                  <PublicOnlineTopUpStep2 />
                {/* </RedirectionWrapper> */}
              </PublicRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.PUBLIC_ONLINE_TOPUP_PAYMENT}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                {/* <RedirectionWrapper> */}
                  <PublicOnlineTopUpStep3 />
                {/* </RedirectionWrapper> */}
              </PublicRoute>
            </React.Suspense>
          }
        />
        {/* UNUSED - Routes for PublicOnlineTopUpSuccess and PublicOnlineTopUpError are no longer used.
            PaymentCallbackHandler now handles success/error feedback directly and navigates to home/payment.
            Kept commented for reference. */}
        {/*
        <Route
          path={appRoute.PUBLIC_ONLINE_TOPUP_SUCCESS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                <RedirectionWrapper>
                  <PublicOnlineTopUpSuccess />
                </RedirectionWrapper>
              </PublicRoute>
            </React.Suspense>
          }
        />
        <Route
          path={appRoute.PUBLIC_ONLINE_TOPUP_ERROR}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                <RedirectionWrapper>
                  <PublicOnlineTopUpError />
                </RedirectionWrapper>
              </PublicRoute>
            </React.Suspense>
          }
        />
        */}
        {/* <Route
          path={appRoute.PUBLIC_ONLINE_TOPUP_AUTO_SUCCESS}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                <RedirectionWrapper>
                  <PublicOnlineTopUpAutoSuccess />
                </RedirectionWrapper>
              </PublicRoute>
            </React.Suspense>
          }
        /> */}
        {/* <Route
          path={appRoute.PUBLIC_ONLINE_TOPUP_AUTO_ERROR}
          element={
            <React.Suspense fallback={<FallBack />}>
              <PublicRoute>
                <RedirectionWrapper>
                  <PublicOnlineTopUpAutoError />
                </RedirectionWrapper>
              </PublicRoute>
            </React.Suspense>
          }
        /> */}
      </Route>

      {/* Activation Layout Routes */}
      <Route path={appRoute.ACTIVATION} element={<ActivationLayout />}>
        <Route
          path=""
          element={
            <React.Suspense fallback={<FallBack />}>
              <Activation />
            </React.Suspense>
          }
        />
      </Route>

      {/* Payment Result Route - Unified payment callback handler for all payment flows */}
      <Route
        path={appRoute.MPS_TOPUP_RESULT}
        element={
          <React.Suspense fallback={<FallBack />}>
            <PaymentCallbackHandler />
          </React.Suspense>
        }
      />

      {/* Add Payment Method Feedback Route - Unified feedback handler for account payment storage (no layout) */}
      <Route
        path={appRoute.ACCOUNT_ADD_PAYMENT_METHODS_SUCCESS}
        element={
          <React.Suspense fallback={<FallBack />}>
            <PrivateRoute>
              <AccountAddPaymentMethodsFeedback />
            </PrivateRoute>
          </React.Suspense>
        }
      />

      <Route path="*" element={<Navigate to={appRoute.NOT_FOUND} replace />} />
    </Routes>
  );
}

export const AppRoutes = withLayout(AllRoutes);
export default AppRoutes;
