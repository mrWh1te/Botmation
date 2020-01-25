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
 * @deprecated
 * @description  Expirmental `BotActionFactory` If condition resolves to TRUE, then we'll run the action
 *               It provides the developer a way to run an async function for a boolean value to be tested against for TRUE. If that awaited value is true, then it will run the second paramter, the `BotAction`
 *               In case the `condition` async function requires the puppeteer active tab, to crawl/interact in determining TRUE||FALSE, it's injected there as well as the BotAction
 * @param condition async function that returns Promise<boolean>, if boolean TRUE, run the action
 * @param action BotAction
 */
export const ifThen = (condition: (tab: puppeteer.Page) => Promise<boolean>, action: BotAction): BotAction => async(tab: puppeteer.Page) => {
  if (await condition(tab)) {
    await action(tab)
  }
}

/**
 * @description givenThat(promise resolves to TRUE)(then run this action(...))
 *              A function that returns a function that returns a function
 *              BotFactoryProvider -> BotFactoryAction -> BotAction
 * 
 *              In essence, a BotAction to run a given BotAction (2nd usage call) on a promised condition (1st usage call)
 * @example     givenThat(isGuest)(login(...))
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