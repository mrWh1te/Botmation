/**
 * @description   This higher order functions can be shared across multiple bots, given the uility of their nature (not specific)
 */
import puppeteer from 'puppeteer'

import { getPageScreenshotLocalFileUrl } from '@helpers/assets'

import { sleep } from '@mationbot/helpers/utilities'
import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'
import { BotActionsChainFactory } from '@mationbot/factories/bot-actions-chain.factory'

/**
 * @description   Pauses the bot for the provided milliseconds before letting it execute the next Action
 * @param milliseconds 
 */
export const wait = (milliseconds: number): BotAction => async() => 
  await sleep(milliseconds)

/**
 * @description   Manually click an element on the page based on the query selector provided
 * @param selector 
 */
export const click = (selector: string): BotAction => async(tab: puppeteer.Page) =>
  await tab.click(selector)

/**
 * @description   Using the keyboard, being typing. It's best that you focus/click a form input element 1st, or something similar
 * @param copy 
 */
export const type = (copy: string): BotAction => async(tab: puppeteer.Page) =>
  await tab.keyboard.type(copy)

/**
 * @description   Take a PNG screenshot of the current page
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string): BotAction => async(tab: puppeteer.Page) => {
  await tab.screenshot({path: getPageScreenshotLocalFileUrl(`${fileName}.png`)})
}

/**
 * @description givenThat(promise resolves to TRUE)(then run these actions in a chain)
 *              A function that returns a function that returns a function
 *              BotFactoryProvider -> BotFactoryAction -> BotAction
 * 
 *              In essence, this is a BotAction to run a provided chain of BotActions (2nd usage call), given that a promised condition (1st usage call) resolves to TRUE
 * @example     givenThat(isGuest)(login(...), closeSomePostLoginModal(),... more BotAction's)
 *              The condition function is async and provided the Puppeteer page instance so you can use it to determine TRUE/FALSE
 * @param condition 
 */
export const givenThat = 
  (condition: (tab: puppeteer.Page) => Promise<boolean>) => 
    (...actions: BotAction[]): BotAction => 
      async(tab: puppeteer.Page) => {
        if (await condition(tab)) {
          await BotActionsChainFactory(tab)(...actions)
        }
      }

/**
 * @example    
 *  forEvery(['google.com', 'facebook.com'])(
 *    (siteName) => ([
 *      goTo('http://'+siteName),
 *      screenshot(siteName+'-homepage')
 *    ])
 *  )
)
 */
export interface Dictionary {
  [key: string]: any
}
export const forEvery =
  (collection: any[]) =>
    (iteratingFunction: (...args: any[]) => BotAction[]) =>
      async(tab: puppeteer.Page) => {
        for(let i = 0; i < collection.length; i++) {
          await BotActionsChainFactory(tab)(...iteratingFunction(collection[i]))
        }
      }