import { promises as fs } from 'fs'
import { Protocol } from 'puppeteer'

import { Action, injectsValue } from '@botmation/v2core'

import { enrichFileOptionsWithDefaults } from '../helpers/files'
import { FileOptions } from '../interfaces/file-options'
import { getFileUrl } from '../helpers/files'
import { injectsPage } from '../types/injects'

/**
 * @description   Parse page's cookies and save them as JSON in a local file
 *                Relies on fileOptions (options), to determine URL
 *                Works with files()() for setting cookies directory & parent directory
 *                fileOptions overrides injected values from files()()
 * @param fileName
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
// TODO spike saveCookies concept using pipe(getCookies, saveToDisk)
export const saveCookies = (fileName: string, fileOptions?: Partial<FileOptions>): Action<injectsPage & {fileOptions: FileOptions}> =>
  async({page, fileOptions: injectedOptions}) => {
    // fileOptions is higher order param that overwrites injected options
    const hydratedOptions = enrichFileOptionsWithDefaults({...injectedOptions, ...fileOptions})
    const cookies = await page.cookies()

    await fs.writeFile(getFileUrl(hydratedOptions.cookies_directory, hydratedOptions, fileName) + '.json', JSON.stringify(cookies, null, 2))
  }

/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 *                Relies on fileOptions (options), to determine URL
 *                Works with files()() for setting cookies directory & parent directory
 *                fileOptions overrides injected values from files()()
 * @param fileName
 * @example loadCookies('cookies')
 */
export const loadCookies = (fileName: string, fileOptions?: Partial<FileOptions>): Action<injectsPage & {fileOptions: FileOptions}> =>
  async({page, fileOptions: injectedOptions}) => {
    // fileOptions is higher order param that overwrites injected options
    const hydratedOptions = enrichFileOptionsWithDefaults({...injectedOptions, ...fileOptions})
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
export const getCookies = (...urls: string[]): Action<injectsPage, Protocol.Network.Cookie[]> =>
  async({page}) =>
    page.cookies(...urls)


/**
 * Delete cookies provided. Can be provided through HO param OR through pipe value as a fallback
 * @param cookies
 */
export const deleteCookies = (...cookies: Protocol.Network.Cookie[]): Action<injectsPage & Partial<injectsValue>> =>
  async({page, value}) => {
    if (cookies.length === 0) {
      if (value && Array.isArray(value) && value.length > 0) {
        cookies = value
      }
    }

    if (cookies.length > 0) {
      return page.deleteCookie(...cookies)
    }
  }
