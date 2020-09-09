import { BotAction } from "../interfaces"
import { AbortLineSignal } from '../types'
import { PipeValue } from "../types/pipe-value"
import { createAbortLineSignal } from "../helpers/abort"
import { pipeCase } from "./pipe"
import { ConditionalCallback } from "../types/callbacks"
import { CasesSignal } from "../types/cases"

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
 * @param value 
 * @param abortPipeValue 
 * @param assembledLines 
 */
export const abortPipe = (value: PipeValue|ConditionalCallback, abortPipeValue: PipeValue = undefined, assembledLines: number = 1): BotAction<AbortLineSignal|PipeValue|CasesSignal> => 
  pipeCase(value)(
    abort(assembledLines + 2, abortPipeValue)
  ) // returns AbortLineSignal(1, abortPipeValue?) if value(pipeValue) is truthy || value === pipeValue
