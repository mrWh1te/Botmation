import { INSTAGRAM_URL_EXT_LOGIN, INSTAGRAM_BASE_URL } from "../constants/urls"

/**
 * @description   Returns the main base URL for Instagram without a trailing backslash
 */
export const getInstagramBaseUrl = () =>
  INSTAGRAM_BASE_URL

/**
 * @description   Returns Instagram's Login URL with a trailing backslash
 */
export const getInstagramLoginUrl = () => 
  getInstagramBaseUrl() + INSTAGRAM_URL_EXT_LOGIN + '/'