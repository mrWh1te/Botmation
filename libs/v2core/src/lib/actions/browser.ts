import { Page, Browser } from "puppeteer"
import * as puppeteer from 'puppeteer'

import { Action } from "../interfaces"
import { upsertInject } from "./inject"

import { injects, injectsBrowser } from './../types/injects'


/**
 * inject (browser) returns new line of BotActions with browser added to injects
 */
export const browser =
  <I extends injects = injects>(...browserLaunchOptions: Parameters<typeof puppeteer.launch>) =>
    (...actions: Action<I & {browser: Browser}>[]): Action<I> =>
      upsertInject('browser')(getBrowser(...browserLaunchOptions))(...actions)

/**
 * get Puppeteer browser instance
 * @param browserLaunchOptions
 */
export const getBrowser =
  <I extends injects = injects>(...browserLaunchOptions: Parameters<typeof puppeteer.launch>): Action<I, Browser> =>
    async() => puppeteer.launch(...browserLaunchOptions)

/**
 * sets `page` inject
 * @param browserPageIndex 0+ to get from browser.pages() array or undefined (or blank, negative numbers) to get a new page from the injected browser
 */
export const browserPage =
  <I extends injectsBrowser = injectsBrowser>(browserPageIndex?: number) =>
    (...actions: Action<I & {page: Page}>[]): Action<I & {page: Page}> =>
      upsertInject('page')(getBrowserPage(browserPageIndex))(...actions)

/**
 * Grab a particular page from the `browser` inject by pages() index or a new page (negative number as browserPageIndex or undefined)
 * @param browserLaunchOptions
 */
export const getBrowserPage =
  <I extends injectsBrowser = injectsBrowser>(browserPageIndex?: number): Action<I, Page> =>
    async({browser}) => {
      if (browserPageIndex && browserPageIndex >= 0) {
        const pages = await browser.pages()
        return pages[browserPageIndex]
      } else {
        const newPage = await browser.newPage()
        return newPage
      }
    }


