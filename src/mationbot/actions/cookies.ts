import puppeteer from 'puppeteer'
import { promises as fs } from 'fs'

import { BotAction } from "@mationbot/interfaces/bot-action.interfaces"

/**
 * @description   Parse page's cookies to save as JSON in local file
 * @param fileNamePath 
 * @example saveCookies('./cookies.json')
 */
export const saveCookies = (fileNamePath: string): BotAction => async(page: puppeteer.Page) => {
  const cookies = await page.cookies()
  await fs.writeFile(fileNamePath, JSON.stringify(cookies, null, 2))
}

/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 * @param fileNamePath 
 * @example loadCookies('./cookies.json')
 */
export const loadCookies = (fileNamePath: string): BotAction => async(page: puppeteer.Page) => {
  const file = await fs.readFile(fileNamePath)
  const cookies = JSON.parse(file.toString())

  for (const cookie of cookies) {
    await page.setCookie(cookie)
  }
}