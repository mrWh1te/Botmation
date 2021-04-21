import { BotAction, goTo } from "@botmation/core"
import { INSTAGRAM_URL_BASE, INSTAGRAM_URL_EXPLORE, INSTAGRAM_URL_MESSAGING, INSTAGRAM_URL_SETTINGS } from "../constants/urls"

export const goToHome: BotAction = goTo(INSTAGRAM_URL_BASE)
export const goToMessaging: BotAction = goTo(INSTAGRAM_URL_MESSAGING)
export const goToExplore: BotAction = goTo(INSTAGRAM_URL_EXPLORE)
export const goToSettings: BotAction = goTo(INSTAGRAM_URL_SETTINGS)
