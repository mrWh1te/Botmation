/**
 * @description   These higher higher order bot actions are meant to help devs build more complex bot action chains with more ease
 */
import { Page } from 'puppeteer'

import { sleep } from '../helpers/utilities'

import { applyBotActionOrActions } from '../helpers/actions'
import { BotAction, ConditionalBotAction } from '../interfaces/bot-action.interfaces'
import { BotActionsChainFactory } from '../factories/bot-actions-chain.factory'
import { BotOptions } from '../interfaces/bot-options.interfaces'

/**
 * @description givenThat(condition returns a promise that resolves to TRUE)(run these actions in a chain)
 *              A function that returns a function that returns a function
 *              BotFactoryProvider -> BotFactoryAction -> BotAction
 * 
 *              In essence, this is a BotAction to run a provided chain of BotActions (2nd usage call), given that a promised condition (1st usage call) resolves to TRUE
 * @example     givenThat(isGuest)(login(...), closeSomePostLoginModal(),... more BotAction's)
 *              The condition function is async and provided the Puppeteer page instance so you can use it to determine TRUE/FALSE
 * @param condition 
 */
export const givenThat = 
  (condition: ConditionalBotAction) => 
    (...actions: BotAction[]): BotAction => 
      async(page: Page, options, ...injects) => {
        try {
          if (await condition(page, options, ...injects)) {
            await BotActionsChainFactory(page, options, ...injects)(...actions)
          }
        } catch (error) {
          // logError(error)
        }
      }

/**
 * @description   A forEach method to loop a collection of something, to run a chain of actions against with that something locally scoped
 * 
 *                Special BotAction that can take an array of stuff or an object of key value pairs (dictionary)
 *                to iterate over while applying the closure (function) as provided
 *                The closure's purpose is simply to return a BotAction or BotAction[], but you can run code beforehand, but it's discouraged
 * 
 *                The original use-case for this concept, was to be able to re-apply a script on multiple websites via a loop
 *                I've seen multiple examples online, of people using Puppeteer to write a script of actions then loop through a list of websites
 *                  to apply those actions on
 *
 * @example    with an array for collection
 *  forAll(['google.com', 'facebook.com'])(
 *    (siteName) => ([ // you can name the variable whatever you want in the closure
 *      goTo('http://' + siteName),
 *      screenshot(siteName + '-homepage')
 *    ])
 *  )
 * 
 * @example    with a dictionary for collection, a good use-case of this is a form with keys being form input selectors and values being what its typed in each
 *  forAll({id: 'google.com', someOtherKey: 'apple.com'})(
 *    (key, siteName) => ([
 *      goTo('http://' + siteName)
 *      screenshot(key + siteName + '-homepage')
 *    ])
 *  )
 * 
 * @example   a 1 action script example
 *  forAll(['google.com'])(
 *    (siteName) => goTo('http://' + siteName)
 *  )
 */
export interface Dictionary {
  [key: string]: any // (key -> value) pairs
}
export const forAll =
  (collection: any[] | Dictionary) =>
    (botActionOrActionsFactory: (...args: any[]) => BotAction[] | BotAction): BotAction =>
      async(page: Page, options: BotOptions, ...injects: any[]) => {
        if (Array.isArray(collection)) {
          // Array
          for(let i = 0; i < collection.length; i++) {
            await applyBotActionOrActions(page, options, botActionOrActionsFactory(collection[i]), ...injects)
          }
        } else {
          // Dictionary
          for (const [key, value] of Object.entries(collection)) {
            await applyBotActionOrActions(page, options, botActionOrActionsFactory(key, value), ...injects)
          }
        }
      }

/**
 * @description    Similar to givenThat, except it will keep running the sequence of actions until the condition is no longer TRUE
 * @experimental
 * @param condition 
 * @note           This is under development! Not considered ready, yet
 */
export const doWhile = 
  (condition: ConditionalBotAction) => 
    (...actions: BotAction[]): BotAction => 
      async(page: Page, options, ...injects) => {
        try {
          let resolvedCondition = await condition(page, options, ...injects)
          while (resolvedCondition) {
            await BotActionsChainFactory(page, options, ...injects)(...actions)
            resolvedCondition = await condition(page, options, ...injects)
          }
        } catch (error) {
          // logError(error)
        }
      }

/**
 * @description   Pauses the bot for the provided milliseconds before letting it execute the next Action
 * @param milliseconds 
 */
export const wait = (milliseconds: number): BotAction => async() => 
  await sleep(milliseconds)