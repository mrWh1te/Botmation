import { promises as fs } from 'fs'

import { BotFilesAction } from '../interfaces/bot-actions.interfaces'
import { getFileUrl } from '../helpers/assets'
import { enrichBotFileOptionsWithDefaults } from 'botmation/helpers/file-options'

/**
 * @description   Parse page's cookies to save as JSON in local file
 *                Relies on BotOptions (options), to determine URL
 * @param fileName 
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
export const saveCookies = (fileName: string): BotFilesAction => async(page, options) => {
  const hydratedOptions = enrichBotFileOptionsWithDefaults(options)
  
  const cookies = await page.cookies()
  await fs.writeFile(getFileUrl(hydratedOptions.cookies_directory, hydratedOptions, fileName) + '.json', JSON.stringify(cookies, null, 2))
}

/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 *                Relies on BotOptions (options), to determine URL
 * @param fileName 
 * @example loadCookies('cookies')
 */
export const loadCookies = (fileName: string): BotFilesAction => async(page, options) => {
  const hydratedOptions = enrichBotFileOptionsWithDefaults(options)

  const file = await fs.readFile(getFileUrl(hydratedOptions.cookies_directory, hydratedOptions, fileName) + '.json')
  const cookies = JSON.parse(file.toString())

  for (const cookie of cookies) {
    await page.setCookie(cookie)
  }
}