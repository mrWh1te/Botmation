/**
 * @description   Functions to interact with the Instagram's Modals
 */
import { Action } from '@botmation/v2core'

import { TURN_OFF_NOTIFICATIONS_BUTTON_LABEL } from '../constants/modals'
import { MAIN_MODAL_HEADER_SELECTOR } from '../constants/selectors'
import { TURN_OFF_NOTIFICATIONS_MODAL_HEADER_TEXT } from '../constants/modals'
import { InjectBrowserPage } from '@botmation/puppeteer'

/**
 * @description   ConditionalAction that resolves TRUE if the "Turn On Notifications Modal" is detected as in, actively displaying in the webpage
 * @param page
 */
export const isTurnOnNotificationsModalActive: Action<InjectBrowserPage> = async({page}) => {
  const modalHeader = await page.$(MAIN_MODAL_HEADER_SELECTOR)
  const modalHeaderText = await page.evaluate(el => el === null || el.textContent === null ? '' : el.textContent, modalHeader)

  return modalHeader !== null && modalHeaderText === TURN_OFF_NOTIFICATIONS_MODAL_HEADER_TEXT
}

/**
 * @description   Action that closes the "Turn on Notifications" modal by clicking a "no" option
 * @param page
 */
export const closeTurnOnNotificationsModal: Action<InjectBrowserPage> = async ({page}) => {
  // click button with text "Not Now" inside the dialog
  const [button] = await page.$x("//button[contains(., '" + TURN_OFF_NOTIFICATIONS_BUTTON_LABEL + "')]")
  if (button) {
    await button.click()
  }
}

