import { BotAction } from "../interfaces"
import { PipeValue } from "../types/pipe-value"
import { getInjectsPipeValue, injectsHavePipe } from "../helpers/pipe"
import { MatchesSignal } from "../types/matches-signal"
import { AbortLineSignal, Dictionary, isAbortLineSignal } from "../types"
import { pipe } from "./assembly-lines"
import { createMatchesSignal } from "../helpers/matches"

//
// BotAction's Focused on Piping
//   They are not intended for use in a chain()()
//

/**
 * @description    Mapper function for Mapping Piped Values to whatever you want through a function
 *                 If the Pipe is missing from the `injects`, undefined will be past into the mapFunction, like an empty Pipe
 * @param mapFunction pure function to change the piped value to something else
 */
export const map = <R extends PipeValue = PipeValue>(mapFunction: (pipedValue: any) => R): BotAction<R> => 
  async (page, ...injects) => 
    mapFunction(getInjectsPipeValue(injects))
    

/**
 * @description   Sets the Pipe's value for the next BotAction
 * @param valueToPipe 
 */
export const pipeValue = <R extends PipeValue = PipeValue>(valueToPipe: R|undefined): BotAction<R|undefined> => async () => valueToPipe

/**
 * @description   Empty the Pipe, which sets the Pipe's value to undefined
 */
export const emptyPipe: BotAction = async () => undefined

/**
 * Similar to givenThat except instead of evaluating a BotAction for TRUE, its testing an array of values against the pipe object value for truthy.
 * A value can be a function. In this case, the function is treated as a callback, expected to return a truthy expression, is passed in the pipe object's value
 * @param valuesToTest 
 * @return AbortLineSignal|MatchesSignal
 *  If no matches are found or matches are found, a MatchesSignal is returned
 *  It is determined if signal has matches by using hasAtLeastOneMatch() helper
 *  If assembled BotAction aborts(1), it still returns a MatchesSignal with the matches
 *  If assembled BotAction aborts(2+), it returns a processed AbortLineSignal
 */
export const pipeCase = 
  (...valuesToTest: PipeValue[]) =>
    (...actions: BotAction<PipeValue|AbortLineSignal|void>[]): BotAction<AbortLineSignal|MatchesSignal> => 
      async(page, ...injects) => {
        // if any of the values matches the injected pipe object value
        // then run the assembled actions
        if (injectsHavePipe(injects)) {
          const pipeObjectValue = getInjectsPipeValue(injects)
          
          const matches: Dictionary = valuesToTest.reduce((foundMatches, value, index) => {
            if (typeof value === 'function') {
              if (value(pipeObjectValue)) {
                (foundMatches as Dictionary)[index] = value
              } 
            } else {
              if (value === pipeObjectValue) {
                (foundMatches as Dictionary)[index] = value
              }
            }

            return foundMatches
          }, {}) as Dictionary

          if (Object.keys(matches).length > 0) {
            const returnValue:PipeValue|AbortLineSignal = await pipe()(...actions)(page, ...injects)

            if (isAbortLineSignal(returnValue)) {
              return returnValue // processed by pipe()
            } else {
              // signal that a case matched
              return createMatchesSignal(matches, returnValue)
            }
          }
        }
        
        // no pipe (nothing to test) or the test resulted in no matches
        return createMatchesSignal() // empty matches signal (no matches)
      }

/**
 * runs assembled actions ONLY if ALL cases pass otherwise it breaks the case checking and immediately returns an empty MatchesSignal
 * it's like if (case && case && case ...)
 * @param valuesToTest 
 */
export const pipeCases = 
  (...valuesToTest: PipeValue[]) =>
    (...actions: BotAction<PipeValue|AbortLineSignal|void>[]): BotAction<AbortLineSignal|MatchesSignal> => 
      async(page, ...injects) => {
        // if any of the values matches the injected pipe object value
        // then run the assembled actions
        if (injectsHavePipe(injects)) {
          const pipeObjectValue = getInjectsPipeValue(injects)
          
          const matches: Dictionary = {}
          for (const [i, value] of valuesToTest.entries()) {
            if (typeof value === 'function') {
              if (value(pipeObjectValue)) {
                matches[i] = value
              } else {
                break
              }
            } else {
              if (value === pipeObjectValue) {
                matches[i] = value
              } else {
                break
              }
            }
          }

          // only run assembled BotAction's if ALL cases pass
          if (Object.keys(matches).length === valuesToTest.length) {
            const returnValue:PipeValue|AbortLineSignal = await pipe()(...actions)(page, ...injects)

            if (isAbortLineSignal(returnValue)) {
              return returnValue // processed by pipe()
            } else {
              // signal that All cases matched
              return createMatchesSignal(matches, returnValue)
            }
          }
        }
        
        return createMatchesSignal() // empty matches signal (not ALL matched or none)
      }