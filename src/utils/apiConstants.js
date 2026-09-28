
// third party API urls for calls which are directly used here (as calls or in logic e.g conditional statements)
// and not in a SDK
export const appAPIUri = {
  MO: {
    CUSTOMER: {
      SAVE_LOGIN_DATA: 'customer/save-login-data'
    },
    TARIFF: {
      CHANGE_TARIFF: "product/change-tariff",
      PRODUCT_CANCEL_OR_ACCEPT_BY_CUSTOMER: 'product/cancel-or-accept-by-customer'
    },
    LOOKUP: {
      CHECK_MSISDN_OF_CLIENT: 'lookup/check-msisdn-of-client'
    }
  },
  OPEN_ID_CONNECT: {
    LOGIN: 'token',
    LOGIN_PASSWORD: 'password',
    TOKEN: '/protocol/openid-connect/token',
    LOGOUT: '/protocol/openid-connect/logout',
    SILENT_LOGIN: '/api/silent-login',
  },
};

// App API Headers
export const appAPIHeaders = {
  DEFAULT_JSON: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  DEFAULT_RAW_JSON: {
    "Content-Type": "application/json",
  },
  DEFAULT_BASE_JSON: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
  DEFAULT_ACCEPT_JSON: {
    accept: "application/json",
  },
};

export const HTTP_REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  PATCH: 'PATCH',
};

export const getErrorMessageBody = (error) => (
  error?.response?.data?.domMessage ||
  error?.response?.domMessage ||
  error?.domMessage ||
  error?.response?.data?.detail ||
  error?.response?.data?.errorMesage ||
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.response?.message ||
  error?.response?.detail ||
  // eslint-disable-next-line no-underscore-dangle
  error?.response?._response ||
  error?.message
);
