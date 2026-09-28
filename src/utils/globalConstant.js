/* eslint-disable no-useless-escape */
/* eslint-disable no-bitwise */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-var */
// import { appRoute as commonRoutes } from '@dom-digital-online-media/dom-app-config-sdk';

import {
  appRegex as _appRegex,
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_FIELD_VALIDATION_TYPE,
  appStorage as AppStorage
} from '@config/AppConfig';
import { useStaticContent } from '@context/StaticContent';
import * as yup from 'yup';

// BFSG: OLD (OBSOLETE?) Generic error message --> needs to be replaced with the new logic of API error handling?
export const getGenericErrorMessage = (tA11y) => tA11y('nc_global_generic_api_err').content;

// Scale font size // Usage in TariffCard component
export const scaleFontSize = (baseSize, sizeVariant) => {
  const scaleFactor = sizeVariant === 'large' ? 1.25 : 1;
  return `${baseSize * scaleFactor}px`;
};

// App modes
export const appEnvMode = {
  NODE_ENV_DEV: 'development',
  NODE_ENV_PROD: 'production',
  NODE_ENV_STAGE: 'stage'
};

export const headerStringRoute = {
  DASHBOARD: 'dashboard',
  TARIFF: 'tariff',
  CHARGES: 'charges',
  HELP_AND_SERVICE: 'help-service',
  ACCOUNT: 'account'
};

// Extend routes
export const appRoute = {
  // Public Routes
  // ...commonRoutes,
  HOME: '',
  ACTIVATION: '/activation',
  ACTIVATION_WELCOME: '/activation-welcome',
  // ACTIVATION_EMAIL_VERIFICATION: '/activation/email-verification',
  // ACTIVATION_PAYMENT_CALLBACK: '/activation/payment-verification', // ALPHA // UNUSED
  ACTIVATION_PAYMENT_RESULT: '/activation/payment/result',
  ACTIVATION_LEGITIMATION: '/activation/legitimation',
  ACTIVATION_LEGITIMATION_SUCCESS: '/activation/legitimation/success',
  ACTIVATION_LEGITIMATION_FAILED: '/activation/legitimation/failed',
  NOT_FOUND: '/404',
  DEBUG: '/debug',
  LOGIN: '/login',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password', // 2026-01 --> route is used
  LANDING_PAGE: '/',
  APP_REVIEW_REDIRECT: '/store-review',
  STORE_REDIRECT: '/dl',
  CONSENT_DATA_DETAILS: '/consent-data-details',

  // Private test routes
  TEST: '/test',
  TEST2: '/test2',
  TEST3: '/test3',
  TEST4: '/test4',
  TEST_ICONS: '/test-icons',

  // Private routes
  DASHBOARD: '/dashboard',
  BOOKABLE_DATA: '/dashboard/options',

  CHARGES: '/charges',
  TOPUP_HISTORY: '/charges/topup-history',
  VOUCHER_HISTORY: '/charges/voucher-history',
  RECHARGE_CREDIT: '/charges/recharge-credit',
  RECHARGE_VOUCHER: '/charges/recharge-credit/recharge-voucher',
  SET_AUTO_TOPUP: '/charges/recharge-credit/setup-auto-topup',
  SET_DIRECT_TOPUP: '/charges/recharge-credit/setup-direct-topup',

  PAYMENT_CALLBACK: '/payment',

  ESIM_TARIFF: '/esim-tariff',

  TARIFF_OPTION: '/tariff',
  TARIFF_OVERVIEW: '/tariff/overview',
  TARIFF_OVERVIEW_PERIOD: (period) => (period ? `/tariff/overview/${period}` : '/tariff/overview/:period'),
  TARIFF_OVERVIEW_PERIOD_MONTH: '/tariff/overview/month',
  TARIFF_OVERVIEW_PERIOD_YEAR: '/tariff/overview/year',
  TARIFF_DETAIL: (id) => (id ? `/tariff/change/${id}` : '/tariff/change/:tariffId'),
  OPTION_OVERVIEW: '/tariff/option/overview',
  OPTION_DETAIL: (id) => (id ? `/tariff/option/book/${id}` : '/tariff/option/book/:optionId'),
  ADDITIONAL_OPTION_DETAIL: (id) =>
    id ? `/tariff/additional-option/book/${id}` : '/tariff/additional-option/book/:passCode',
  PASSOFFER_DETAIL: (passCode) =>
    passCode ? `/tariff/passoffer/book/${passCode}` : '/tariff/passoffer/book/:passCode',
  SPECIAL_OPTION_DETAIL: (passCode) =>
    passCode ? `/tariff/special-option/book/${passCode}` : '/tariff/special-option/book/:passCode', // TODO: CHECK
  AUSLAND_OVERVIEW: '/tariff/ausland/overview',

  // BFSG: check if this route is still used. If not remove it at the end of sprint 3

  // ALPHA: Old TopUp routes (to be removed after migration to new MPS flow)
  // TOPUP: '/topup',
  // TOPUP_VOUCHER: '/topup/voucher', // 2026-01 --> route is used // ALPHA: check
  // TOPUP_VOUCHER_DETAILS: '/topup/voucher-details', // 2026-01 --> route is used // ALPHA: check
  // TOPUP_VOUCHER_HISTORY: '/topup/voucher-history',

  // MPS: New TopUp Flow (handles both one-time and auto-topup)
  // MPS // TODO: Before production - remove "/mps" from the routes and remove old Alphacomm routes above
  // Flow: Choice -> Person (skipped for auto) -> Amount -> Payment -> Callback
  // Auto-topup uses TOPUP_TYPE=AUTOMATIC and calls /recurring API, one-time uses TOPUP_TYPE=DIRECT and calls /onetime API
  MPS_TOPUP_BASE: '/topup/mps',
  MPS_TOPUP_OVERVIEW: '/topup/mps/overview',
  MPS_TOPUP_TYPE: '/topup/mps/type',
  MPS_TOPUP_PERSON: '/topup/mps/person',
  MPS_TOPUP_OTHER_NUMBER: '/topup/mps/other-number',
  MPS_TOPUP_AMOUNT: '/topup/mps/amount',
  MPS_TOPUP_PAYMENT: '/topup/mps/payment',
  MPS_TOPUP_CALLBACK: '/topup/mps/callback',
  MPS_TOPUP_RESULT: '/topup/mps/payment/result', // NEW after adding result polling
  MPS_TOPUP_AUTOTOPUP_DETAILS: '/topup/mps/autotopup-details',
  MPS_TOPUP_HISTORY: '/topup/mps/history',
  MPS_TOPUP_HISTORY_DETAILS: '/topup/mps/history-details',
  MPS_TOPUP_VOUCHER: '/topup/mps/voucher',
  MPS_TOPUP_VOUCHER_DETAILS: '/topup/mps/voucher-details',

  PUBLIC_ONLINE_TOPUP_NUMBER: '/online-topup',
  PUBLIC_ONLINE_TOPUP_AMOUNT: '/online-topup/amount',
  PUBLIC_ONLINE_TOPUP_PAYMENT: '/online-topup/payment',
  PUBLIC_ONLINE_TOPUP_SUCCESS: '/online-topup/success',
  PUBLIC_ONLINE_TOPUP_ERROR: '/online-topup/error',
  PUBLIC_ONLINE_TOPUP_AUTO_SUCCESS: '/online-topup/auto-success',
  PUBLIC_ONLINE_TOPUP_AUTO_ERROR: '/online-topup/auto-error',

  NEWS: '/news',
  NEWS_CAMPAIGN: '/news/:campaignId',
  HELP_SERVICES: '/account/help-services',
  HELP_SERVICES_OVERVIEW: '/account/help-services/overview',
  HELP_SERVICES_CONTACT: '/account/help-services/contact',
  HELP_SERVICES_FAQ: '/account/help-services/faq',
  HELP_SERVICES_PRIVACY_POLICY: '/account/help-services/privacy-policy',
  HELP_SERVICES_VIDEO: '/account/help-services/video',
  HELP_SERVICES_IMPRINT: '/account/help-services/imprint',
  HELP_SERVICES_CANCEL_CONTRACT: '/account/help-services/cancel-contract',
  HELP_SERVICES_ACCESSIBILITY: '/account/help-services/accessibility',
  HELP_SERVICES_LEGAL: '/account/help-services/legal',
  HELP_SERVICES_SIM_LOCK: '/account/help-services/sim-lock',

  MPS_ACCOUNT_BASE: '/mps/account',
  ACCOUNT: '/account',
  ACCOUNT_OVERVIEW: '/account/overview',
  ACCOUNT_MANAGE_AUTO_TOPUP: '/mps/account/autotopup/manage',
  ACCOUNT_MANAGE_AUTO_TOPUP_AMOUNT: '/mps/account/autotopup/amount',
  ACCOUNT_AUTO_TOPUP_FEEDBACK_SUCCESS: '/mps/account/autotopup/feedback/success',
  ACCOUNT_AUTO_TOPUP_FEEDBACK_ERROR: '/mps/account/autotopup/feedback/error',
  ACCOUNT_MANAGE_AUTO_TOPUP_DELETE_SUCCESS: '/mps/account/autotopup/delete-feedback/success',
  ACCOUNT_MANAGE_AUTO_TOPUP_DELETE_ERROR: '/mps/account/autotopup/delete-feedback/error',
  ACCOUNT_AUTOTOPUP_DETAILS: '/mps/account/autotopup-details',
  ACCOUNT_DOCUMENT: '/account/docs',
  ACCOUNT_PRIVATE_DATA: '/account/info',
  // New MPS payment method section in account section
  ACCOUNT_PAYMENT_METHODS: '/mps/account/payment-methods',
  ACCOUNT_ADD_PAYMENT_METHODS: '/mps/account/payment-methods/add',
  ACCOUNT_ADD_PAYMENT_METHODS_SUCCESS: '/mps/account/payment-methods/add/success',
  ACCOUNT_ADD_PAYMENT_METHODS_ERROR: '/mps/account/payment-methods/add/error',
  ACCOUNT_MANAGE_PAYMENT_METHOD: '/mps/account/payment-method/manage',
  ACCOUNT_DELETE_PAYMENT_METHOD_SUCCESS: '/mps/account/payment-method/delete/success',
  ACCOUNT_DELETE_PAYMENT_METHOD_ERROR: '/mps/account/payment-method/delete/error',

  ACCOUNT_PRIVATE_DATA_CHANGE_CONSENT: '/account/change-consent',
  ACCOUNT_PRIVATE_DATA_CHANGE_EMAIL: '/account/change-email',

  ACCOUNT_PRIVATE_DATA_CHANGE_HOTLINE_PIN: '/account/change-hotline-pin',
  ACCOUNT_PRIVATE_DATA_NEW_PASSWORD: '/account/new-password', // 2026-01 --> route is used
  ACCOUNT_PRIVATE_DATA_EVN_DETAILS: '/account/evn-details', // 2026-01 --> route is used
  ACCOUNT_CONTRACT_DETAILS: '/account/contract-details',
  ACCOUNT_EMPLOYEE_BONUS_DETAILS: '/account/employee-bonus',
  ACCOUNT_CANCEL_CONTRACT: '/account/cancel-contract',
  
  ACCOUNT_TARIFF_OPTION: '/account/tariff-option',

  ACCOUNT_REFER_FRIEND: '/account/refer-friend',
  ACCOUNT_DATENPOLSTER: '/account/datenpolster',

  // Old
  OPTION_BOOK: (id) => (id ? `/dashboard/option/book/${id}` : '/dashboard/option/book/:optionId'),
  SPEEDON_BOOK: (id) =>
    id ? `/dashboard/speedon/book/${id}` : '/dashboard/speedon/book/:speedonId',
  PASSOFFER_BOOK: (passCode) =>
    passCode ? `/dashboard/passoffer/book/${passCode}` : '/dashboard/passoffer/book/:passCode',
  DATAPASS_BOOK: (id) =>
    id ? `/dashboard/datapass/book/${id}` : '/dashboard/datapass/book/:datapassId',
  ROAMING_BOOK: (id) =>
    id ? `/dashboard/roaming/book/${id}` : '/dashboard/roaming/book/:roamingId',
  INACTIVE_CUSTOMER: '/inactive-customer'
};

