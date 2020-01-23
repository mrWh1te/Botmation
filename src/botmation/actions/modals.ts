/**
 * @description   Functions to interact with the Modals ie web specific, Turn on Notifications
 */
import puppeteer from 'puppeteer'

import { MAIN_MODAL_HEADER_SELECTOR } from '@selectors'
import { BotAction } from '@botmation/interfaces/bot-action.interfaces'

const TURN_OFF_NOTIFICATIONS_MODAL_HEADER_TEXT = 'Turn on Notifications'
const TURN_OFF_NOTIFICATIONS_BUTTON_LABEL = 'Not Now'

/**
 * @description   Instamation action closes the "Turn on Notifications" modal by clicking a "no" option
 */
export const closeTurnOnNotificationsModal = (): BotAction => async (tab: puppeteer.Page): Promise<void> => {
  // click button with text "Not Now" inside the dialog
  // we don't want to deal with Notifications within the web app
  const [button] = await tab.$x("//button[contains(., '"+TURN_OFF_NOTIFICATIONS_BUTTON_LABEL+"')]")
  if (button) {
    await button.click()
  }
}

//
// Helpers
export const isTurnOnNotificationsModalActive = async(tab: puppeteer.Page): Promise<boolean> => {
  const modalHeader = await tab.$(MAIN_MODAL_HEADER_SELECTOR)
  const modalHeaderText = await tab.evaluate(el => el === null || el.textContent === null ? '' : el.textContent, modalHeader)

  return modalHeader !== null && modalHeaderText === TURN_OFF_NOTIFICATIONS_MODAL_HEADER_TEXT
}
