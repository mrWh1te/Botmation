import * as Puppeteer from 'puppeteer'

import { BotAction } from './interfaces/bot-actions'
import { chain } from './actions/assembly-lines'
import { BotmationInterface } from './interfaces/botmation'
import { errors } from './actions/errors'

/**
 * @name          Botmation
 * @description   Example OOP class to encapsulate an Assembly-Line (chain), with any injects, a dev may choose to use
 */
export class Botmation implements BotmationInterface {
  /**
   * @description   Browser's Page the Botmation instance will crawl
   */
  private page: Puppeteer.Page

  /**
   * @description   Injectables for the Assembly-Line
   */
  private injects: any[]

  /**
   * @param page 
   * @param injects 
   */
  constructor(page: Puppeteer.Page, ...injects: any[]) {
    this.page = page
    this.injects = injects
  }
  
  /**
   * @description    static async constructor method to automatically get a page from the browser (if it has one), otherwise a new one, to run the Assembly-Line of BotAction's in
   * @param browser 
   * @param injects 
   */
  public static async asyncConstructor(browser: Puppeteer.Browser, ...injects: any[]): Promise<Botmation> {
    // Grab the first open page from the browser, otherwise make a new one
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    // Then return a normal instance
    return new Botmation(page, ...injects)
  }

  /**
   * @description   Run BotAction's in a error-safe Assembly-Line Chain
   *                Errors unhandled within the chain are at least caught outside with Error Block Name `Botmation Class`
   * @example         
   *                  await bot.actions(
   *                    goTo('http://google.com'),
   *                    screenshot('google-home-page')
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
  setPage(page: Puppeteer.Page) {
    this.page = page
  }

  /**
   * @param page {Puppeteer.Page}
   */
  getPage(): Puppeteer.Page {
    return this.page
  }

  /**
   * @description    Public method to set the Injects. Does not work while actions() is resolving.
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
