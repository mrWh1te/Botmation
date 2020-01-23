/**
 * @description    Main source code wrapper to encapsulate main methods with Puppeteer.Page
 */

import puppeteer from 'puppeteer'

import { ACCOUNT_USERNAME, ACCOUNT_PASSWORD } from '@config'

import { BotOptions } from './interfaces/bot-options.interfaces'
import { BotAction } from './interfaces/bot-action.interfaces'
import { BotActionsChainFactory } from './factories/bot-actions-chain.factory'
import { ifThen } from './actions/utilities'
import { login, isGuest } from './actions/auth'

//
// As the project grows, we'll add different bots that follow the same base interface
export interface MationBotInterface {
  setup(browser: puppeteer.Browser, options: BotOptions): Promise<void>
  destroy(): Promise<void>
}
// @future MationBotOptions to replace InstamationOptions for use

/**
 * @description   Instagram bot that uses a Puppeteer browser
 */
export class MationBot implements MationBotInterface {
  // Puppeteer
  private activeTab: puppeteer.Page

  // Instamation
  private options: BotOptions

  /**
   * @note   Please don't call this constructor directly, instead use the async one below
   *         If you do call the constructor directly, please call "await bot.setup()" on the bot before running any actions
   * @param options optional partial
   */
  constructor(tab: puppeteer.Page, options: Partial<BotOptions> = {}) {
    this.activeTab = tab
    this.options = {
      // Default Config
      auth: {
        username: ACCOUNT_USERNAME,
        password: ACCOUNT_PASSWORD
      },
      // Overload config with provided options (optional)
      ...options
    }
  }
  /**
   * @description    Runs the constructor then runs async setup code before returning instance
   * @param  options   optional to override default options
   */
  public static async asyncConstructor(browser: puppeteer.Browser, options?: Partial<BotOptions>) {
    // Grab the first open page (tab) from the browser, otherwise make a new one
    const pages = await browser.pages()
    const tab = pages.length === 0 ? await browser.newPage() : pages[0] // does this need an await at the start of the expression? That edge case has to be tested, since on browser launch, there is a page open

    // Provide the browser, tab it will be operating in, and any optional overloading options
    const bot = new MationBot(tab, options)
    await bot.setup()
    return bot
  }

  /**
   * @description    Loads cookies, db and runs basic auth
   *                 Sets everything up for actions() to run
   * @param browser 
   */
  public async setup() {
    
    // TODO: load db

    // Login to Instagram
    await this.authenticate()
  }

  /**
   * @description   Load saved cookies, Check if authenticated, if Guest, then attempt to login with options information
   */
  private async authenticate() {
    // TODO: load cookies 1st

    if (this.options.auth) {
      await this.actions(
        ifThen(isGuest, login(this.options.auth))
      )
    }

    // TODO: save cookies
  }

  /**
   * @description   Run InstamationAction's in sequence - Declaratively
   *                Supports the higher-order functions in the actions/ directory
   *                They return async functions with the active puppeteer.page injected so the function can crawl/interact with the webpage
   * 
   *                This function makes it easy to chain promises together while injecting the activePage with a cleaner syntax
   *                So instead of
   *                  await bot.feed()
   *                  await bot.favoriteAllFrom(...)
   * 
   *                We remove multiple "awaits" and the need for "bot." for chaining actions
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
    return BotActionsChainFactory(this.activeTab)(...actions)
  }

  //
  // Clean up
  async destroy() {
    if (this.activeTab) {
      await this.activeTab.close()
    }
  }
}
