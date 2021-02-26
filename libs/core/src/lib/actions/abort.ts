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
 *
 * @param minimumAssembledLines
 */
export const recycle = (minimumAssembledLines: number = 1) =>
  (...actions: BotAction<any>[]): BotAction<any> =>
    async(page, ...injects) => {
      let pipeObject: Pipe = createEmptyPipe()

      // in case we are used in a chain, injects won't have a pipe at the end
      if (injectsHavePipe(injects)) {
        pipeObject = getInjectsPipeOrEmptyPipe(injects)
        injects = injects.slice(0, injects.length - 1)
      }

      let runActions: boolean
      do {
        runActions = false;

        // pipe's are closed chain-links, so nothing pipeable comes in, so data is grabbed in a pipe and shared down stream a pipe, and returns
        for(const action of actions) {
          const nextPipeValueOrUndefined: AbortLineSignal|PipeValue|void = await action(page, ...injects, pipeObject)

          if (isAbortLineSignal(nextPipeValueOrUndefined)) {
            if (minimumAssembledLines >= nextPipeValueOrUndefined.assembledLines) {
              runActions = true;
              break;
            } else {
              return processAbortLineSignal(nextPipeValueOrUndefined)
            }
          }

          // Bot Actions return the value removed from the pipe, and BotActionsPipe wraps it for injecting
          pipeObject = wrapValueInPipe(nextPipeValueOrUndefined as PipeValue|undefined)
        }
      } while(runActions)

      return pipeObject.value
    }
