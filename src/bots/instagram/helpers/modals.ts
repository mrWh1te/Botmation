import { Page } from 'puppeteer'

import { MAIN_MODAL_HEADER_SELECTOR } from '@bots/instagram/selectors'
import { TURN_OFF_NOTIFICATIONS_MODAL_HEADER_TEXT } from '@bots/instagram/constants/modals'

//
// Helpers
/**
 * @description   Returns a promise that resolves TRUE, if the "Turn on Notifications" modal is in view
 * @param page 
 */
export const isTurnOnNotificationsModalActive = async(page: Page): Promise<boolean> => {
  const modalHeader = await page.$(MAIN_MODAL_HEADER_SELECTOR)
  const modalHeaderText = await page.evaluate(el => el === null || el.textContent === null ? '' : el.textContent, modalHeader)

  return modalHeader !== null && modalHeaderText === TURN_OFF_NOTIFICATIONS_MODAL_HEADER_TEXT
}