export const storageKeys = {
  // ...commonRoutes,
  CODE: 'code',
  SESSION_STATE: 'session_state',
  X_LOG_TAG: 'x_log_tag'
};

export const appStorage = {
  ...AppStorage,
  CART_NAME: 'cartName',
  ORDER_NUMBER: 'orderNumber',
  ACTIVATION_DATA: 'activationData',
  ACTIVATION_PERSONAL_DATA: 'activationPersonalData',
  ACTIVATION_MSISDN: 'activationMsisdn',
  POSTIDENT: 'postIdent',
  LEGITIMATION_URL: 'legitimationUrl',
  LEGITIMATION_CODE: 'legitimationCode',
  TARIFF_SHOWN_TIME: 'tarrifShownTime',
  IMMEDIATE_TARIFF_CHANGE_SHOWN_TIME: 'immediateTariffChangeShownTime',
  PREFERENCE_SHOW_TIME: 'preferenceShowTime',
  CONSENT_SHOW_TIME: 'consentShowTime',
  IMMEDIATE_TARIFF_CHANGE_GAP: 'immediateTariffChange',
  NAVIGATE_TO: 'navigateTo',
  PAYMENT_TOKEN: 'payment-token',
  PAYMENT_REFRESH_TOKEN: 'payment-refresh-token',
  PAYMENT_REASON: 'payment-reason',
  MSISDN: 'msisdn',
  CAMPAIGN_POPUP: 'hasCampaignPopupShown',
  CAMPAIGN_POPUP_DATA: 'campaignPopupData',
  CAMPAIGN_POPUP_DATA_SESSION: 'campaignPopupDataSession',
  WELCOME_SCREEN: 'hasWelcomeScreenShown',
  LEGITIMATION_NAME: 'legitimationName',
  
  TOPUP_TYPE: 'topupType',
  TOPUP_AMOUNT: 'topupAmount',
  TOPUP_CHARGE_TO: 'topupChargeTo',
  TOPUP_OTHER_MSISDN: 'topupOtherMsisdn',
  TOPUP_PAYMENT_METHOD: 'topupPaymentMethod',
  POT_PAYMENT_FLOW: 'potPaymentFlow',
  POT_PAYMENT_AMOUNT: 'potPaymentAmount',
  POT_PAYMENT_METHOD: 'potPaymentMethod',
  POT_PAYMENT_MSISDN: 'potPaymentMsisdn',
  POT_LOOKUP_KEY: 'potLookupKey',
  POT_PAYMENT_RESULT: 'potPaymentResult',
  MPS_TOPUP_HISTORY_SELECTED_YEAR: 'topupHistorySelectedYear'
};

export const appStaticContentConfig = {
  platform: 'web',
  lang: 'de',
  client: 'norma'
};

// App alert types
export const appAlert = {
  DEFAUT_TIMEOUT: 5000,
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  DARK: 'dark',
  SUCCESS: 'success',
  ERROR: 'danger',
  DISABLED: 'disabled',
  DEFAULT: 'default'
};

