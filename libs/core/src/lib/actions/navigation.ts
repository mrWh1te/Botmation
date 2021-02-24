import { WaitForOptions } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions'
import { enrichGoToPageOptions, scrollToElement } from '../helpers/navigation'
import { chain } from './assembly-lines'
import { evaluate } from './scrapers'
import { wait } from './time'

/**
 * @description   Go to url provided in the current page
 *                Can customize behavior with a Partial of Puppeteer's WaitForOptions
 *                If the URL given to navigate too is the same as the existing one, it will skip navigation and log a warning
 * @param url
 */
export const goTo = (url: string, goToOptions?: Partial<WaitForOptions>): BotAction =>
  async(page) => {
    goToOptions = enrichGoToPageOptions(goToOptions)

    // same url check
    if (page.url() === url) {
      return
    }

    await page.goto(url, goToOptions)
  }

/**
 * @description   Go back one page like hitting the "Back" button in a Browser
 * @param options
 */
export const goBack = (options?: WaitForOptions): BotAction =>
  async(page) => {
    await page.goBack(options)
  }

/**
 * @description   Go forward one page like hitting the "Forward" button in a Browser
 * @param options
 */
export const goForward = (options?: WaitForOptions): BotAction =>
  async(page) => {
    await page.goForward(options)
  }

/**
 * @description   Reload current page. In case of multiple redirects, the navigation will resolve with the response of the last redirect.
 * @param options
 */
export const reload = (options?: WaitForOptions): BotAction =>
  async(page) => {
    await page.reload(options)
  }

/**
 * @description   Wait for navigation to complete
 *                Helpful for SPA's when submitting a form causes a page change, ie logging in
 */
export const waitForNavigation: BotAction = async(page) => {
  await page.waitForNavigation()
}

/**
 *
 * @param htmlSelector
 * @param waitTimeForScroll milliseconds to wait for scrolling
 */
export const scrollTo = (htmlSelector: string, waitTimeForScroll: number = 2500): BotAction =>
  chain(
    evaluate(scrollToElement, htmlSelector), // init's scroll code, but does not wait for it to complete
    wait(waitTimeForScroll) // wait for scroll to complete
  )
