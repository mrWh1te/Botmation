import { Page } from 'puppeteer'
import { DirectNavigationOptions } from 'puppeteer'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'
import { getDefaultGoToPageOptions } from '@mationbot/helpers/navigation'

import { logWarning } from '@mationbot/actions/console'

/**
 * @description   Single Higher Order Function for Page Changing
 * @param url
 */
export const goTo = (url: string, goToOptions?: DirectNavigationOptions): BotAction => async(page: Page) => {
  if (!goToOptions) {
    // optional param, when not provided, we provide the default value
    goToOptions = getDefaultGoToPageOptions()
  }

  if (page.url() === url) {
    // same url check
    logWarning('[Action:goTo] url requested is already active')
    return
  }

  await page.goto(url, goToOptions)
}

/**
 * @description   Wait for navigation to complete. Helpful after submitting a form, liking logging in.
 */
export const waitForNavigation = (): BotAction => async(page: Page) => {
  await page.waitForNavigation()
}
