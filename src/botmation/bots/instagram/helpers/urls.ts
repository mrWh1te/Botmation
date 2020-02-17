import { INSTAGRAM_URL_EXT_LOGIN, INSTAGRAM_BASE_URL } from "../constants/urls"

export const getInstagramBaseUrl = () =>
  INSTAGRAM_BASE_URL + '/'

export const getInstagramLoginUrl = () => 
  getInstagramBaseUrl() + INSTAGRAM_URL_EXT_LOGIN + '/'