/**
 * @description   The higher order Action's bring a new level of dynamic behavior to Action's functionally
 *                These functions are intended to be utilities for the dev's to help achieve more complex functionality,
 *                  in a composable functional fashion
 */

import { Action } from '../interfaces/actions'
import { pipeInjects, getInjectsPipeValue, removePipe, wrapValueInPipe } from '../helpers/pipe'
import { pipeActionOrActions, pipe } from './assembly-lines'
import { logWarning } from '../helpers/console'
import { Collection, isCollection, isDictionary } from '../types/objects'
import { PipeValue } from '../types/pipe-value'
import { AbortLineSignal, isAbortLineSignal } from '../types/abort-line-signal'
import { processAbortLineSignal } from '../helpers/abort'
import { injects, injectsValue } from '../types'

/**
 * @future support piping in the `collection`
 * @description   A forEach method to loop a collection (array or object's key/value pairs) with assembled Actions in a pipe
 *
 *                Special Action that can take an array of stuff or an object of key value pairs (dictionary)
 *                to iterate over while applying the closure (ActionOrActionsFactory) as provided
 *                The closure's purpose is simply to return a Action or Action[]
 *
 *                The collection can be passed in via higher-order param or as Pipe value. If both are provided, higher-order param is used.
 *
 *                The callback's returned Action(s) are called with the three params matching the forEach() callback syntax
 *                  value, index, array
 *
 *                Since this function supports Dictionaries too, the "index" is casted into a string
 *                  value, key, collection
 *
 *                When the returned Action(s) are ran in a Pipe, the same callback params are wrapped in an array then injected as the Pipe object's value
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
 *      screenshot(siteName + '-homepage') // then re-use it in your Action setup
 *    ])
 *  )
 *
 * @example    with a dictionary as the collection, we can iterate key/value pairs in our Action's setup ie fill a form with keys being form input selectors and values being what its typed in each
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
// todo tbd initial inject value, if not collection, passed in too? ie injects.value = [value, key, collection, pipeValue] # for first Action
export const forAll =
  (collection?: Collection) =>
    // cb params = iterated value, iterated index/key (casted as string), collection
    (actionOrActionsFactory: (...args: [any, string, Collection]) => Action[] | Action): Action<Partial<injectsValue>> =>
      async({...injects}) => {
        // the collection can be passed in via higher-order params or Pipe object value
        // higher-order params trump Pipe object value
        if (!collection && isCollection(injects.value)) {
          collection = injects.value
        }

        if (!collection) {
          logWarning('Loops forAll(): no collection found')
          return
        }

        let returnValue: AbortLineSignal|PipeValue

        if (Array.isArray(collection)) {
          for(let index = 0; index < collection.length; index++) {
            // Update Pipe value for each iteration
            injects.value = [collection[index], index+'', collection] // for now, all collection keys are cast to "string" for a single type

            // Run cb
            returnValue = await pipeActionOrActions(actionOrActionsFactory(collection[index], index+'', collection))(injects)

            if (isAbortLineSignal(returnValue)) {
              return processAbortLineSignal(returnValue)
            }
          }
        } else {
          // in case Pipe object value is not a dictionary
          /* istanbul ignore next */ // line is covered... false positive?
          if (isDictionary(collection)) {
            for (const [key, value] of Object.entries(collection)) {
              // Update Pipe value for each iteration
              injects.value = [value, key, collection] // todo tbd order: value, key, collection?

              // Run cb
              returnValue = await pipeActionOrActions(actionOrActionsFactory(value, key, collection))(injects)

              if (isAbortLineSignal(returnValue)) {
                return processAbortLineSignal(returnValue)
              }
            }
          }
        }

        return returnValue
      }

/**
 * @description    Works like a traditional doWhile. The loop begins with running the actions in a pipe, then before each subsequent iteration of the loop, the Action is resolved and tested for TRUE before continuing
 *                 Do the actions, and continue to keep doing them While this condition continue to resolves TRUE
 * @param condition
 */
export const doWhile =
  (condition: Action<injects,boolean>) =>
    (...actions: Action[]): Action =>
      async({...injects}) => {
        let returnValue: PipeValue|AbortLineSignal|void
        let resolvedCondition: boolean|AbortLineSignal = true
        while (resolvedCondition) {
          returnValue = await pipe()(...actions)(injects)

          if (isAbortLineSignal(returnValue)) {
            return processAbortLineSignal(returnValue)
          }

          resolvedCondition = false // in case condition rejects, safer
          resolvedCondition = await condition(injects) // use same Pipe from before, but simulate as pipe in case not

          if (isAbortLineSignal(resolvedCondition)) {
            return processAbortLineSignal(resolvedCondition)
          }
        }
      }

/**
 * @description    Works like a traditional while loop. Before each loop iteration, it resolves the Action then only runs the provided Action's (in a pipe) if that `condition` resolved TRUE
 *                 It continues to loop as long as the `condition` resolves TRUE each time. It only runs the Action's after the Action resolves TRUE
 * @param condition
 * @example     forAsLong(isLoggedIn)(
 *                goTo(...),
 *                click(...),
 *                //...
 *              )
 */
export const forAsLong =
  (condition: Action<injects, boolean>) =>
    (...actions: Action[]): Action =>
      async(injects) => {
        let returnValue: PipeValue|AbortLineSignal
        let resolvedCondition = await condition(injects)

        // 1 line of assembly for the condition
        if (isAbortLineSignal(resolvedCondition)) {
          return processAbortLineSignal(resolvedCondition)
        }

        while (resolvedCondition) {
          // these are sub-lines, to abort out of forAsLong() from a Action assembled here
          // it requires either AbortLineSignal assembledLines > 1 or === 0
          // else assembledLines = 1 will break the assembled line, but not the loop (granular control)
          returnValue = await pipe()(...actions)(injects)

          // 2 levels of assembly here, so it's possible the AbortLineSignal aborted the pipe above
          // and will then abort this Action (the loop) too (and possibly further.. going up)
          if (isAbortLineSignal(returnValue)) {
            return processAbortLineSignal(returnValue)
          }

          // simulate pipe if needed
          resolvedCondition = false // in case condition rejects
          resolvedCondition = await condition(injects) // use same Pipe as before, unless no Pipe, than add an empty one

          // 1 line of assembly for condition
          if (isAbortLineSignal(resolvedCondition)) {
            return processAbortLineSignal(resolvedCondition)
          }
        }
      }


