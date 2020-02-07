/**
 * @description   Functions to interact with the Modals ie web specific, Turn on Notifications
 */
import { Page } from 'puppeteer'

import { BotAction } from '../../../interfaces/bot-action.interfaces'

import { TURN_OFF_NOTIFICATIONS_BUTTON_LABEL } from 'botmation/bots/instagram/constants/modals'

/**
 * @description   Bot action that closes the "Turn on Notifications" modal by clicking a "no" option
 */
export const closeTurnOnNotificationsModal = (): BotAction => async (page: Page): Promise<void> => {
  // click button with text "Not Now" inside the dialog
  // we don't want to deal with Notifications within the web app
  const [button] = await page.$x("//button[contains(., '" + TURN_OFF_NOTIFICATIONS_BUTTON_LABEL + "')]")
  if (button) {
    await button.click()
  }
}