export const appIcons = {
  // HOME: 'Home',
  // DASHBOARD: 'Dashboard',
  // RADIO_ACTIVE: 'RadioActive',

  hand: '/assets/icons/icon-hand.svg',
  cheer: '/assets/icons/icon-cheer.svg',
  hi5G: '/assets/icons/icon-hi-5g.svg',
  address: '/assets/icons/icon-address.svg',
  addressmint: '/assets/icons/icon-address-mint.svg',
  arrowup: '/assets/icons/icon-arrow-up.svg',
  arrowupmint: '/assets/icons/icon-arrow-up-mint.svg',
  arrowupdarkgreen: '/assets/icons/icon-arrow-up-darkgreen.svg',
  arrowdown: '/assets/icons/icon-arrow-down.svg',
  arrowdownmint: '/assets/icons/icon-arrow-down-mint.svg',
  arrowdowndarkgreen: '/assets/icons/icon-arrow-down-darkgreen.svg',
  arrowleft: '/assets/icons/icon-arrow-left.svg',
  arrowleftcolor: '/assets/icons/icon-arrow-left-color.svg',
  arrowright: '/assets/icons/icon-arrow-right.svg',
  arrowrightcolor: '/assets/icons/icon-arrow-right-dark-green.svg',
  arrowrightgrey: '/assets/icons/icon-arrow-right-grey.svg',
  loadingcolor: '/assets/icons/icon-loading-color.svg',
  bubblebottommint: '/assets/icons/icon-bubble-top-mint.svg',
  bubblebottom: '/assets/icons/icon-bubble-top.svg',
  bubblemint: '/assets/icons/icon-bubble-mint.svg',
  bubblemint60top: '/assets/icons/icon-bubble-top-mint60.svg',
  bubblemint60bottom: '/assets/icons/icon-bubble-bottom-mint60.svg',
  bubble: '/assets/icons/icon-bubble.svg',
  bubbletabdanger: '/assets/icons/icon-bubble-tab-danger.svg',
  bubbletabaccent: '/assets/icons/icon-bubble-tab-accent.svg',
  back: '/assets/icons/icon-back.svg',
  backcolor: '/assets/icons/icon-back-color.svg',
  break: '/assets/icons/icon-break.svg',
  call: '/assets/icons/icon-call.svg',
  calldarkgreen: '/assets/icons/icon-call-darkgreen.svg',
  callmint: '/assets/icons/icon-call-mint.svg',
  cash: '/assets/icons/icon-cash.svg',
  cashdarkgreen: '/assets/icons/icon-cash-darkgreen.svg',
  change: '/assets/icons/icon-change.svg',
  changetariffdarkgreen: '/assets/icons/icon-changetariff-darkgreen.svg',
  chat: '/assets/icons/icon-chat.svg',
  checkcircle: '/assets/icons/icon-check-circle.svg',
  checkcirclemint: '/assets/icons/icon-check-circle-circle-mint.svg',
  checkcirclesuccess: '/assets/icons/icon-check-circle-circle-success.svg', // NEW
  circlearrow: '/assets/icons/icon-circlearrow.svg',
  checked: '/assets/icons/icon-check.svg',
  checkdarkgreen: '/assets/icons/icon-check-dark.svg',
  clock: '/assets/icons/icon-clock.svg',
  clockgrey: '/assets/icons/icon-clock-grey.svg',
  close: '/assets/icons/icon-close.svg',
  closecolor: '/assets/icons/icon-close-color.svg',
  closesm: '/assets/icons/icon-close-sm.svg',
  coffee: '/assets/icons/icon-coffee.svg',
  coffeemint: '/assets/icons/icon-coffee-mint.svg',
  copy: '/assets/icons/icon-copy.svg',
  copywhite: '/assets/icons/icon-copy-white.svg',
  coins: '/assets/icons/icon-coins.svg',
  coinsmint: '/assets/icons/icon-coins-mint.svg',
  coinscolor: '/assets/icons/icon-coins-color.svg',
  confetti: '/assets/icons/icon-confetti.svg',
  confetticolor: '/assets/icons/icon-confetti-color.svg',
  data: '/assets/icons/icon-data.svg',
  datagray100: '/assets/icons/icon-data-gray-100.svg',
  darkarrows: '/assets/icons/icon-arrows-dark.svg',
  date: '/assets/icons/icon-date.svg',
  dateGreen: '/assets/icons/icon-date-darkgreen.svg',
  datemint: '/assets/icons/icon-date-mint.svg',
  delete: '/assets/icons/icon-delete.svg',
  deletemint: '/assets/icons/icon-delete-mint.svg',
  deletedark: '/assets/icons/icon-delete-dark.svg',
  download: '/assets/icons/icon-download.svg',
  downloaddark: '/assets/icons/icon-download-dark.svg',
  downloadDarkGreen: '/assets/icons/icon-download-green.svg',
  edit: '/assets/icons/icon-edit.svg',
  editdark: '/assets/icons/icon-edit-dark.svg',
  editdarkgreen: '/assets/icons/icon-edit-darkgreen.svg',
  error: '/assets/icons/icon-error-1.svg',
  errorcircle: '/assets/icons/icon-error-circle.svg',
  erroroctagonwhite: '/assets/icons/icon-error-octagon-white.svg',
  errorcolor: '/assets/icons/icon-error-color.svg',
  errorwhite: '/assets/icons/icon-error-white.svg',
  faq: '/assets/icons/icon-faq.svg',
  faqdarkgreen: '/assets/icons/icon-faq-darkgreen.svg',
  forward: '/assets/icons/icon-forward.svg',
  forwarddark: '/assets/icons/icon-forward-dark.svg',
  forwardprimary: '/assets/icons/icon-forward-primary.svg',
  forwardmint: '/assets/icons/icon-forward-mint.svg',
  giftcard: '/assets/icons/icon-giftcard.svg',
  giftcarddarkgreen: '/assets/icons/icon-giftcard-darkgreen.svg',
  gift: '/assets/icons/icon-gift.svg',
  giftdarkgreen: '/assets/icons/icon-gift-darkgreen.svg',
  giftmint: '/assets/icons/icon-gift-mint.svg',
  giftmint20: '/assets/icons/icon-gift-mint-20.svg',
  groupdarkgreen: '/assets/icons/icon-groupdarkgreen.svg',
  hamburger: '/assets/icons/icon-hamburger.svg',
  hamburgerclose: '/assets/icons/icon-hamburger-close.svg',
  happy: '/assets/icons/icon-happy.svg',
  happycolor: '/assets/icons/icon-happy-color.svg',
  hide: '/assets/icons/icon-hide.svg',
  hidedark: '/assets/icons/icon-hide-dark.svg',
  highlight: '/assets/icons/icon-highlight.svg',
  history: '/assets/icons/icon-history.svg',
  historydarkgreen: '/assets/icons/icon-history-darkgreen.svg',
  historymint: '/assets/icons/icon-history-mint.svg',
  historyclockdarkgreen: '/assets/icons/icon-history-clock-darkgreen.svg',
  idea: '/assets/icons/icon-idea.svg',
  ideacolor: '/assets/icons/icon-idea-color.svg',
  info: '/assets/icons/icon-info.svg',
  infomint: '/assets/icons/icon-info-mint.svg',
  infoblue: '/assets/icons/icon-info-blue.svg',
  infodarkgreen: '/assets/icons/icon-info-darkgreen.svg',
  infowhite: '/assets/icons/icon-info-white.svg',
  infogray100: '/assets/icons/icon-info-gray-100.svg',
  infoerror: '/assets/icons/icon-info-error.svg',
  infoerrorgray100: '/assets/icons/icon-error-gray-100.svg',
  key: '/assets/icons/icon-key.svg',
  keycolor: '/assets/icons/icon-key-color.svg',
  keydarkgreen: '/assets/icons/icon-key-darkgreen.svg',
  like: '/assets/icons/icon-like.svg',
  likegray100: '/assets/icons/icon-like-gray-100.svg',
  likedarkgreen: '/assets/icons/icon-like-darkgreen.svg',
  layerdarkgreen: '/assets/icons/icon-layer-darkgreen.svg',
  login: '/assets/icons/icon-login.svg',
  logindarkgreen: '/assets/icons/icon-login-darkgreen.svg',
  loginmint: '/assets/icons/icon-login-mint.svg',
  logout: '/assets/icons/icon-logout.svg',
  logoutmint: '/assets/icons/icon-logout-mint.svg',
  loupe: '/assets/icons/icon-loupe.svg',
  loupegreen: '/assets/icons/icon-loupe-green.svg',
  mail: '/assets/icons/icon-mail.svg',
  maildarkgreen: '/assets/icons/icon-mail-darkgreen.svg',
  mailmint: '/assets/icons/icon-mail-mint.svg',
  minus: '/assets/icons/icon-minus.svg',
  minusdarkgreen: '/assets/icons/icon-minus-darkgreen.svg',
  minusmint: '/assets/icons/icon-minus-mint.svg',
  minutes: '/assets/icons/icon-minutes.svg',
  minutesgray100: '/assets/icons/icon-minutes-gray-100.svg',
  newsmint: '/assets/icons/icon-news-mint.svg',
  nodatamint: '/assets/icons/icon-no-data-mint.svg',
  password: '/assets/icons/icon-password.svg',
  passwordcolor: '/assets/icons/icon-password-color.svg',
  passwordmint: '/assets/icons/icon-password-mint.svg',
  passwordchange: '/assets/icons/icon-password-change.svg',
  passwordforgot: '/assets/icons/icon-password-forgot.svg',
  pause: '/assets/icons/icon-pause.svg',
  pausemint: '/assets/icons/icon-pause-mint.svg',
  phone: '/assets/icons/icon-phone.svg',
  phonedarkgreen: '/assets/icons/icon-phone-darkgreen.svg',
  phonecolor: '/assets/icons/icon-phone-color.svg',
  plus: '/assets/icons/icon-plus.svg',
  plusmint: '/assets/icons/icon-plus-mint.svg',
  plusdarkgreen: '/assets/icons/icon-plus-darkgreen.svg',
  playwhite: '/assets/icons/icon-play-white.svg',
  passwordchangegreen: '/assets/icons/icon-password-change-darkgreen.svg',
  passwordchangelitegreen: '/assets/icons/icon-password-change-litegreen.svg',
  refresh: '/assets/icons/icon-refresh.svg',
  refreshcolor: '/assets/icons/icon-refresh-color.svg',
  remove: '/assets/icons/icon-remove.svg',
  removedark: '/assets/icons/icon-remove-dark.svg',
  send: '/assets/icons/icon-send.svg',
  setting: '/assets/icons/icon-setting.svg',
  settingmint: '/assets/icons/icon-setting-mint.svg',
  settingdarkgreen: '/assets/icons/icon-setting-darkgreen.svg',
  friendsmint: '/assets/icons/icon-friends-mint.svg',
  show: '/assets/icons/icon-show.svg',
  showdark: '/assets/icons/icon-show-dark.svg',
  sms: '/assets/icons/icon-sms.svg',
  smsgray100: '/assets/icons/icon-sms-gray-100.svg',
  speed: '/assets/icons/icon-speed.svg',
  speedgray100: '/assets/icons/icon-speed-gray-100.svg',
  speed2darkgreen: '/assets/icons/icon-speed2-darkgreen.svg',
  stopmint: '/assets/icons/icon-stop-mint.svg',
  success: '/assets/icons/icon-success.svg',
  support: '/assets/icons/icon-support.svg',
  supportcolor: '/assets/icons/icon-support-dark.svg',
  supportdarkgreen: '/assets/icons/icon-support-darkgreen.svg',
  supportmint: '/assets/icons/icon-support-mint.svg',
  target: '/assets/icons/icon-target.svg',
  targetdarkgreen: '/assets/icons/icon-target-darkgreen.svg',
  tariff: '/assets/icons/icon-tariff.svg',
  tariffdarkgreen: '/assets/icons/icon-tariff-darkgreen.svg',
  tariffmint: '/assets/icons/icon-tariff-mint.svg',
  time: '/assets/icons/icon-time.svg',
  updatedarkgreen: '/assets/icons/icon-update-darkgreen.svg',
  voucher: '/assets/icons/icon-voucher.svg',
  voucherdarkgreen: '/assets/icons/icon-voucher-darkgreen.svg',
  vouchergray100: '/assets/icons/icon-voucher-gray-100.svg',
  wallet: '/assets/icons/icon-walltet.svg',
  walletmint: '/assets/icons/icon-walltet-mint.svg',
  walletdark: '/assets/icons/icon-wallet-dark.svg',
  walletdarkgreen: '/assets/icons/icon-wallet-darkgreen.svg',
  paymentsuccess: '/assets/icons/icon-payment-success.svg',
  warning: '/assets/icons/icon-warning.svg',
  warninggray100: '/assets/icons/icon-warning-gray-100.svg',
  pdfcolor: '/assets/icons/icon-pdf-color.svg',
  faceId: '/assets/icons/icon-faceID.svg',
  faceIdDark: '/assets/icons/icon-faceID-dark.svg',
  faceIdMint: '/assets/icons/icon-faceID-mint.svg',
  cancelmint: '/assets/icons/icon-cancel-mint.svg',
  iconBurger: '/assets/icons/icon-hamburger-darkgreen.svg',
  iconClose: '/assets/icons/icon-hamburger-close-darkgreen.svg',
  // Payment icons path
  paypal: '/assets/payment-icons/icon-paypal.svg',
  creditcard: '/assets/payment-icons/icon-creditcard.svg',
  sofort: '/assets/payment-icons/icon-sofort.svg',
  americanexpress: '/assets/payment-icons/icon-amex.svg',
  sepadirectdebit: '/assets/payment-icons/icon-sepa-2.svg',
  paydirekt: '/assets/payment-icons/icon-paydirekt.svg',
  applepay: '/assets/payment-icons/icon-applepay.svg',
  renew: '/assets/icons/icon-renew-darkgreen.svg',
  sad: '/assets/icons/sad.svg',
  eurodarkgreen: '/assets/icons/icon-euro-darkgreen.svg',
  videodarkgreen: '/assets/icons/icon-video-darkgreen.svg',
  imprintdarkgreen: '/assets/icons/icon-imprint-darkgreen.svg',
  accessibilitydarkgreen: '/assets/icons/icon-accessibility-darkgreen.svg',
  dataprotectdarkgreen: '/assets/icons/icon-data-protect.svg',
  legaldarkgreen: '/assets/icons/icon-legal.svg',
  docs: '/assets/icons/icon-docs.svg',
  docsmint: '/assets/icons/icon-docs-mint.svg',
  docsdark: '/assets/icons/icon-docs-dark.svg',
  smile: '/assets/icons/icon-smile.svg',
  simdarkgreen: '/assets/icons/icon-simdarkgreen.svg',
  infoMessage: '/assets/icons/icon-info-message.svg',
  infoMessageDarkGreen: '/assets/icons/icon-info-message-darkgreen.svg',
  infoMessageMint: '/assets/icons/icon-info-message-mint.svg',
  activeStateMint: '/assets/icons/icon-active-state-mint.svg',
  pendingStateMint: '/assets/icons/icon-pending-state-mint.svg',
  pauseStateMint: '/assets/icons/icon-pause-state-mint.svg',
  metermint: '/assets/icons/icon-meter-mint.svg',
  feather: '/assets/icons/icon-feather.svg',
  featherblackgreen: '/assets/icons/icon-featherblackgreen.svg',
  iconCard: '/assets/icons/icon-card.svg',
  iconcardgray100: '/assets/icons/icon-card-gray-100.svg',
  iconPercentage: '/assets/icons/icons-percentage.svg',
  iconDash: '/assets/icons/icon-dash.svg',
  iconLightning: '/assets/icons/icon-lightning.svg',
  iconUser: '/assets/icons/icon-user.svg',
  iconPhone: '/assets/icons/icon-iphone.svg',
  iconAmex: '/assets/payment-icons/icon-amex-new.svg',
  iconApplePay: '/assets/payment-icons/icon-apple-pay.svg',
  iconApplePayLight: '/assets/payment-icons/icon-applepay-light.svg',
  iconGooglePay: '/assets/payment-icons/icon-google-pay.svg',
  iconGooglePayLight: '/assets/payment-icons/icon-googlepay-light.svg',
  iconMastercard: '/assets/payment-icons/icon-master.svg',
  iconVisa: '/assets/payment-icons/icon-visa.svg',
  iconPaypal: '/assets/payment-icons/icon-paypal-new.svg',
  iconSepa: '/assets/payment-icons/icon-sepa.svg',
  iconMaestro: '/assets/payment-icons/icon-maestro.svg'
};

