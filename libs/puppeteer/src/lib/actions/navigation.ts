import { WaitForOptions } from 'puppeteer'

import { Action } from '@botmation/v2core'
import { chain } from '@botmation/v2core'
import { wait } from '@botmation/v2core'

import { enrichGoToPageOptions, scrollToElement } from '@botmation/core' // todo move to puppeteer package

import { evaluate } from './scrape'
import { InjectPage } from '../types/injects'

/**
 * @description   Go to url provided in the current page
 *                Can customize behavior with a Partial of Puppeteer's WaitForOptions
 *                If the URL given to navigate too is the same as the existing one, it will skip navigation and log a warning
 * @param url
 */
export const goTo = (url: string, goToOptions?: Partial<WaitForOptions>): Action<InjectPage> =>
  async({page}) => {
    if (page.url() === url) {
      return
    }

    await page.goto(url, enrichGoToPageOptions(goToOptions))
  }

/**
 * @description   Go back one page like hitting the "Back" button in a Browser
 * @param options
 */
export const goBack = (options?: WaitForOptions): Action<InjectPage> =>
  async({page}) => {
    await page.goBack(options)
  }

/**
 * @description   Go forward one page like hitting the "Forward" button in a Browser
 * @param options
 */
export const goForward = (options?: WaitForOptions): Action<InjectPage> =>
  async({page}) => {
    await page.goForward(options)
  }

/**
 * @description   Reload current page. In case of multiple redirects, the navigation will resolve with the response of the last redirect.
 * @param options
 */
export const reload = (options?: WaitForOptions): Action<InjectPage> =>
  async({page}) => {
    await page.reload(options)
  }

/**
 * @description   Wait for navigation to complete
 *                Helpful for SPA's when submitting a form causes a page change, ie logging in
 */
export const waitForNavigation: Action<InjectPage> = async({page}) => {
  await page.waitForNavigation()
}

/**
 *
 * @param htmlSelector
 * @param waitTimeForScroll milliseconds to wait for scrolling
 */
export const scrollTo = (htmlSelector: string, waitTimeForScroll: number = 2500): Action<InjectPage> =>
  chain<InjectPage>(
    evaluate(scrollToElement, htmlSelector), // init's scroll code, but does not wait for it to complete
    wait(waitTimeForScroll) // wait for scroll to complete
  )
