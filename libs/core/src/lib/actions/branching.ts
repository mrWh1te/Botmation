/**
 * @description   The higher order BotAction's bring a new level of dynamic behavior to BotAction's functionally
 *                These functions are intended to be utilities for the dev's to help achieve more complex functionality,
 *                  in a composable functional fashion
 */

import { ConditionalBotAction, BotAction } from '../interfaces/bot-actions'
import { pipeInjects } from '../helpers/pipe'
import { assemblyLine, pipe } from './assembly-lines'
import { PipeValue } from '../types/pipe-value'
import { AbortLineSignal, isAbortLineSignal } from '../types/abort-line-signal'
import { processAbortLineSignal } from '../helpers/abort'
import { rollDice } from '../helpers/branching'

/**
 * @description Higher Order BotAction that accepts a ConditionalBotAction (pipeable, that returns a boolean) and based on what boolean it resolves,
 *              does it run the BotAction's provided in a pipe()(). Never the less, it does not return the final ran BotAction return value (if any)
 * @example     givenThat(isGuest)(login(...), closeSomePostLoginModal(),... more BotAction's)
 *              The condition function is async and provided the Puppeteer page instance so you can use it to determine TRUE/FALSE
 * @param condition
 */
export const givenThat =
  (condition: ConditionalBotAction) =>
    (...actions: BotAction<PipeValue|void|AbortLineSignal>[]): BotAction<any> =>
      async(page, ...injects) => {
        const resolvedConditionValue: AbortLineSignal|boolean = await condition(page, ...pipeInjects(injects))

        if (isAbortLineSignal(resolvedConditionValue)) {
          return processAbortLineSignal(resolvedConditionValue)
        }

        if (resolvedConditionValue) {
          const returnValue: PipeValue|AbortLineSignal = await pipe()(...actions)(page, ...injects)

          // For consistency, the AbortLineSignal could be processed here, but there is little to gain
          // from requiring 2 assembledLines to break out of a conditional "if then" block.
          // Once the then block has been aborted, there is nothing left to run
          if (isAbortLineSignal(returnValue)) {
            return returnValue
          }
        }
      }

/**
 * @future once sync BotActions are supported, update this with givenThat(diceRoll(val))(...actions)
 * @param numberOfDiceSides
 * @param numberToRoll
 */
export const runOnDiceRoll =
  (numberOfDiceSides = 1, numberToRoll = 1) =>
    (...actions: BotAction[]): BotAction =>
      async(page, ...injects) => {
        const diceRoll = rollDice(numberOfDiceSides)

        if (diceRoll === numberToRoll) {
          return assemblyLine()(...actions)(page, ...injects)
        }
      }
