import { Page, Browser } from "puppeteer"
import * as puppeteer from 'puppeteer'

import { Action, upsertInject, Injects } from "@botmation/v2core"
import { InjectBrowser } from './../types/injects'


/**
 * inject (browser) returns new line of Actions with browser added to injects
 */
export const browser =
  <I extends Injects = Injects>(...browserLaunchOptions: Parameters<typeof puppeteer.launch>) =>
    (...actions: Action<I & {browser: Browser}>[]): Action<I> =>
      upsertInject('browser')(getBrowser(...browserLaunchOptions))(...actions)

/**
 * get Puppeteer browser instance
 * @param browserLaunchOptions
 */
export const getBrowser =
  <I extends Injects = Injects>(...browserLaunchOptions: Parameters<typeof puppeteer.launch>): Action<I, Browser> =>
    async() => puppeteer.launch(...browserLaunchOptions)

/**
 * sets `page` inject
 * @param browserPageIndex 0+ to get from browser.pages() array or undefined (or blank, negative numbers) to get a new page from the injected browser
 */
export const browserPage =
  <I extends InjectBrowser = InjectBrowser>(browserPageIndex?: number) =>
    (...actions: Action<I & {page: Page}>[]): Action<I & {page: Page}> =>
      upsertInject('page')(getBrowserPage(browserPageIndex))(...actions)

/**
 * Grab a particular page from the `browser` inject by pages() index or a new page (negative number as browserPageIndex or undefined)
 * @param browserPageIndex undefined gets first active page or creates one if none exists (default behavior)
 *                         number equal to or greater than zero acts as pages() index to grab a specific page
 *                         'new' or any negative number will create a new page
 */
export const getBrowserPage =
  <I extends InjectBrowser = InjectBrowser>(browserPageIndex?: number|'new'): Action<I, Page> =>
    async({browser}) => {
      if (!browserPageIndex) {
        const pages = await browser.pages()
        const page = pages.length === 0 ? await browser.newPage() : pages[0]
        return page
      }

      if (browserPageIndex && browserPageIndex >= 0) {
        const pages = await browser.pages()
        return pages[browserPageIndex]
      }

      const newPage = await browser.newPage()
      return newPage
    }


