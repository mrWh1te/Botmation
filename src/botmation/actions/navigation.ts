import { DirectNavigationOptions, NavigationOptions } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions'
import { enrichGoToPageOptions, sleep, scrollToElement } from '../helpers/navigation'
import { chain } from './assembly-lines'

/**
 * @description   Go to url provided in the current page
 *                Can customize behavior with a Partial of Puppeteer's DirectNavigationOptions
 *                If the URL given to navigate too is the same as the existing one, it will skip navigation and log a warning
 * @param url
 */
export const goTo = (url: string, goToOptions?: Partial<DirectNavigationOptions>): BotAction => 
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
export const goBack = (options?: NavigationOptions): BotAction => 
  async(page) => {
    await page.goBack(options)  
  }

/**
 * @description   Go forward one page like hitting the "Forward" button in a Browser
 * @param options 
 */
export const goForward = (options?: NavigationOptions): BotAction => 
  async(page) => {
    await page.goForward(options)  
  }

/**
 * @description   Reload current page. In case of multiple redirects, the navigation will resolve with the response of the last redirect.
 * @param options 
 */
export const reload = (options?: NavigationOptions): BotAction =>
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
 * @description   Pauses the runner (chain or pipe) for the provided milliseconds before continuing to the next BotAction
 * @param milliseconds 
 */
export const wait = (milliseconds: number): BotAction => async() => {
  await sleep(milliseconds)
} 

/**
 * 
 * @param htmlSelector 
 */
export const scrollTo = (htmlSelector: string): BotAction => 
  chain(
    // todo evaluate(function, ...params) BotAction
    async(page) => await page.evaluate(scrollToElement, htmlSelector),
    wait(2500) // wait for scroll to complete
  )