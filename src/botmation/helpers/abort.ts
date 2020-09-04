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

/**
 * Process an AbortLineSignal object returned from a BotAction
 *  Default is for 1 assembled line (level deep) but can be overriden with reduceAssembledLinesBy for 
 * @param abortLineSignal signal to process for default one assembled line
 * @param reduceAssembledLinesBy positive number to reduce the AbortLineSignal's assembledLines by (should be 1)
 */
export const processAbortLineSignal = (abortLineSignal: AbortLineSignal, reduceAssembledLinesBy = 1): AbortLineSignal|PipeValue => {
  switch(abortLineSignal.assembledLines) {
    case 0:
      return abortLineSignal
    case 1:
      return abortLineSignal.pipeValue
    default:
      if (abortLineSignal.assembledLines < reduceAssembledLinesBy) {
        return abortLineSignal.pipeValue
      } else {
        return createAbortLineSignal(abortLineSignal.assembledLines - reduceAssembledLinesBy, abortLineSignal.pipeValue)
      }
  }
}