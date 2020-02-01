/**
 * @description    Main source code wrapper to encapsulate main methods for configuring the bot (cookies, page, etc)
 *                 This bot uses a Puppeteer.Page, `activeTab`, to inject into factory produced `BotAction` methods
 */

import { Page, Browser } from 'puppeteer'

import { BotOptions } from './interfaces/bot-options.interfaces'
import { BotAction } from './interfaces/bot-action.interfaces'
import { BotActionsChainFactory } from './factories/bot-actions-chain.factory'
import { MationBotInterface } from './interfaces/mation-bot.interface'

/**
 * @name          MationBot
 * @description   Declarative bot for operating a Puppeteer browser page (tab)
 */
export class MationBot implements MationBotInterface {
  /**
   * @description   Page/Tab of the brower the bot is crawling
   */
  private page: Page

  // MationBot specific
  private options: BotOptions

  /**
   * @param options optional partial to overload default option values (parsed from the config.ts file)
   */
  constructor(page: Page, options: Partial<BotOptions> = {}) {
    this.page = page
    this.options = {
      // Default Config TBI (db credentials, etc, what have you, not yet at the project when this is needed)

      // Currently, options are not injected into `BotAction`s, but can be, come time! Simple tweak to add
      // Overload config with provided options (optional)
      ...options
    }
  }
  /**
   * @description    Runs the actual constructor then runs async setup code before returning the `MationBot` instance
   * @param  options   optional to override default options
   */
  public static async asyncConstructor(browser: Browser, options?: Partial<BotOptions>) {
    // Grab the first open page (tab) from the browser, otherwise make a new one
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0] // does this need an await at the start of the expression? That edge case has to be tested, since on browser launch, there is a page open

    // Provide the browser, tab it will be operating in, and any optional overloading options
    const bot = new MationBot(page, options)
    await bot.setup()
    return bot
  }

  /**
   * @description    Loads cookies, data from db
   *                 Sets everything up for actions() to run
   * @param browser 
   */
  public async setup() {
    
    // TODO: load db

    // TODO: load cookies

    // TODO: save cookies, post login

    // Future: provide data in the chain, it would be options but more -> data: { auth: authData, feed: feedDb, etc}, options/config: {db: dbOptions, etc} (so data and somekind of base options for configuration of various dependencies)
    // so in the future we can run these actions against db data, not programmed data
    //   To implement: follow the flow of injecting the "page" (puppeteer.Page) from scope of the factory call, likewise, we'll inject options, but maybe have renamed to simply data or store
  }

  /**
   * @description   Run BotAction's in sequence - Declaratively
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
    return BotActionsChainFactory(this.page)(...actions)
  }

  //
  // Clean up
  /**
   * @description   Close the Page/Tab from the browser that the bot was crawling
   */
  async closePage() {
    if (this.page) {
      await this.page.close()
      console.log('') // add an empty line too console for separation upon next
    }
  }
}
