import { Page } from 'puppeteer'
import { DirectNavigationOptions } from 'puppeteer'

import { BotAction } from '../interfaces/bot-action.interfaces'
import { getDefaultGoToPageOptions } from '../helpers/navigation'
import { logWarning } from '../helpers/console'

/**
 * @description   Single Higher Order Function for Page Changing
 *                If the URL given to navigate too is the same as the existing one, it will skip navigation and log a warning
 * @param url
 */
export const goTo = (url: string, goToOptions?: DirectNavigationOptions): BotAction<void> => async(page: Page) => {
  if (!goToOptions) {
    goToOptions = getDefaultGoToPageOptions()
  }

  // same url check
  if (page.url() === url) {
    logWarning('[Action:goTo] url requested is already active')
    return
  }

  await page.goto(url, goToOptions)
}

/**
 * @description   Wait for navigation to complete. Helpful after submitting a form that causes change pages to occur, ie logging in
 */
export const waitForNavigation: BotAction<void> = async(page: Page) => {
  await page.waitForNavigation()
}