export const appImages = {
  header404: '/assets/images/nc_grafik_header-404-uai.png',
  homePage: '/assets/images/nc_home_woman.png',
  playerBg: '/assets/images/nc_player_sample_bg.png',
  dataPasses: '/assets/images/nc_kv_frau-zitrone-1.png',
  dataPasses2: '/assets/images/nc_kv_frau-zitrone-2.png',
  popupImage: '/assets/images/nc_KV_frau-brille-gelb.png',
  optionImage: '/assets/images/nc_kv_mann-shirt-gelb_1.png',
  auslandImage: '/assets/images/nc_kv_frau-zitrone_1.png',
  teaser5gImage: '/assets/images/nc_kv_frau-zitrone-2 1.png',
  shareImage: '/assets/images/1200_630_shared_image_norma.jpg',
  logoMint: '/assets/images/logo/nc-logo_mint.svg',
  logoYellow: '/assets/images/logo/nc-logo_yellow.svg',
  logoMintWhite: '/assets/images/logo/nc-logo_mint-white.svg',
  logoAlphacommV1: '/assets/images/logo/alphacomm-logo-v1.svg', // ALPHA remove after MPS update?
  logoAlphacommV2: '/assets/images/logo/alphacomm-logo-v2.svg', // ALPHA remove after MPS update?
  alphacommLogo: '/assets/images/logo/alphacomm-logo-old.svg', // ALPHA remove after MPS update?
  logoSeal: '/assets/images/logo/nc_chip_seal.svg',
  iosStore: '/assets/images/ios-app.svg',
  androidStore: '/assets/images/android-app.svg',
  dummyImage: '/assets/images/nc_dummy-image.png',
  dummyImage2: '/assets/images/nc_dummy_image2.png'
};

export const appButtonTypes = {
  PRIMARY: {
    DEFAULT: 'btn btn-primary btn-default',
    LIGHT: 'btn btn-primary btn-light border border-primary',
    MINT: 'btn btn-primary btn-mint'
  },
  SECONDARY: {
    DEFAULT: 'btn btn-secondary btn-default',
    LIGHT: 'btn btn-secondary btn-light',
    MINT: 'btn btn-secondary btn-mint',
    DARK: 'btn btn-secondary btn-dark'
  },
  MISC: {
    DEFAULT: 'btn btn-misc btn-default',
    LIGHT: 'btn btn-misc btn-light',
    MINT: 'btn btn-misc btn-mint',
    DARK: 'btn btn-misc btn-dark'
  }
};

