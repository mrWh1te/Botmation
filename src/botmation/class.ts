/**
 * @description    Main OOP class wrapper to encapsulate the page, options, and any injects, a dev may choose to use
 */

import { Page, Browser } from 'puppeteer'

import { BotOptions } from './interfaces/bot-options.interfaces'
import { BotAction } from './interfaces/bot-actions.interfaces'
import { BotActionsChainFactory } from './factories/bot-actions-chain.factory'
import { BotmationInterface } from './interfaces/botmation.interface'

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
   * @description   Botmation configuration options (optional with safe defaults)
   *                Configures assets like screenshots, cookies
   */
  private options: Partial<BotOptions>

  /**
   * @description   Injectables for your custom BotAction's, optional
   */
  private injects: any[]

  /**
   * @description   Constructor for building a Botmation instance with a specific Browser page and optional other params
   * @param  options   to overload any of the safe defaults
   */
  constructor(page: Page, options: Partial<BotOptions> = {}, ...injects: any[]) {
    this.page = page
    this.options = options
    this.injects = injects
  }
  
  /**
   * @description    static async constructor method that will get a page from the browser to operate in
   * @param  options   optional to override any safe defaults
   */
  public static async asyncConstructor(browser: Browser, options: Partial<BotOptions> = {}, ...injects: any[]): Promise<Botmation> {
    // Grab the first open page from the browser, otherwise make a new one
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    // Then return a normal instance
    return new Botmation(page, options, injects)
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
  public async actions(...actions: BotAction<any|void>[]): Promise<any|void> { // TODO verify that this function can return the last returned BotAction value in the chain
    return BotActionsChainFactory(this.page, this.options, ...this.injects)(...actions) // TODO replace with BotActionsFactory() 
                                                                              // TODO maintain tests for the BotActionsFactory, and add tests to cover this
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
   * @description    Public method to update the Options if needed
   * @param options 
   */
  public updateOptions(options: Partial<BotOptions>) {
    this.options = {
      ...this.options,
      ...options
    }
  }
  /**
   * @description    Override whatever overloading partial of options we have with what's given
   *                 Missing options are provided default values
   * @param options 
   */
  public setOptions(options: Partial<BotOptions>) {
    this.options = options
  }

  /**
   * @description    Public method to set the Injects if needed
   * @param injects 
   * @experimental   Injects are new
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
