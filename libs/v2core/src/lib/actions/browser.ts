import { Page, launch, Browser } from "puppeteer"

import { BotAction } from "../interfaces"
import { upsertInject } from "./inject"
// import { goTo } from "./navigation"

import { injects, injectsBrowser } from './../types/injects'


/**
 * inject (browser) returns new line of BotActions with browser added to injects
 */
export const browser =
  <I extends injects = injects>(...browserLaunchOptions: Parameters<typeof launch>) =>
    (...actions: BotAction<I & {browser: Browser}>[]): BotAction<I> =>
      upsertInject('browser')(
        getBrowser(...browserLaunchOptions)
      )(...actions)

/**
 * get Puppeteer browser instance
 * @param browserLaunchOptions
 */
export const getBrowser =
  <I extends injects = injects>(...browserLaunchOptions: Parameters<typeof launch>): BotAction<I, Browser> =>
    async() => launch(...browserLaunchOptions)

/**
 * sets `page` inject
 * @param browserPageIndex 0+ to get from browser.pages() array or undefined (or blank, negative numbers) to get a new page from the injected browser
 */
export const browserPage =
  <I extends injectsBrowser = injectsBrowser>(browserPageIndex?: number) =>
    (...actions: BotAction<I & {page: Page}>[]): BotAction<I & {page: Page}> =>
      upsertInject<I>('page')(getBrowserPage(browserPageIndex))(...actions)

/**
 * Grab a particular page from the `browser` inject by pages() index or a new page (negative number as browserPageIndex or undefined)
 * @param browserLaunchOptions
 */
export const getBrowserPage =
  <I extends injectsBrowser = injectsBrowser>(browserPageIndex?: number): BotAction<I, Page> =>
    async({browser}) => {
      if (browserPageIndex && browserPageIndex >= 0) {
        const pages = await browser.pages()
        return pages[browserPageIndex]
      } else {
        const newPage = await browser.newPage()
        return newPage
      }
    }


