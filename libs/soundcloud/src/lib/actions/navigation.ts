import { goTo } from "@botmation/puppeteer";

import { SOUNDCLOUD_URL_BASE, SOUNDCLOUD_URL_LOGIN, SOUNDCLOUD_URL_LOGOUT } from './../constants/urls'

// Default navigation options for these Actions
const goToNavigationOptions: Parameters<typeof goTo>[1] = {
  waitUntil: 'load'
}

// Generic
/**
 * Takes URL extension and appends it to the BASE url of https://soundcloud.com/{artistUrlExtension}
 * @param artistUrlExtension ie 'idealismus' -> `https://soundcloud.com/idealismus`
 */
export const goToArtist = (artistUrlExtension: string) => goTo(SOUNDCLOUD_URL_BASE + artistUrlExtension, goToNavigationOptions)

// Auth
export const goToLogin = goTo(SOUNDCLOUD_URL_LOGIN, goToNavigationOptions)
export const goToLogout = goTo(SOUNDCLOUD_URL_LOGOUT, goToNavigationOptions)
