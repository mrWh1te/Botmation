import { createURL } from "botmation/helpers/urls"
import { INSTAGRAM_URL_EXT_LOGIN, INSTAGRAM_BASE_URL } from "botmation/bots/instagram/constants/urls"

/**
 * @description   Provides helpful methods for parsing URL's and getting URL's to crawl (ie Instagram login URL)
 */

export const getInstagramBaseUrl = () =>
  createURL(INSTAGRAM_BASE_URL)

export const getInstagramLoginUrl = () => 
  createURL(INSTAGRAM_BASE_URL, INSTAGRAM_URL_EXT_LOGIN)