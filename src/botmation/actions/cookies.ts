import { promises as fs } from 'fs'

import { BotAction, BotAction5 } from '../interfaces/bot-actions.interfaces'
import { getFileUrl } from '../helpers/assets'
import { logError } from '../helpers/console'
import { getDefaultBotFileOptions } from 'botmation/helpers/file-options'

/**
 * @description   Parse page's cookies to save as JSON in local file
 *                Relies on BotOptions (options), to determine URL
 * @param fileName 
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
// @TODO strongly type options, maybe partial? maybe the dev doesn't use the higher order files()()
//        so add a fallback in here to enrich options, in case missing
export const saveCookies = (fileName: string): BotAction5 => async(page, options) => {
  try {
    options = getDefaultBotFileOptions(options)
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
    options = getDefaultBotFileOptions(options)
    const file = await fs.readFile(getFileUrl(options.cookies_directory, options, fileName) + '.json')
    const cookies = JSON.parse(file.toString())

    for (const cookie of cookies) {
      await page.setCookie(cookie)
    }
  } catch(error) {
    logError('[BotAction:loadCookies] ' + error)
  }
}