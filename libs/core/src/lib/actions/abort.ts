import { BotAction, Pipe } from "../interfaces"
import { AbortLineSignal, isAbortLineSignal } from '../types'
import { PipeValue } from "../types/pipe-value"
import { createAbortLineSignal, processAbortLineSignal } from "../helpers/abort"
import { pipeCase } from "./pipe"
import { CasesSignal, CaseValue } from "../types/cases"
import { pipe } from "./assembly-lines"
import { createEmptyPipe, getInjectsPipeOrEmptyPipe, injectsHavePipe, wrapValueInPipe } from "../helpers/pipe"

/**
 * BotAction to return an AbortLineSignal to be processed by an assembler for an effect of aborting assembled lines (including parent(s) if specified a number greater than 1 or 0 for all)
 * @param assembledLines number of lines (from current to parent, to grandparent, to grandgrandparent, ...) to break from continuing further
 *                       0 means all, a way to kill a bot
 * @param pipeValue works only in a Pipe assembler, optional, but if a Pipe assembler is aborted, it can return the pipeValue provided in the AbortLineSignal
                         or pass it along to the next assembler if the assembledLines is greater than 1 as the pipeValue is returned by the final aborted assembler
 */
export const abort = (assembledLines = 1, pipeValue?: PipeValue): BotAction<AbortLineSignal> =>
  async() => createAbortLineSignal(assembledLines, pipeValue)

/**
 * Return an AbortLineSignal of 1 assembledLine if the value provided equals the pipe value or the value provided is a callback function when given the pipe value returns true
 * cb gets the pipeValue. If cb returns true, then abort the pipe line
 * @param value the value to test against the pipeValue for equality unless function then call function with value and if function returns truthy then Abort
 * @param abortPipeValue the pipeValue of the AbortLineSignal returned
 * @param assembledLines the assembledLines of the AbortLineSignal returned
 */
export const abortPipe = (value: CaseValue, abortPipeValue: PipeValue = undefined, assembledLines: number = 1): BotAction<AbortLineSignal|PipeValue|CasesSignal> =>
  pipeCase(value)(
    abort(assembledLines + 2, abortPipeValue)
  ) // returns AbortLineSignal(1, abortPipeValue?) if value(pipeValue) is truthy || value === pipeValue

/**
 * If an assembled BotAction returns an AbortLineSignal, instead of just aborting the line, recycle will catch the AbortLineSignal then restart the actions
 * @param minimumAssembledLines require a minimum `assembledLines` number in the AbortLineSignal to recycle otherwise abort regularly
 */
export const recycle = (minimumAssembledLines: number = 1, useThisActionsPipeValueOnRecycle?: BotAction<any>) =>
  (...actions: BotAction<any>[]): BotAction<any> =>
    async(page, ...injects) => {
      let pipeObject: Pipe = createEmptyPipe()

      if (injectsHavePipe(injects)) {
        pipeObject = getInjectsPipeOrEmptyPipe(injects)
        injects = injects.slice(0, injects.length - 1)
      }

      let recycleActions: boolean
      do {
        if (recycleActions && useThisActionsPipeValueOnRecycle) {
          pipeObject = wrapValueInPipe(await useThisActionsPipeValueOnRecycle(page, ...injects, pipeObject))
        }

        recycleActions = false;

        for(const action of actions) {
          // manually resolving actions in a Pipe instead of using pipe()() to control the AbortLineSignal processing
          const nextPipeValueOrUndefined: AbortLineSignal|PipeValue|undefined = await action(page, ...injects, pipeObject)

          if (isAbortLineSignal(nextPipeValueOrUndefined)) {
            // infinite edge case: aborts recycle() UNLESS minimumAssembledLines is set to 0
            if (nextPipeValueOrUndefined.assembledLines >= minimumAssembledLines || minimumAssembledLines === 0) {
              recycleActions = true;
              pipeObject = wrapValueInPipe(nextPipeValueOrUndefined)
              break;
            } else {
              // abort the recycle
              return processAbortLineSignal(nextPipeValueOrUndefined)
            }
          }

          pipeObject = wrapValueInPipe(nextPipeValueOrUndefined)
        }
      } while(recycleActions)

      return pipeObject.value
    }
