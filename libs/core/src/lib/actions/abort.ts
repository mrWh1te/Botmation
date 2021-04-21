import { BotAction, Pipe } from "../interfaces"
import { AbortLineSignal, isAbortLineSignal } from '../types'
import { PipeValue } from "../types/pipe-value"
import { createAbortLineSignal, processAbortLineSignal } from "../helpers/abort"
import { pipeCase } from "./pipe"
import { CasesSignal, CaseValue } from "../types/cases"
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
 * Similar to Pipe, except a default abort() with assembledLines = 1 will abort the pipe AND restart it with the abort line signal's pipe value injected
 * @param actions
 */
export const restart = (...actions: BotAction<any>[]): BotAction<any> =>
  async(page, ...injects) => {
    let pipeObject: Pipe = createEmptyPipe()

    if (injectsHavePipe(injects)) {
      pipeObject = getInjectsPipeOrEmptyPipe(injects)
      injects = injects.slice(0, injects.length - 1)
    }

    let restartActions: boolean
    let actionResult: AbortLineSignal|PipeValue|undefined
    do {
      restartActions = false;

      for(const action of actions) {
        // manually resolving actions in a Pipe instead of using pipe()() to control the AbortLineSignal processing
        actionResult = await action(page, ...injects, pipeObject)

        // unique restart aborting behavior
        if (isAbortLineSignal(actionResult)) {
          // cannot restart an infinity abort, if desirable, create another BotAction - maybe with a customizing HO function
          // assembledLines 1 => restart actions
          // assembledLines 0 or 2+ => abort restart
          if (actionResult.assembledLines > 1 || actionResult.assembledLines === 0) {
            return processAbortLineSignal(actionResult, 2) // abort the line and abort restart()
          } else {
            restartActions = true;
            pipeObject = wrapValueInPipe(actionResult.pipeValue)
            break;
          }
        }

        pipeObject = wrapValueInPipe(actionResult)
      }
    } while(restartActions)

    return actionResult
  }
