import { DirectNavigationOptions, NavigationOptions } from 'puppeteer'

import { BotAction5 } from '../interfaces/bot-actions.interfaces'
import { getDefaultGoToPageOptions } from '../helpers/navigation'
import { logWarning } from '../helpers/console'

/**
 * @description   Single Higher Order Function for Page Changing
 *                If the URL given to navigate too is the same as the existing one, it will skip navigation and log a warning
 * @param url
 */
export const goTo = (url: string, goToOptions?: DirectNavigationOptions): BotAction5 => async(page) => {
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
 * @description   Go back one page (like hitting the "Back" button in a Browser)
 * @param options 
 * @alpha 
 * @TODO Test this
 */
export const goBack = (options?: NavigationOptions): BotAction5 => async(page) => {
  await page.goBack(options)  
}

/**
 * @description   Go back one page (like hitting the "Back" button in a Browser)
 * @param options 
 * @alpha 
 * @TODO Test this
 */
export const goForward = (options?: NavigationOptions): BotAction5 => async(page) => {
  await page.goForward(options)  
}

/**
 * @description   Reload current page. In case of multiple redirects, the navigation will resolve with the response of the last redirect.
 * @param options 
 * @alpha 
 * @TODO Test this
 */
export const reload = (options?: NavigationOptions): BotAction5 => async(page) => {
  await page.reload(options)
}

/**
 * @description   Wait for navigation to complete. Helpful after submitting a form that causes change pages to occur, ie logging in
 */
export const waitForNavigation: BotAction5 = async(page) => {
  await page.waitForNavigation()
}
