import { INSTAGRAM_URL_EXT_LOGIN, INSTAGRAM_BASE_URL } from "../constants/urls"

/**
 * @description   Provides helpful methods for parsing URL's and getting URL's to crawl (ie Instagram login URL)
 */

export const getInstagramBaseUrl = () =>
  INSTAGRAM_BASE_URL + '/'

export const getInstagramLoginUrl = () => 
  getInstagramBaseUrl() + INSTAGRAM_URL_EXT_LOGIN + '/'