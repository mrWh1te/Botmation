import { promises as fs } from 'fs'

import { BotFilesAction } from '../interfaces/bot-actions'
import { enrichBotFileOptionsWithDefaults } from 'botmation/helpers/file-options'
import { BotFileOptions } from 'botmation/interfaces'
import { getFileUrl } from 'botmation/helpers/files'

/**
 * @description   Parse page's cookies to save as JSON in local file
 *                Relies on BotOptions (options), to determine URL
 * @param fileName 
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
export const saveCookies = (fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction => async(page, options) => {
  // botFileOptions is higher order param that overwrites injected options
  const hydratedOptions = enrichBotFileOptionsWithDefaults({...options, ...botFileOptions})
  
  const cookies = await page.cookies()
  await fs.writeFile(getFileUrl(hydratedOptions.cookies_directory, hydratedOptions, fileName) + '.json', JSON.stringify(cookies, null, 2))
}

/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 *                Relies on BotOptions (options), to determine URL
 * @param fileName 
 * @example loadCookies('cookies')
 */
export const loadCookies = (fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction => async(page, options) => {
  // botFileOptions overwrites injected options
  const hydratedOptions = enrichBotFileOptionsWithDefaults({...options, ...botFileOptions})

  const file = await fs.readFile(getFileUrl(hydratedOptions.cookies_directory, hydratedOptions, fileName) + '.json')
  const cookies = JSON.parse(file.toString())

  for (const cookie of cookies) {
    await page.setCookie(cookie)
  }
}