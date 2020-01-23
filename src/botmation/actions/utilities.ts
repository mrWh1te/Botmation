/**
 * @description   This higher order functions can be shared across multiple bots, given the uility of their nature (not specific)
 */
import puppeteer from 'puppeteer'

import { sleep } from '@botmation/helpers/utilities'

import { BotAction } from '@botmation/interfaces/bot-action.interfaces'

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
 * @description  Expirmental `BotActionFactory` If condition resolves to TRUE, then we'll run the action
 *               It provides the developer a way to run an async function for a boolean value to be tested against for TRUE. If that awaited value is true, then it will run the second paramter, the `InstamationAction`
 *               In case the `condition` async function requires the puppeteer active tab, to crawl/interact in determining TRUE||FALSE, it's injected there as well as the InstamationAction
 * @param condition async function that returns Promise<boolean>, if boolean TRUE, run the action
 * @param action BotAction
 */
export const ifThen = (condition: (tab: puppeteer.Page) => Promise<boolean>, action: BotAction): BotAction => async(tab: puppeteer.Page) => {
  if (await condition(tab)) {
    await action(tab)
  }
}
