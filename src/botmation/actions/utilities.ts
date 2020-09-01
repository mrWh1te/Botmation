/**
 * @description   The higher order BotAction's bring a new level of dynamic behavior to BotAction's functionally
 *                These functions are intended to be utilities for the dev's to help achieve more complex functionality,
 *                  in a composable functional fashion
 */

import { ConditionalBotAction, BotAction } from '../interfaces/bot-actions'
import { pipeInjects, getInjectsPipeValue, removePipe, wrapValueInPipe } from '../helpers/pipe'
import { pipeActionOrActions, pipe } from './assembly-lines'
import { logWarning } from '../helpers/console'
import { Collection, isDictionary } from '../types/objects'
import { PipeValue } from '../types/pipe-value'
import { AbortLineSignal, isAbortLineSignal } from '../types/abort-signal'
import { createAbortLineSignal } from 'botmation/helpers/abort'

/**
 * @description Higher Order BotAction that accepts a ConditionalBotAction (pipeable, that returns a boolean) and based on what boolean it resolves,
 *              does it run the BotAction's provided in a pipe()(). Never the less, it does not return the final ran BotAction return value (if any)
 * @example     givenThat(isGuest)(login(...), closeSomePostLoginModal(),... more BotAction's)
 *              The condition function is async and provided the Puppeteer page instance so you can use it to determine TRUE/FALSE
 * @param condition 
 */
export const givenThat = 
  (condition: ConditionalBotAction) => 
    (...actions: BotAction<PipeValue|void|AbortLineSignal>[]): BotAction<void|AbortLineSignal> => 
      async(page, ...injects) => {
        const resolvedConditionValue: AbortLineSignal|boolean = await condition(page, ...pipeInjects(injects))

        if (isAbortLineSignal(resolvedConditionValue)) {
          if (resolvedConditionValue.assembledLines === 1) {
            return resolvedConditionValue.pipeValue as AbortLineSignal // to be picked up by pipe-able functions
          } else if (resolvedConditionValue.assembledLines === 0) {
            return resolvedConditionValue
          } else {
            return createAbortLineSignal(resolvedConditionValue.assembledLines - 1, resolvedConditionValue.pipeValue)
          }
        }

        if (resolvedConditionValue) {
          const returnValue: PipeValue|AbortLineSignal = await pipe()(...actions)(page, ...injects)

          if (isAbortLineSignal(returnValue)) {
            return returnValue
          }
        }
      }

/**
 * @future support piping in the `collection`
 * @description   A forEach method to loop a collection (array or object's key/value pairs) with assembled BotActions in a pipe
 * 
 *                Special BotAction that can take an array of stuff or an object of key value pairs (dictionary)
 *                to iterate over while applying the closure (botActionOrActionsFactory) as provided
 *                The closure's purpose is simply to return a BotAction or BotAction[]
 * 
 *                The collection can be passed in via higher-order param or as Pipe value. If both are provided, higher-order param is used.
 * 
 *                The callback's returned BotAction(s) are called with the three params matching the forEach() callback syntax
 *                  value, index, array
 * 
 *                Since this function supports Dictionaries too, the "index" is casted into a string
 *                  value, key, collection
 * 
 *                When the returned BotAction(s) are ran in a Pipe, the same callback params are wrapped in an array then injected as the Pipe object's value
 *                  [value, key, collection]
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
 *    (siteName, key) => ([
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
export const forAll =
  (collection?: Collection) =>
    // cb params = iterated value, iterated index/key (casted as string), collection
    (botActionOrActionsFactory: (...args: [any, string, Collection]) => BotAction<any>[] | BotAction<any>): BotAction<AbortLineSignal|void> =>
      async(page, ...injects) => {
        // the collection can be passed in via higher-order params or Pipe object value
        // higher-order params trump Pipe object value        
        if (!collection) {
          collection = getInjectsPipeValue(injects)
        }

        if (!collection) {
          logWarning('Utilities forAll() missing collection')
          return
        }

        let returnValue: AbortLineSignal|PipeValue

        if (Array.isArray(collection)) {
          for(let index = 0; index < collection.length; index++) {
            // Update Pipe value for each iteration
            injects = removePipe(injects)
            injects.push(wrapValueInPipe([collection[index], index+'', collection])) // for now, all collection keys are cast to "string" for a single type

            // Run cb
            returnValue = await pipeActionOrActions(botActionOrActionsFactory(collection[index], index+'', collection))(page, ...injects)
          }
        } else {
          // in case Pipe object value is not a dictionary
          /* istanbul ignore next */ // line is covered... false positive?
          if (isDictionary(collection)) {
            for (const [key, value] of Object.entries(collection)) {
              // Update Pipe value for each iteration
              injects = removePipe(injects)
              injects.push(wrapValueInPipe([value, collection, key]))
  
              // Run cb
              returnValue = await pipeActionOrActions(botActionOrActionsFactory(value, key, collection))(page, ...injects)
            }
          }
        }

        if (isAbortLineSignal(returnValue)) {
          return returnValue
        }
      }

/**
 * @description    Works like a traditional doWhile. The loop begins with running the actions in a pipe, then before each subsequent iteration of the loop, the ConditionalBotAction is resolved and tested for TRUE before continuing
 *                 Do the actions, and continue to keep doing them While this condition continue to resolves TRUE
 * @param condition
 */
export const doWhile = 
  (condition: ConditionalBotAction) => 
    (...actions: BotAction<any>[]): BotAction<void|AbortLineSignal> => 
      async(page, ...injects) => {
        let returnValue: PipeValue|AbortLineSignal
        let resolvedCondition = true // doWhile -> run the code, then check the condition on whether or not we should run the code again
        while (resolvedCondition) {
          returnValue = await pipe()(...actions)(page, ...injects)

          if (isAbortLineSignal(returnValue)) {
            return returnValue
          }

          resolvedCondition = false // in case condition rejects, safer
          resolvedCondition = await condition(page, ...pipeInjects(injects)) // use same Pipe from before, but simulate as pipe in case not
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
    (...actions: BotAction[]): BotAction<any> => 
      async(page, ...injects) => {
        let returnValue: PipeValue|AbortLineSignal
        let resolvedCondition = await condition(page, ...pipeInjects(injects))

        while (resolvedCondition) {
          returnValue = await pipe()(...actions)(page, ...pipeInjects(injects))

          // AbortLineSignal processed by Pipe, so just return AbortLineSignal
          if (isAbortLineSignal(returnValue)) {
            return returnValue
          }

          // simulate pipe if needed
          resolvedCondition = false // in case condition rejects
          resolvedCondition = await condition(page, ...pipeInjects(injects)) // use same Pipe as before, unless no Pipe, than add an empty one
        }
      }