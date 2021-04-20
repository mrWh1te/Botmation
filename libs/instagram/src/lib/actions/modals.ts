/**
 * @description   Functions to interact with the Instagram's Modals
 */
import { BotAction } from '@botmation/core'

import { TURN_OFF_NOTIFICATIONS_BUTTON_LABEL } from '../constants/modals'
import { MAIN_MODAL_HEADER_SELECTOR } from '../constants/selectors'
import { TURN_OFF_NOTIFICATIONS_MODAL_HEADER_TEXT } from '../constants/modals'
import { ConditionalBotAction } from '@botmation/core'

/**
 * @description   ConditionalBotAction that resolves TRUE if the "Turn On Notifications Modal" is detected as in, actively displaying in the webpage
 * @param page
 */
export const isTurnOnNotificationsModalActive: ConditionalBotAction = async(page) => {
  const modalHeader = await page.$(MAIN_MODAL_HEADER_SELECTOR)
  const modalHeaderText = await page.evaluate(el => el === null || el.textContent === null ? '' : el.textContent, modalHeader)

  return modalHeader !== null && modalHeaderText === TURN_OFF_NOTIFICATIONS_MODAL_HEADER_TEXT
}

/**
 * @description   BotAction that closes the "Turn on Notifications" modal by clicking a "no" option
 * @param page
 */
export const closeTurnOnNotificationsModal: BotAction = async (page) => {
  // click button with text "Not Now" inside the dialog
  const [button] = await page.$x("//button[contains(., '" + TURN_OFF_NOTIFICATIONS_BUTTON_LABEL + "')]")
  if (button) {
    await button.click()
  }
}

