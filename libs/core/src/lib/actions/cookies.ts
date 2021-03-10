import { promises as fs } from 'fs'

import { BotAction, BotFilesAction } from '../interfaces/bot-actions'
import { enrichBotFileOptionsWithDefaults } from '../helpers/files'
import { BotFileOptions } from '../interfaces'
import { getFileUrl } from '../helpers/files'
import { getInjectsPipeValue, injectsHavePipe, unpipeInjects } from '../helpers/pipe'
import { Protocol } from 'puppeteer'
import { logWarning } from '../helpers/console'

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

/**
 * Get cookies for the specified URL's. If no URL's are provided, it gets the cookies for the current URL
 * @param page
 * @param injects
 */
export const getCookies = (...urls: string[]): BotAction<Protocol.Network.Cookie[]> => async(page) =>
  page.cookies(...urls)


/**
 * Delete cookies provided. Can be provided through HO param OR through pipe value as a fallback
 * @param cookies
 */
export const deleteCookies = (...cookies: Protocol.Network.Cookie[]): BotAction => async(page, ...injects) => {
  if (cookies.length === 0) {
    if (injectsHavePipe(injects)) {
      const pipeValue = getInjectsPipeValue(injects)
      if (Array.isArray(pipeValue) && pipeValue.length > 0) {
        cookies = pipeValue
      }
    }
  }

  if (cookies.length > 0) {
    return page.deleteCookie(...cookies)
  }
}
