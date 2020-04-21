import { Page } from 'puppeteer'

import { BotAction } from "../interfaces/bot-action.interfaces"

import { forAll } from './utilities'
import { goTo } from './navigation'
import { getFileUrl } from '../helpers/assets'

/**
 * @description   Take a PNG screenshot of the current page
 *                It relies on `options`, BotOptions, to determine the URL to save the asset in
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string): BotAction<void> => async(page: Page, options) => {
  const fileUrl = getFileUrl(options.screenshots_directory, options, fileName) + '.png'

  await page.screenshot({path: fileUrl})
}

/**
 * @description    given a list of websites, the bot will visit each, wait for them to load, then take a screenshot to save in the escreenshot directory
 * @param urls ['https://example.com', 'http://whatever.com']
 * @example   screenshotAll('https://google.com', 'https://twitter.com')
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
export const screenshotAll = (...urls: string[]): BotAction<void> => async(page: Page, options) =>
  await forAll(urls)(
    (url) => ([
      goTo(url),
      screenshot(url.replace(/[^a-zA-Z]/g, '_')) // filenames are created from urls by replacing nonsafe characters with underscores
    ])
  )(page, options)