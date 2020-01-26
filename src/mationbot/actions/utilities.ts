/**
 * @description   This higher order functions can be shared across multiple bots, given the uility of their nature (not specific)
 */
import puppeteer from 'puppeteer'

import { getPageScreenshotLocalFileUrl } from '@helpers/assets'

import { sleep, applyBotActionOrActions } from '@mationbot/helpers/utilities'
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
 * @description   Special BotAction that can take an array of stuff or an object of key value pairs
 *                to iterate over while applying the closure (function) provided
 *                The closure's purpose is simply to return a BotAction or BotAction[], but you can run code beforehand!
 * 
 *                The original use-case for this concept, was to be able to re-apply a script on multiple websites via a loop
 *                I've seen multiple examples online, of people using Puppeteer to write a script of actions
 *                  then loop through a list of websites to apply those actions on
 *                This permits that
 * @example    with an array for collection
 *  forEvery(['google.com', 'facebook.com'])(
 *    (siteName) => ([ // you can name the variable whatever you want in the closure
 *      goTo('http://' + siteName),
 *      screenshot(siteName + '-homepage')
 *    ])
 *  )
 * 
 * @example    with a dictionary for collection
 *  forEvery({id: 'google.com', someOtherKey: 'apple.com'})(
 *    (key, siteName) => ([
 *      goTo('http://' + siteName)
 *      screenshot(key + siteName + '-homepage')
 *    ])
 *  )
 * 
 * @example   a 1 action script example
 *  forEvery(['google.com'])(
 *    (siteName) => goTo('http://' + siteName) // or a custom BotAction!
 *  )
 */
export interface Dictionary {
  [key: string]: any // (key -> value) pairs
}
export const forEvery =
  (collection: any[] | Dictionary) =>
    (botActionOrActionsFactory: (...args: any[]) => BotAction[] | BotAction) =>
      async(tab: puppeteer.Page) => {
        if (Array.isArray(collection)) {
          // Array
          for(let i = 0; i < collection.length; i++) {
            await applyBotActionOrActions(tab, botActionOrActionsFactory(collection[i]))
          }
        } else {
          // Dictionary
          for (const [key, value] of Object.entries(collection)) {
            await applyBotActionOrActions(tab, botActionOrActionsFactory(key, value))
          }
        }
      }
