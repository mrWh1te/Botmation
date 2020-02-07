import { Page } from 'puppeteer'

import { BotAction } from "../interfaces/bot-action.interfaces"
import { getScreenshotLocalFilePath } from '../helpers/assets'

import { forAll } from './utilities'
import { goTo } from './navigation'

/**
 * @description   Take a PNG screenshot of the current page
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string): BotAction => async(page: Page) => {
  await page.screenshot({path: getScreenshotLocalFilePath(`${fileName}.png`)})
}

/**
 * @description    given a list of websites, the bot will visit each, wait for them to load, then take a screenshot to save in the escreenshot directory
 * @param sites ['example.com', 'whatever.com']
 * @example   screenshotAll('google.com', 'twitter.com')
 * @experimental
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
export const screenshotAll = (...sites: string[]): BotAction => async(page: Page) =>
  forAll(sites)(
    (siteName) => ([
      goTo('https://' + siteName),
      screenshot(siteName)
    ])
  )(page)