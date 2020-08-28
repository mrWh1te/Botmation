import { promises as fs } from 'fs'

import { BotFilesAction } from '../interfaces/bot-actions'
import { enrichBotFileOptionsWithDefaults } from '../helpers/files'
import { BotFileOptions } from '../interfaces'
import { getFileUrl } from '../helpers/files'
import { unpipeInjects } from 'botmation/helpers/pipe'

/**
 * @description   Parse page's cookies and save them as JSON in a local file
 *                Relies on BotFileOptions (options), to determine URL
 *                Works with files()() for setting cookies directory & parent directory
 *                botFileOptions overrides injected values from files()()
 * @param fileName 
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
export const saveCookies = (fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction => 
  async(page, ...injects) => {
    const [,injectedOptions] = unpipeInjects(injects, 1)

    // botFileOptions is higher order param that overwrites injected options
    const hydratedOptions = enrichBotFileOptionsWithDefaults({...injectedOptions, ...botFileOptions})
    
    const cookies = await page.cookies()
    await fs.writeFile(getFileUrl(hydratedOptions.cookies_directory, hydratedOptions, fileName) + '.json', JSON.stringify(cookies, null, 2))
  }

/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 *                Relies on BotFileOptions (options), to determine URL
 *                Works with files()() for setting cookies directory & parent directory
 *                botFileOptions overrides injected values from files()()
 * @param fileName 
 * @example loadCookies('cookies')
 */
export const loadCookies = (fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction => 
  async(page, ...injects) => {
    const [,injectedOptions] = unpipeInjects(injects, 1)

    // botFileOptions is higher order param that overwrites injected options
    const hydratedOptions = enrichBotFileOptionsWithDefaults({...injectedOptions, ...botFileOptions})

    const file = await fs.readFile(getFileUrl(hydratedOptions.cookies_directory, hydratedOptions, fileName) + '.json')
    const cookies = JSON.parse(file.toString())

    for (const cookie of cookies) {
      await page.setCookie(cookie)
    }
  }