export const appKeyCode = {
  ESCAPE: 27,
  ENTER: 13,
  SPACE: 32,
  ARROW_DOWN: 40,
  ARROW_UP: 38,
  HOME: 36,
  END: 35,
  TAB: 9,
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  SHIFT: 16
};

export const appLinkStyle = {
  PRIMARY: 'text-primary',
  SECONDARY: 'text-mint-60',
  WHITE: 'text-white-60',
  ERROR: 'text-error'
};

export const appCounterButtonTypes = {
  LIGHT: 'btn btn-counter btn-light',
  DARK: 'btn btn-counter btn-dark'
};

export const appInfoBoxType = {
  WARNING: 'infobox infobox-warning',
  LIGHT: 'infobox infobox-light',
  LIGHT40: 'infobox infobox-light-40',
  SUCCESS: 'infobox infobox-success',
  DARK: 'infobox infobox-dark',
  TOGGLE: 'infobox infobox-toggle',
  ERROR: 'infobox infobox-error',
  TARIFF: 'infobox infobox-tariff'
};

export const appTextFieldLabelClass = {
  V1: 'v1',
  V2: 'v2'
};

export const appTextInputClass = {
  V1: 'v1',
  V2: 'v2'
};

export const appIconsPath = {
  HOME: '/assets/images/icons/home.svg'
};

export const appButtonType = {
  PRIMARY: 'btn btn-primary',
  SECONDARY: 'btn btn-secondary',
  DANGER: 'btn btn-danger',
  LINK: 'btn btn-link p-0'
};

export const formValidation = ({
  type = DEFAULT_FIELD_VALIDATION_TYPE.STRING, //  for which type of validation required
  required = false, // for for required validations
  minLength = false, // provide min length if required
  minLengthError = DEFAULT_ERROR_MESSAGE.fieldValidation.MIN_LENGTH,
  maxLength = false, // provide min length if required
  maxLengthError = DEFAULT_ERROR_MESSAGE.fieldValidation.MAX_LENGTH,
  regex = '', // regex if you want to do matching validation
  errorMessage = DEFAULT_ERROR_MESSAGE.fieldValidation.REQUIRED, // for addtional sub types of valdation which can required messages other than required.
  validErrorMessage = DEFAULT_ERROR_MESSAGE.fieldValidation.INVALID
}) => {
  // Assign the yup schema
  // Default willl be considered as string
  let valid = {};
  switch (type) {
    case DEFAULT_FIELD_VALIDATION_TYPE.ARRAY:
      valid = yup.array();
      break;
    case DEFAULT_FIELD_VALIDATION_TYPE.BOOLEAN:
      valid = yup.boolean();
      break;
    case DEFAULT_FIELD_VALIDATION_TYPE.DATE:
      valid = yup.date();
      break;
    case DEFAULT_FIELD_VALIDATION_TYPE.MIXED:
      valid = yup.mixed();
      break;
    case DEFAULT_FIELD_VALIDATION_TYPE.NUMBER:
      valid = yup.number();
      break;
    case DEFAULT_FIELD_VALIDATION_TYPE.OBJECT:
      valid = yup.object();
      break;
    case DEFAULT_FIELD_VALIDATION_TYPE.STRING:
      valid = yup.string();
      break;
    default:
      valid = yup.string();
      break;
  }

  // Check if required and set error message for it.
  if (required && typeof required === 'string') {
    valid = valid.required(required);
  }

  // Check if minimum length and set error message for it.
  if (minLength) {
    valid = valid.min(minLength, minLengthError);
  }

  // Check if maximum length and set error message for it.
  if (maxLength) {
    valid = valid.max(maxLength, maxLengthError);
  }

  // Check if type is email
  if (type === DEFAULT_FIELD_VALIDATION_TYPE.EMAIL) {
    valid = valid.email(errorMessage);
  }

  // Check if type is url
  if (type === DEFAULT_FIELD_VALIDATION_TYPE.URL) {
    valid = valid.url(errorMessage);
  }

  // Check if type is lowe_case
  if (type === DEFAULT_FIELD_VALIDATION_TYPE.LOWER_CASE) {
    valid = valid.lowercase(errorMessage);
  }

  // Check if type is upper_case
  if (type === DEFAULT_FIELD_VALIDATION_TYPE.UPPER_CASE) {
    valid = valid.uppercase(errorMessage);
  }

  // Check if regex is passed throw invalid error message.
  if (regex) {
    valid = valid.matches(regex, validErrorMessage);
  }

  return valid;
};

export const inputValidation = {
  VALID: 'valid',
  INVALID: 'invalid',

  MIN_ERROR: 'min',
  MAX_ERROR: 'max',

  MIN_MAX_ERROR: 'minMax',

  UPPER_CASE_ERROR: 'uppercase',
  LOWER_CASE_ERROR: 'lowecase',

  NUMBER_ERROR: 'number',
  SPECIAL_CASE_ERROR: 'specific',

  MATCH: 'match'
};

