/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import { appStorage } from '@config/AppConfig';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function setCookie(key, value) {
  try {
    if (key === appStorage.USER_AUTH_DATA && value) {
      const removeToken =
        typeof value === 'object'
          ? value
          : typeof value === 'string'
          ? JSON.parse(value) || {}
          : {};
      delete removeToken.access_token;
      delete removeToken.refresh_token;
      cookies.set(key, JSON.stringify(removeToken));
      return true;
    }
    cookies.set(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

export function getCookie(key) {
  try {
    return cookies.get(key);
  } catch (error) {
    return false;
  }
}

export function removeCookie(key) {
  try {
    cookies.remove(key);
    return false;
  } catch (error) {
    return false;
  }
}

export function deleteAllCookies() {
  // eslint-disable-next-line no-shadow
  const cookies = document.cookie.split(';');

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export default {
  setCookie,
  getCookie,
  removeCookie,
  deleteAllCookies
};
