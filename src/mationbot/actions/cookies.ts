import { Page } from 'puppeteer'
import { promises as fs } from 'fs'

import { ASSETS_COOKIES_DIRECTORY, ROOT_ASSETS_DIRECTORY } from '@config'

import { BotAction } from "@mationbot/interfaces/bot-action.interfaces"
import { logError } from '@mationbot/actions/console'
import { createURL } from '@mationbot/helpers/urls'

/**
 * @description   Parse page's cookies to save as JSON in local file
 * @param fileName 
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
export const saveCookies = (fileName: string): BotAction => async(page: Page) => {
  try {
    const cookies = await page.cookies()
    await fs.writeFile(`${createURL('.', ROOT_ASSETS_DIRECTORY, ASSETS_COOKIES_DIRECTORY)}${fileName}.json`, JSON.stringify(cookies, null, 2))
  } catch(error) {
    logError('[BotAction:saveCookies] ' + error)
  }
}

/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 * @param fileName 
 * @example loadCookies('./cookies.json')
 */
export const loadCookies = (fileName: string): BotAction => async(page: Page) => {
  try {
    const file = await fs.readFile(`${createURL('.', ROOT_ASSETS_DIRECTORY, ASSETS_COOKIES_DIRECTORY)}${fileName}.json`)
    const cookies = JSON.parse(file.toString())

    for (const cookie of cookies) {
      await page.setCookie(cookie)
    }
  } catch(error) {
    logError('[BotAction:loadCookies] ' + error)
  }
}