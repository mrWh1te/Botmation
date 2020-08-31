import { BotAction, AbortLineSignal } from "../interfaces"
import { PipeValue } from "../types/pipe-value"
import { createAbortLineSignal } from "../helpers/abort"

/**
 * BotAction to return an AbortLineSignal to be processed by an assembler for an effect of aborting assembled lines (including parent(s) if specified a number greater than 1 or 0 for all)
 * @param assembledLines number of lines (from current to parent, to grandparent, to grandgrandparent, ...) to break from continuing further
 *                       0 means all, a way to kill a bot
 * @param pipeValue works only in a Pipe assembler, optional, but if a Pipe assembler is aborted, it can return the pipeValue provided in the AbortLineSignal 
                         or pass it along to the next assembler if the assembledLines is greater than 1 as the pipeValue is returned by the final aborted assembler
 */
export const abort = (assembledLines = 1, pipeValue?: PipeValue): BotAction<AbortLineSignal> =>
  async() => createAbortLineSignal(assembledLines, pipeValue)