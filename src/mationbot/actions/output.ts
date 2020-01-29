import puppeteer from 'puppeteer'

import { BotAction } from "@mationbot/interfaces/bot-action.interfaces"
import { getPageScreenshotLocalFileUrl } from '@helpers/assets'

import { forAll } from '@mationbot/actions/utilities'
import { goTo } from '@mationbot/actions/navigation'

/**
 * @description   Take a PNG screenshot of the current page
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string): BotAction => async(tab: puppeteer.Page) => {
  await tab.screenshot({path: getPageScreenshotLocalFileUrl(`${fileName}.png`)})
}

/**
 * @description    given a list of websites, the bot will visit each, wait for them to load, then take a screenshot to save in the escreenshot directory
 * @param sites ['example.com', 'whatever.com']
 * @example   screenshotAll('google.com', 'twitter.com')
 * @experimental
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
export const screenshotAll = (...sites: string[]): BotAction => async(tab: puppeteer.Page) =>
  forAll(sites)(
    (siteName) => ([
      goTo('https://' + siteName),
      screenshot(siteName)
    ])
  )(tab)