export const appRegex = {
  ..._appRegex,
  validatePwd:
    /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-zA-Z])(?=.*[?!\"§$%&#_()\[\]{}@*;:,\\/<>|~+-])|(?=.*[a-z])(?=.*[A-Z])(?=.*[?!\"§$%&#_()\[\]{}@*;:,\\/<>|~+-]))([\x21-\xFF]){12,100}$/,
  validatePwdStringLength: /^.{12,100}$/,
  validatePwdUpperOrLowerCase: /(?=.*[a-zA-Z])/,
  validatePwdNumbers: /(?=.*\d)/,
  validatePwdSpecialChar: /(?=.*[?!\"§$%&#_()\[\]{}@*;:,\\/<>|~+-])/
};

export const validCharRegex = {
  // Activation journey
  EMAIL: /^-|--|\.\.|[^a-zA-Z0-9ÖÄÜöäüß._+@-]|-@|(?<=@)-/g,
  EMAIL_VERIFICATION_CODE: /[^0-9]/g,
  MSISDN: /[^0-9]/g,
  PUK: /[^0-9]/g,
  OLD_NUMBER: /[^0-9]/g,
  FIRST_NAME: /[^a-zA-ZÄÖÜäöüß -]/g,
  LAST_NAME: /[^a-zA-ZÄÖÜäöüß -]/g,
  ZIP_CODE: /[^0-9]/g,
  PAYMENT_AMOUNT: /[^0-9]/g,
  CREDIT_CODE: /[^0-9]/g
};

// Validate invalid char in input fields
export function getForbiddenCharError(value, forbiddenPattern) {
  if (!value) return null;

  const matches = String(value).match(forbiddenPattern);
  const unique = [...new Set(matches || [])];

  if (unique.length > 0) {
    return `${unique.join(', ')}`;
  }
  return null;
}

// String Length Validations
// eslint-disable-next-line no-unused-vars
export function validateStringLength(string, min = 12, max = 64) {
  // return `${string}`.length >= min && `${string}`.length <= max;
  return appRegex.validateStringLength.test(string);
  // return (
  //   appRegex.validateString.test(string) && `${string}`.length >= min && `${string}`.length <= max
  // );
}

// String Minimum Length Validations
export function validateMinStringLength(string, min = 12) {
  return `${string}`.length >= min;
}

// UpperCase Validations
export function validateUpperCase(string) {
  return appRegex.validateUpperCase.test(string);
}

// LowerCase Validations
export function validateLowerCase(string) {
  return appRegex.validateLowerCase.test(string);
}

// Number Validations
export function validateNumber(string) {
  return appRegex.validateNumbers.test(string);
}

// Special Validations
export function validateSpecial(string) {
  // const pattern = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-zA-Z])(?=.*[?!\"§$%&#_()\[\]{}@*;:,\\/<>|~+-])|(?=.*[a-z])(?=.*[A-Z])(?=.*[?!\"§$%&#_()\[\]{}@*;:,\\/<>|~+-]))([\x21-\xFF]){8,100}$/;
  // eslint-disable-next-line prefer-regex-literals, no-useless-escape
  // const pattern = /(?=.*[?!\"§$%&#_()\[\]{}@*;:,\\/<>|~+-])/;
  // const pattern = /[ *?!"§$%&#_()[\]{}@*;:,\\/<>\|~+\-]/;
  return appRegex.validateSpecialChar.test(string);
  // return /(?=.*[!"§$%&#])/.test(string);
  // return appRegex.validateSpecial.test(string);
}

// Mobile Special Validations
export function validateMobileSpecial(string) {
  return /(?=.*[!$%&#])/.test(string);
  // return appRegex.validateSpecial.test(string);
}

// Password Validation
export function validatePassword(values) {
  // string, controlName, password

  const errors = Object.keys(values).map((controlName) => {
    const string = values[controlName];
    if (!string) {
      return {
        [controlName]: 'required'
      };
    }

    const hasLength = validateStringLength(values.newPassword, 12, 20);
    const hasUpperCase = validateUpperCase(values.newPassword);
    const hasLowerCase = validateLowerCase(values.newPassword);
    const hasNumber = validateNumber(values.newPassword);
    const hasSpecial = validateSpecial(values.newPassword);

    if (!hasLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      return {
        otherErrors: {
          [inputValidation.MIN_MAX_ERROR]: hasLength,
          [inputValidation.UPPER_CASE_ERROR]: hasUpperCase,
          [inputValidation.LOWER_CASE_ERROR]: hasLowerCase,
          [inputValidation.NUMBER_ERROR]: hasNumber,
          [inputValidation.SPECIAL_CASE_ERROR]: hasSpecial,
          [inputValidation.MATCH]: values.newPassword === values.confirmPassword
        }
      };
    }

    if (
      (values.newPassword || values.confirmPassword) &&
      values.newPassword !== values.confirmPassword
    ) {
      return { confirmPassword: 'match_error' };
    }

    return {};
  });
  return Object.assign(...errors);
}

// Password Validation
export function validatePasswordWithKeys(values, firstPasswordKey, confirmPasswordKey) {
  // string, controlName, password

  const errors = Object.keys(values).map((controlName) => {
    const string = values[controlName];
    if (!string) {
      return {
        [controlName]: 'required'
      };
    }

    const hasLength = validateStringLength(values[firstPasswordKey], 12, 20);
    const hasUpperCase = validateUpperCase(values[firstPasswordKey]);
    const hasLowerCase = validateLowerCase(values[firstPasswordKey]);
    const hasNumber = validateNumber(values[firstPasswordKey]);
    const hasSpecial = validateSpecial(values[firstPasswordKey]);

    if (!hasLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      return {
        otherErrors: {
          [inputValidation.MIN_MAX_ERROR]: hasLength,
          [inputValidation.UPPER_CASE_ERROR]: hasUpperCase,
          [inputValidation.LOWER_CASE_ERROR]: hasLowerCase,
          [inputValidation.NUMBER_ERROR]: hasNumber,
          [inputValidation.SPECIAL_CASE_ERROR]: hasSpecial,
          [inputValidation.MATCH]: values[firstPasswordKey] === values[confirmPasswordKey]
        }
      };
    }

    if (
      (values[firstPasswordKey] || values[confirmPasswordKey]) &&
      values[firstPasswordKey] !== values[confirmPasswordKey]
    ) {
      return { [confirmPasswordKey]: 'match_error' };
    }

    return {};
  });
  return Object.assign(...errors);
}
export const gettingNumberForGerman = (number = '') => {
  let num = number;
  // eslint-disable-next-line eqeqeq
  if (num.charAt(0) == 0) {
    num = num.substring(1);
  }
  return `+49${num}`;
};

export const formatDateToDDMMYYYY = (isoDateStr) => {
  const date = new Date(isoDateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

// states of MPS payment method taken from /customer/dom-with-products response in key "comfortTopup.paymentStatusId"
export const appMpsPaymentStatus = {
  ACTIVE: 1, // green pill on dashboard
  // Case "payment will be invalid soon" will not be delivered in the API at the moment.
  // This would be the yellow pill on dashboard
  // maybe EXPIRED: x
  INACTIVE: 5 // red pill on dashboard
};

export const appAutoTopUpType = {
  UNIQUE: 'UNIQUE',
  AUTOMATIC: 'AUTOMATIC'
};

export const appTopUpType = {
  UNIQUE: 'UNIQUE',
  DIRECT: 'DIRECT',
  AUTOMATIC: 'AUTOMATIC'
};

export const appTopUpTo = {
  SELF: 'SELF',
  OTHER: 'OTHER'
};

export const AutoTopUpFor = {
  ACTIVATION: 'ACTIVATION',
  LOGIN: 'LOGIN'
};

export const appAutoTopUpPeriodType = {
  LOW_BALANCE: 'LOW_BALANCE',
  ONCE_PER_MONTH: 'ONCE_PER_MONTH',
  RATE: 'FIXED_RATE'
};

export const appPaymentCertainAmount = [5, 10, 15, 20, 50];
export const appPaymentCertainDay = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28
];

export const appPaymentTokenStatus = {
  UNCONFIRMED: 'UNCONFIRMED_PAYMENT_TOKEN'
};

export const appPaymentOrderStatus = {
  CREATION_PENDING: 'creationPending'
};

// ALPHA: check if these constants can be deleted!
export const appPaymentProductType = {
  // Currently using
  RECURRING: 'RECURRING',
  LOW_BALANCE: 'LOW_BALANCE',
  DIRECT: 'DIRECT',

  // Extended
  ALL: 'ALL',
  PREPAID: 'PREPAID',
  TOPUP: 'TOPUP',
  CASH_CODE: 'CASH_CODE',
  VOUCHER: 'VOUCHER'
};

// used to map api values from e.g. /customer/dom-with-products or /recurring/methods
// to prop "method" in component <CardPaymentMethods />
export const appMpsPaymentMethodType = [
  // value in /customer/dom-with-products and /recurring/methods in field "payment"
  // now we have the same value for both endpoints!
  {
    apiValue: 'Kreditkarte',
    methodMapping: 'creditcard'
  },
  {
    // MPS: API value for PayPal still needs to be confirmed!, remove comment after confirmation
    apiValue: 'PayPal',
    methodMapping: 'paypal'
  }
];

// used to map api values from e.g. /customer/dom-with-products or /recurring/methods
// to prop "creditCardOption" in component <CardPaymentMethods />
export const appMpsCreditCardMapping = [
  {
    apiValue: 'Visa',
    iconMapping: 'visa',
    nameMapping: 'Visa'
  },
  {
    apiValue: 'MasterCard',
    iconMapping: 'Master',
    nameMapping: 'Mastercard'
  },
  {
    apiValue: 'American Express',
    iconMapping: 'amex',
    nameMapping: 'American Express'
  }
];

export const appCustomCardClass = {
  PAGE_CARD: 'page-card', // 734px
  ACTIVATION_CARD: 'activation-card', // 412px
  USAGE_CARD: 'usage-card',
  TARIFF_CARD: 'tariff-card',
  ACTIVE_TARIFF_CARD: 'active-tariff-card',
  PROFILE_CARD: 'profile-card',
  OPTION_CARD: 'option-card' // 412px
};

export const appOptionsGroupIDs = {
  TARIFF_OPTION: [350],
  DATA_OPTIONS: [115, 352],
  DAYFLATS: [151],
  SPEED_ONS_PASSES: [152],
  ROAMING: {
    LANDER_ZONE_1: [153],
    LANDER_ZONE_2: [154],
    LANDER_ZONE_3: [155]
  },
  OTHER: [156] // Sprach-Optionen
};

export const appPassCodes = {
  additionalInfo: {},
  speedOnsPassCodes: [],
  dayFlatPassCodes: [],
  dayFlatUnlimitedThreshold: 10995116277760
};

// BFSG: hard coded default values need to be replaced by proper error handling if static content is not available
export const appOptionIds = {
  etcOptions: [3011, 3012, 3013, 3014, 3015, 3016, 3024],
  additionalInfo: {
    3011: {
      legalText: 'nc_legaltext_etc_one_option_3011',
      flatrate: false
    },
    3012: {
      additionalTitle: 'Min/SMS',
      legalText: 'nc_legaltext_etc_one_option_3012',
      flatrate: true
    },
    3013: {
      legalText: 'nc_legaltext_etc_one_option_3013',
      flatrate: false
    },
    3014: {
      legalText: 'nc_legaltext_etc_one_option_3014',
      flatrate: false
    },
    3015: {
      legalText: 'nc_legaltext_etc_one_option_3015',
      flatrate: false
    },
    3016: {
      legalText: 'nc_legaltext_etc_one_option_3016',
      flatrate: false
    },
    3024: {
      legalText: 'nc_legaltext_etc_one_option_3024',
      flatrate: false
    }
  }
};

export const appTariffOptionSuccessType = {
  TARIFF: 'TARIFF',
  ADDITIONAL_OPTION: 'ADDITIONAL_OPTION',
  OPTION: 'OPTION',
  SPEED_ON: 'SPEED_ON',
  SPECIAL_OPTION: 'SPECIAL_OPTION',
  TARIFF_TO_THE_END: 'TARIFF_TO_THE_END',
  CANCEL_TARIFF_TO_THE_END: 'CANCEL_TARIFF_TO_THE_END'
};

export const appPdfList = {
  PRIVACY: 'serviceDocumentsPrivacy',
  TERMS: 'serviceDocumentsLegal',
  PRODUCT_SHEET: 'serviceDocumentsPib'
};

export const appTariffBulletGroup = {
  PROMOTIONAL_DATA: 'PROMOTIONAL_DATA',
  DATA: 'DATA',
  DESCRIPTION_ONE: 'DESCRIPTION_ONE',
  DESCRIPTION_TWO: 'DESCRIPTION_TWO',
  ROAMING_INCLUDE: 'ROAMING_INCLUDE',
  OTHER: 'OTHER'
};

export const appTariffPriceType = {
  PRICE: 'price',
  STARTER_PACK_PRICE: 'starterPackPrice'
};

// ETC One API documentation (PDF-file)
// https://rm5.dom.de/projects/tmb/wiki/00_Vendor_API_(EtcOne)

// Customer statuses from ETC One API documentation (PDF-file)
export const appCustomerStatus = {
  NEW: 0,
  ACTIVE: 1,
  CANCELLED: 3,
  NEW_INREALISATION: 5,
  INACTIVE: 6,
  IN_CANCELLATION: 7,
  MNP: 15,
  MARKED_DELETED: 99
};

export const appCustomerStatusName = {
  ACTIVE: 'ACTIVE'
};

// Product statuses from ETC One API documentation (PDF-file)
export const appTariffStatus = {
  ACTIVATION_PENDING: 0,
  ACTIVE: 1,
  REJECTED: 2,
  LOCKED: 3,
  LOCK_REQUESTED: 4,
  DEACTIVATION_REQUESTED: 5,
  PAUSED: 6,
  TERMINATION_REQUESTED: 7,
  UNLOCK_REQUESTED: 8,
  TERMINATED: 9,
  ACTIVATION_REQUESTED: 10,
  SENT: 11,
  CANCELLATION_REQUESTED: 12,
  CANCELLED: 13,

  // Defined by DOM, not part of the ETC One API documentation (PDF-file)
  ERROR: 500
};

export const appTariffStatusKey = {
  ACTIVATION_PENDING: 'ACTIVATION_PENDING',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
  LOCKED: 'LOCKED',
  LOCK_REQUESTED: 'LOCK_REQUESTED',
  DEACTIVATION_REQUESTED: 'DEACTIVATION_REQUESTED',
  PAUSED: 'PAUSED',
  TERMINATION_REQUESTED: 'TERMINATION_REQUESTED',
  UNLOCK_REQUESTED: 'UNLOCK_REQUESTED',
  TERMINATED: 'TERMINATED',
  ACTIVATION_REQUESTED: 'ACTIVATION_REQUESTED',
  SENT: 'SENT',
  CANCELLATION_REQUESTED: 'CANCELLATION_REQUESTED',
  CANCELLED: 'CANCELLED'
};

// Find Tariff Status Key
export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export const getTariffStatusKey = (statusId) => getKeyByValue(appTariffStatus, statusId);

export const appTariffChangeType = {
  IMMEDIATE: 0,
  NEXT_BILLING_CYCLE: 1
};

export const appUsageType = {
  VOICE: 'VOICE',
  DATA: 'DATA',
  SMS: 'SMS',
  DATA_UNL: 'DATA_UNL',
  VOICE_UNL: 'VOICE_UNL',
  SMS_UNL: 'SMS_UNL',
  MEASUREMENT: 'MEASUREMENT'
};

export const appUsageMeasurementsUnits = {
  MB: 'MB',
  GB: 'GB',
  MIN: 'MIN',
  Minuten: 'Minuten',
  SMS: 'SMS'
};

// TDM API response type
export const internetDataUnit = {
  GB: 'GB',
  MB: 'MB',
  KB: 'KB'
};

// Method to get data in GB from required unit
export const formatBytes = (data, units) => {
  const marker = 1024; // Change to 1000 if required
  const decimal = 1; // Change as required
  if (units === internetDataUnit.KB) {
    return (data / (marker * marker)).toFixed(decimal);
  }
  if (units === internetDataUnit.MB) {
    return (data / marker).toFixed(decimal);
  }
  if (units === internetDataUnit.GB) {
    return data;
  }
  return data;
};

// CLEANUP: NOT USED --> check later if it is still not used, if yes REMOVE
// export function validateEmail(string) {
//   return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
//     string
//   );
// }

export const DAYFLAT_TITLE = 'DayFlat unlimited';
export const DAYFLAT_VALUE = '10.240';
export const appPassTypeID = {
  DAY_FLAT_UNLIMITED: 102
};

export const validateYear = {
  DEFAULT_DOB_VALIDATION_YEAR: 16
};

export const displayPrice = (price) => {
  const amount = price;
  if (amount) {
    return parseFloat(amount).toFixed(2);
  }
  return 0;
};

export const appBreakPoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

// eslint-disable-next-line consistent-return
export const findBreakPoint = (screenSize) => {
  if (screenSize >= appBreakPoints.xxl) {
    return 'xxl';
  }
  if (screenSize >= appBreakPoints.xl) {
    return 'xl';
  }
  if (screenSize >= appBreakPoints.lg) {
    return 'lg';
  }
  if (screenSize >= appBreakPoints.md) {
    return 'md';
  }
  if (screenSize >= appBreakPoints.sm) {
    return 'sm';
  }
  if (screenSize >= appBreakPoints.xs) {
    return 'xs';
  }
};

export const validateDOB = () =>
  `${new Date().getFullYear() - validateYear.DEFAULT_DOB_VALIDATION_YEAR}/${
    new Date().getMonth() + 1
  }/${new Date().getDate()}`;

export const validateDate = (pickedDate = new Date()) => {
  // const { t } = useStaticContent();
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDay());
  return pickedDate < todayDate && pickedDate !== todayDate;
};

export const progressPrecentageValue = (minValue, maxValue) => (minValue / maxValue) * 100;

export const appTariffs = {
  // BFSG: Need to remove the EDEKA tariff ids at the end of Sprint 3
  TALK: 1803,
  KOMBI_S: 1812,
  KOMBI_M: 1813,
  KOMBI_L: 1814,
  KOMBI_XL: 1815,
  KOMBI_MAX: 1810,
  JAHRESTARIF_PREMIUM: 1816,
  JAHRESTARIF_START: 1811,
  TALK_JAHRESTARIF_START: 1817,

  // NORMA Tariffs
  SMART_S_5G: 1307,
  SMART_M_5G: 1308,
  SMART_L_5G: 1309,

  SMART_S: 1301,
  SMART_M: 1306,
  SMART_L: 1303,
  SMART_6: 1305,

  START_LTE: 1304
};

// ALPHA: check if this can deleted after migration to MPS
// Payment method's name
export const appPaymentMethods = {
  PAYPAL: 'paypal',
  SOFORT: 'sofort',
  CREDIT_CARD: 'creditcard',
  PAY_DIRECT: 'paydirekt',
  SEPA_DIRECT_DEBIT: 'sepa-direct-debit',
  AMERICAN_EXPRESS: 'amex',
  GIROPAY: 'giropay',
  GOOGLE_PAY: 'googlepay',
  APPLE_PAY: 'applepay',
  OPEN_BANKING: 'openbanking'
};

// mapping of payment method's name from API
export const PAYMENT_METHODS = {
  APPLE_PAY: 'applepay',
  GOOGLE_PAY: 'googlepay',
  CREDIT_CARD: 'creditcard',
  PAYPAL: 'paypal'
};

export const CREDIT_CARD_SUBTYPES = {
  VISA: 'creditcard_visa',
  MASTERCARD: 'creditcard_mastercard',
  AMEX: 'creditcard_amex'
};

export const faqCategory = {
  THREE_G: '3G',
  GENERAL: 'Allgemeines',
  UNLOCK: 'Freischalten',
  CUSTOMER_PORTAL: 'Kundenportal',
  TARIFE: 'Tarife',
  ESIM: 'eSIM'
};

export const birthdayBonus = {
  AVAILABLE: 'NONE'
};

export const appTokenStatus = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled'
};

export const appBubbleTextType = {
  GRAY: 'text-text-gray-100',
  WHITE: 'text-white',
  DARKGREEN: 'text-darkgreen'
};

export const appBubbleBackground = {
  MINT80: 'bg-mint-80',
  MINT60: 'bg-mint-60',
  WHITE: 'bg-white'
};

export const getAppPdfIds = () => {
  const { t, staticContentData } = useStaticContent();

  return {
    AGB: t('nc_id_agb'),
    EVN: t('nc_id_evn'),
    PRICELIST: staticContentData?.nc_pdfPricelist?.pdfId // t('nc_id_pricelist'),
  };
};

export const appBubbleTextOpenPosition = {
  TOP: 'top',
  BOTTOM: 'bottom'
};

export const appTariffFailTypes = {
  SPEEDON: 'SPEEDON',
  DAYFLAT: 'DAYFLAT',
  TARIFF: 'TARIFF',
  OPTION: 'OPTION'
};

export const appGenericSwipType = {
  RED: 'red',
  ORANGE: 'orange',
  GREEN: 'green',
  BLUE: 'blue'
};

export const appGrenericSwipBg = {
  RED: 'linear-gradient(90deg, #D60F19 -0.15%, #FC3 100.91%)',
  ORANGE: 'linear-gradient(90deg, #EC671B -0.15%, #FC3 100.91%)',
  GREEN: 'linear-gradient(90deg, #0FD647 -0.15%, #33FF85 100.91%)',
  BLUE: 'linear-gradient(90deg, #0F47D6 -0.15%, #3378FF 100.91%)'
};

export const deviceRegex = {
  ISIOS: /iPhone|iPad|iPod/i,
  ISANDRIOD: /Android/i
};

export const makeCall = (number) => {
  // this function is called when the user clicks on the support button to open call screen
  const phoneNumber = number;

  // Open the call screen
  window.location.href = `tel: + ${phoneNumber}`;
};

export const onEmailClick = (email) => {
  // this function is called when the user clicks on the support button to open call screen
  const mail = email;

  // Open the call screen
  window.location.href = `mailto:${mail}`;
};

export function generateUUID() {
  var d = new Date().getTime();
  // eslint-disable-next-line no-bitwise
  var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; // Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function generateRandomValue() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomValue = '';
  /* eslint-disable no-plusplus */
  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-bitwise
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomValue += characters.charAt(randomIndex);
  }

  return randomValue;
}

export const animationHandler = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  // eslint-disable-next-line no-unused-vars
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });

export const getPlanIconName = (name) => name.replace(/-/g, '').toLowerCase();

// UNUSED: seems to be unused, delete later (end of May 2026) if no one has complained
// export const isArray = (obj) => {
//   if (typeof Array.isArray === 'undefined') {
//     return Object.prototype.toString.call(obj) === '[object Array]';
//   }
//   return false;
// };

// #region // CLEANUP: remove later after testing
// const formatDataVolume = (value) => {
//   if (Number.isInteger(value)) {
//     return value.toLocaleString('de-DE');
//   }

//   let newValue = value.toLocaleString('de-DE', {
//     minimumFractionDigits: 1,
//     maximumFractionDigits: 1
//   });
//   if (newValue?.endsWith(',0')) {
//     newValue = newValue.slice(0, -2);
//   }
//   return newValue;
// };

// export const calculateDataVolume = (input) => {
//   if (input && input.toLowerCase().includes('mb')) {
//     const value = parseFloat(
//       input.toLowerCase().replace('mb', '').replace('.', '').replace(',', '.').trim()
//     );
//     let result = '';
//     if (value >= 1000) {
//       result = `${formatDataVolume(value / 1000)} GB`;
//     } else {
//       result = `${formatDataVolume(value)} MB`;
//     }
//     return result;
//   }
//   return input;
// };
// #endregion

// for TDM2 and ETC options
export const getDataExpiryTime = (expiryTimeFromCounters) => {
  const [expiryDate, expiryTime] = (expiryTimeFromCounters ?? '').split(' ');
  const [hours, minutes] = (expiryTime ?? '').split(':');
  return {
    expiryDate,
    expiryTime: `${hours}:${minutes}`
  };
};

export const isNullValue = (val) => {
  if (val === null || val === 0 || val === '0' || val === undefined || !val) return true;
  return false;
};

export const isLocalHost = () => window.location.hostname === 'localhost';

// checks if given link should route to external website
export const isExternalLink = (link) => link.startsWith('http://') || link.startsWith('https://');

export function convertToBytes(size, unit) {
  const units = {
    B: 1,
    KB: 1000,
    MB: 1000 ** 2,
    GB: 1000 ** 3,
    TB: 1000 ** 4
  };
  return size * units[unit];
}

export function parseInput(input) {
  const [size, unit] = input.split(' ');
  return [parseFloat(size), unit];
}

export function compareStorage(input1, input2) {
  const [size1, unit1] = parseInput(input1);
  const [size2, unit2] = parseInput(input2);

  const size1InBytes = convertToBytes(size1, unit1);
  const size2InBytes = convertToBytes(size2, unit2);

  return size1InBytes >= size2InBytes;
}

export function parseHistoryDate(dateStr) {
  if (!dateStr) return { datePart: '', timePart: '', year: null };
  const [datePart, timeRaw] = dateStr.split(' ');
  const timePart = timeRaw ? timeRaw.substring(0, 5) : '';
  const parts = datePart.split('.');
  const year = parts.length === 3 ? parseInt(parts[2], 10) : null;
  return { datePart, timePart, year };
}

export const parseToGermanPrice = (amount, useCurrencyOptions = true, hideDecimals = false) => {
  let formatOptions = {};
  if (useCurrencyOptions) {
    formatOptions = {
      style: 'currency',
      currency: 'EUR'
    };
    if (hideDecimals) {
      formatOptions.minimumFractionDigits = 0;
      formatOptions.maximumFractionDigits = 0;
    }
  }
  return new Intl.NumberFormat('de-DE', formatOptions).format(amount);
};

// #region // CLEANUP: remove later after testing
// export const keyValueValidation = (key, value) => key && !key.includes(value);
// #endregion

// Checks if a specific key in an object is `true` while all other keys are `false`
export function isOnlySpecificKeyInObjTrue(obj, specificKey) {
  if (!obj || typeof obj !== 'object') return false;

  const isSpecificKeyTrue = obj[specificKey] === true;
  const areOtherKeysFalse = Object.entries(obj).every(
    ([key, value]) => key === specificKey || value === false
  );

  return isSpecificKeyTrue && areOtherKeysFalse;
}

// Validates a string against a forbidden character pattern and returns a custom error message if validation fails
// pass yupInstance to handle both Yup or yup imports
export function validateForbiddenChar(yupInstance, forbiddenPattern, errorMessageKey) {
  return yupInstance.string().test(
    'forbidden-chars',
    errorMessageKey, // this will be used as the message if test fails
    function (value) {
      const { path, createError } = this;
      const errorMessage = getForbiddenCharError(value, forbiddenPattern);

      if (errorMessage) {
        // Return same error message key (example: ek_global_email_err)
        return createError({ path, message: errorMessageKey });
      }

      return true;
    }
  );
}

// Function to check if object is empty or not.
export const isEmptyObject = (obj) => {
  if (typeof obj === 'string') {
    try {
      const parsed = JSON.parse(obj);

      // Ensure it's a plain object
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return Object.entries(parsed).length === 0;
      }

      // Parsed successfully but not an object
      return true;
    } catch (error) {
      // Invalid JSON
      return true;
    }
  }

  // It's already an object
  return Object.entries(obj).length === 0;
};

function parseHex(hex) {
  if (!hex) return null;
  let parsedHex = hex?.replace('#', '');
  if (parsedHex.length === 3) {
    parsedHex = parsedHex.split('').map(c => c + c).join('');
  }
  return {
    r: parseInt(parsedHex.slice(0, 2), 16),
    g: parseInt(parsedHex.slice(2, 4), 16),
    b: parseInt(parsedHex.slice(4, 6), 16),
  };
}

export function isColorDark(hex) {
  const hexSplitted = parseHex(hex);
  if (!hexSplitted) return null;
  const { r, g, b } = hexSplitted;

  // Perceived luminance (ITU-R BT.709)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return luminance < 0.5;
}

export default {
  appRoute,
  storageKeys,
  appAlert,
  gettingNumberForGerman,
  formatDateToDDMMYYYY,
  validateDOB,
  progressPrecentageValue,
  isOnlySpecificKeyInObjTrue,
  validateForbiddenChar,
  isColorDark
};
