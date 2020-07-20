/**
 * @description    Example OOP class wrapper to encapsulate the page, and any injects, a dev may choose to use
 */

import { Page, Browser } from 'puppeteer'

import { BotAction } from './interfaces/bot-actions.interfaces'
import { chain } from './actions/factories'
import { BotmationInterface } from './interfaces/botmation.interface'
import { errors } from './actions/errors'

/**
 * @name          Botmation
 * @description   Declarative bot class for running composable actions on a Puppeteer browser page
 */
export class Botmation implements BotmationInterface {
  /**
   * @description   Page of the brower the bot is crawling
   */
  private page: Page

  /**
   * @description   Injectables for your custom BotAction's, optional
   */
  private injects: any[]

  /**
   * @description   Constructor for building a Botmation instance with a specific Browser page and optional other params
   * @param page 
   * @param injects 
   */
  constructor(page: Page, ...injects: any[]) {
    this.page = page
    this.injects = injects
  }
  
  /**
   * @description    static async constructor method that will get a page from the browser to operate in
   * @param browser 
   * @param injects 
   */
  public static async asyncConstructor(browser: Browser, ...injects: any[]): Promise<Botmation> {
    // Grab the first open page from the browser, otherwise make a new one
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    // Then return a normal instance
    return new Botmation(page, ...injects)
  }

  /**
   * @description   Run BotAction's in sequence - declaratively with the composable BotActionsChainFactory
   *                Supports higher-order bot action functions in the /actions directory
   * 
   *                This function gives an easy method to chain bot actions together in sequence to run on the Bot's page
   *                So instead of doing something like this with a Puppeteer page instance:
   *                  await page.goto(...)
   *                  await page.keyboard.type(...)
   * 
   *                We remove each `await` & `page`, with dynamic scoping, through the BotActionsChainFactory to resolve the chain of promises in sequence
   * 
   *                This is in-part, based on a promisified pipe, but this does not take the output of the last operation as input for the next.
   * @example         
   *                  await bot.actions(
   *                    goTo('feed'),
   *                    favoriteAllFrom('username1', 'username2')
   *                  )
   * @param actions  
   */
  public async actions(...actions: BotAction[]): Promise<void> {
    return errors('Botmation Class')(
      chain(...actions)
    )(this.page, ...this.injects)
  }

  /**
   * @param page {Puppeteer.Page}
   */
  setPage(page: Page) {
    this.page = page
  }
  /**
   * @param page {Puppeteer.Page}
   */
  getPage(): Page {
    return this.page
  }

  /**
   * @description    Public method to set the Injects if needed
   * @param injects spreaded array
   */
  public setInjects(...injects: any[]) {
    this.injects = injects
  }

  /**
   * @description   Close the Page/Tab from the browser that the bot was crawling
   */
  async closePage(): Promise<void> {
    if (this.page) {
      await this.page.close()
    }
  }
}
