import { promises as fs } from 'fs'

import { BotAction, BotAction5 } from '../interfaces/bot-actions.interfaces'
import { getFileUrl } from '../helpers/assets'
import { logError } from '../helpers/console'

/**
 * @description   Parse page's cookies to save as JSON in local file
 *                Relies on BotOptions (options), to determine URL
 * @param fileName 
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
export const saveCookies = (fileName: string): BotAction5 => async(page, options) => {
  try {
    const cookies = await page.cookies()
    await fs.writeFile(getFileUrl(options.cookies_directory, options, fileName) + '.json', JSON.stringify(cookies, null, 2))
  } catch(error) {
    logError('[BotAction:saveCookies] ' + error)
  }
}

/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 *                Relies on BotOptions (options), to determine URL
 * @param fileName 
 * @example loadCookies('cookies')
 */
export const loadCookies = (fileName: string): BotAction5 => async(page, options) => {
  try {
    const file = await fs.readFile(getFileUrl(options.cookies_directory, options, fileName) + '.json')
    const cookies = JSON.parse(file.toString())

    for (const cookie of cookies) {
      await page.setCookie(cookie)
    }
  } catch(error) {
    logError('[BotAction:loadCookies] ' + error)
  }
}