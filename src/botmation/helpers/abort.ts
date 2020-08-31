import { PipeValue } from "../types/pipe-value"
import { AbortLineSignal } from "../types/abort-signal"

/**
 * 
 * @param assembledLines 0 means all lines of assembly, 1 is just the current assembled line, and a positive number represents the exact number of lines to abort (going up from current line as 1)
 *                       The absolute value of assembledLines is used so negative numbers are flipped to their corresponding positives
 * @param pipeValue 
 */
export const createAbortLineSignal = (assembledLines = 1, pipeValue?: PipeValue): AbortLineSignal => ({
  brand: 'Abort_Signal',
  assembledLines: Math.abs(assembledLines),
  pipeValue
})