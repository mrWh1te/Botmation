/**
 * @description   The higher order BotAction's bring a new level of dynamic behavior to BotAction's functionally
 *                These functions are intended to be utilities for the dev's to help achieve more complex functionality,
 *                  in a composable functional fashion
 */
import { sleep } from '../helpers/utilities'

import { ConditionalBotAction, BotAction } from '../interfaces/bot-actions'
import { injectsHavePipe, wrapValueInPipe, pipeInjects } from 'botmation/helpers/pipe'
import { pipeActionOrActions, pipe } from './assembly-lines'

/**
 * @description Higher Order BotAction that accepts a ConditionalBotAction (pipeable, that returns a boolean) and based on what boolean it resolves,
 *              does it run the BotAction's provided in a pipe()(). Never the less, it does not return the final ran BotAction return value (if any)
 * @example     givenThat(isGuest)(login(...), closeSomePostLoginModal(),... more BotAction's)
 *              The condition function is async and provided the Puppeteer page instance so you can use it to determine TRUE/FALSE
 * @param condition 
 */
export const givenThat = 
  (condition: ConditionalBotAction) => 
    (...actions: BotAction<any>[]): BotAction => 
      async(page, ...injects) => {
        if (await condition(page, ...pipeInjects(injects))) {
          await pipe()(...actions)(page, ...injects)
        }
      }

/**
 * @future support piping in the `collection`
 * @description   A forEach method to loop a collection of (array or object with key/value pairs), to run a loop of piped actions with each iteration of the collection
 * 
 *                Special BotAction that can take an array of stuff or an object of key value pairs (dictionary)
 *                to iterate over while applying the closure (botActionOrActionsFactory) as provided
 *                The closure's purpose is simply to return a BotAction or BotAction[]
 * 
 *                The original use-case for this concept, was to be able to re-apply a script on multiple websites via a loop
 *                I've seen multiple examples online, of people using Puppeteer to write a script of actions then loop through a list of websites
 *                  to apply the same sequence of actions on each
 *
 * @example    with an array as the collection
 *  forAll(['google.com', 'facebook.com'])(
 *    (siteName) => ([ // you can name the variable whatever you want in the closure
 *      goTo('http://' + siteName),
 *      screenshot(siteName + '-homepage') // then re-use it in your BotAction setup
 *    ])
 *  )
 * 
 * @example    with a dictionary as the collection, we can iterate key/value pairs in our BotAction's setup ie fill a form with keys being form input selectors and values being what its typed in each
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
  [key: string]: any // key/value pairs
}
export const forAll =
  (collection: any[] | Dictionary) =>
    (botActionOrActionsFactory: (...args: any[]) => BotAction<any>[] | BotAction<any>): BotAction =>
      async(page, ...injects) => {
        if (Array.isArray(collection)) {
          // Array
          for(let i = 0; i < collection.length; i++) {
            await pipeActionOrActions(botActionOrActionsFactory(collection[i]))(page, ...injects)
          }
        } else {
          // Dictionary
          for (const [key, value] of Object.entries(collection)) {
            await pipeActionOrActions(botActionOrActionsFactory(key, value))(page, ...injects)
          }
        }
      }

/**
 * @description    Works like a traditional doWhile. The loop begins with running the actions in a pipe, then before each subsequent iteration of the loop, the ConditionalBotAction is resolved and tested for TRUE before continuing
 *                 Do the actions, and continue to keep doing them While this condition continue to resolves TRUE
 * @param condition
 */
export const doWhile = 
  (condition: ConditionalBotAction) => 
    (...actions: BotAction<any>[]): BotAction => 
      async(page, ...injects) => {
        let resolvedCondition = true // doWhile -> run the code, then check the condition on whether or not we should run the code again
        while (resolvedCondition) {
          const pipeValue = await pipe()(...actions)(page, ...injects)

          resolvedCondition = false // in case condition rejects
          if (injectsHavePipe(injects)) {
            resolvedCondition = await condition(page, ...injects.splice(0, injects.length - 1), wrapValueInPipe(pipeValue))
          } else {
            resolvedCondition = await condition(page, ...injects, wrapValueInPipe(pipeValue))
          }
        }
      }

/**
 * @description    Works like a traditional while loop. Before each loop iteration, it resolves the ConditionalBotAction then only runs the provided BotAction's (in a pipe) if that `condition` resolved TRUE
 *                 It continues to loop as long as the `condition` resolves TRUE each time. It only runs the BotAction's after the ConditionalBotAction resolves TRUE
 * @param condition 
 * @example     forAsLong(isLoggedIn)(
 *                goTo(...),
 *                click(...),
 *                //...
 *              )
 */
export const forAsLong = 
  (condition: ConditionalBotAction) => 
    (...actions: BotAction[]): BotAction => 
      async(page, ...injects) => {
        let resolvedCondition = await condition(page, ...pipeInjects(injects))

        while (resolvedCondition) {
          const pipeValue = await pipe()(...actions)(page, ...pipeInjects(injects))

          // simulate pipe if needed
          if (injectsHavePipe(injects)) {
            resolvedCondition = await condition(page, ...injects.splice(0, injects.length - 1), wrapValueInPipe(pipeValue))
          } else {
            resolvedCondition = await condition(page, ...injects, wrapValueInPipe(pipeValue))
          }
        }
      }

/**
 * @description   Pauses the runner (chain or pipe) for the provided milliseconds before continuing to the next BotAction
 * @param milliseconds 
 */
export const wait = (milliseconds: number): BotAction => async() => {
  await sleep(milliseconds)
} 
