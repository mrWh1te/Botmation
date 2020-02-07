import { Page } from 'puppeteer'
import { promises as fs } from 'fs'

import { BotAction } from '../interfaces/bot-action.interfaces'
import { logError, log } from './console'
import { getFileUrl } from '../helpers/urls'

/**
 * @description   Parse page's cookies to save as JSON in local file
 * @param fileName 
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
export const saveCookies = (fileName: string): BotAction => async(page: Page, options) => {
  try {
    const cookies = await page.cookies()
    const cookiesFile = getFileUrl(options.cookies_directory, options, fileName) + '.json'
    console.log('[saveCookies] cookiesFile = ' + cookiesFile)
    await fs.writeFile(cookiesFile, JSON.stringify(cookies, null, 2))
  } catch(error) {
    logError('[BotAction:saveCookies] ' + error)
  }
}

/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 * @param fileName 
 * @example loadCookies('./cookies.json')
 */
export const loadCookies = (fileName: string): BotAction => async(page: Page, options) => {
  const cookiesFile = getFileUrl(options.cookies_directory, options, fileName) + '.json'
  console.log('[loadCookies] cookiesFile = ' + cookiesFile)

  try {
    const cookiesFile = getFileUrl(options.cookies_directory, options, fileName) + '.json'
    log('[loadCookies] cookiesFile = ' + cookiesFile)
    const file = await fs.readFile(cookiesFile)
    const cookies = JSON.parse(file.toString())

    for (const cookie of cookies) {
      await page.setCookie(cookie)
    }
  } catch(error) {
    const cookiesFile = getFileUrl(options.cookies_directory, options, fileName) + '.json'
    log('[loadCookies] cookiesFile = ' + cookiesFile)
    logError('[BotAction:loadCookies] ' + error)
  }
}