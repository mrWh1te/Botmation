import { Action } from "@botmation/v2core"
import { goTo, InjectBrowserPage } from '@botmation/puppeteer'

import { INSTAGRAM_URL_BASE, INSTAGRAM_URL_EXPLORE, INSTAGRAM_URL_MESSAGING, INSTAGRAM_URL_SETTINGS } from "../constants/urls"

export const goToHome: Action<InjectBrowserPage> = goTo(INSTAGRAM_URL_BASE)
export const goToMessaging: Action<InjectBrowserPage> = goTo(INSTAGRAM_URL_MESSAGING)
export const goToExplore: Action<InjectBrowserPage> = goTo(INSTAGRAM_URL_EXPLORE)
export const goToSettings: Action<InjectBrowserPage> = goTo(INSTAGRAM_URL_SETTINGS)
