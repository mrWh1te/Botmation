/**
 * @description   The higher order Action's bring a new level of dynamic behavior to Action's functionally
 *                These functions are intended to be utilities for the dev's to help achieve more complex functionality,
 *                  in a composable functional fashion
 */

import { Action } from '../interfaces/actions'
import { pipe } from './assembly-lines'
import { PipeValue } from '../types/pipe-value'
import { AbortLineSignal, isAbortLineSignal } from '../types/abort-line-signal'
import { processAbortLineSignal } from '../helpers/abort'
import { Injects } from '../types'

/**
 * @description Higher Order Action that accepts a Action (pipeable, that returns a boolean) and based on what boolean it resolves,
 *              does it run the Action's provided in a pipe()(). Never the less, it does not return the final ran Action return value (if any)
 * @example     givenThat(isGuest)(login(...), closeSomePostLoginModal(),... more Action's)
 *              The condition function is async and provided the Puppeteer page instance so you can use it to determine TRUE/FALSE
 * @param condition
 */
export const givenThat =
  <I extends Injects = {}>(condition: Action<I, boolean>) =>
    (...actions: Action[]): Action =>
      async(injects: I) => {
        const resolvedConditionValue: AbortLineSignal|boolean = await condition(injects)

        if (isAbortLineSignal(resolvedConditionValue)) {
          return processAbortLineSignal(resolvedConditionValue)
        }

        if (resolvedConditionValue) {
          const returnValue: PipeValue|AbortLineSignal|void = await pipe()(...actions)(injects)

          // For consistency, the AbortLineSignal could be processed here, but there is little to gain
          // from requiring 2 assembledLines to break out of a conditional "if then" block.
          // Once the then block has been aborted, there is nothing left to run
          if (isAbortLineSignal(returnValue)) {
            return returnValue
          }
        }
      }

