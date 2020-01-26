import puppeteer from 'puppeteer'

import { BotAction } from "@mationbot/interfaces/bot-action.interfaces"
import { getPageScreenshotLocalFileUrl } from '@helpers/assets'

/**
 * @description   Take a PNG screenshot of the current page
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string): BotAction => async(tab: puppeteer.Page) => {
  await tab.screenshot({path: getPageScreenshotLocalFileUrl(`${fileName}.png`)})
}