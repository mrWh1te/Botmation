import { PipeValue } from "../types/pipe-value"

/**
 * @param assembledLines default should be 1 which is abort the line assembled in, 0 means infinite abort all lines to the root, and any positive integer is understood as aborting a specific number of assembled lines, not all the way to the top
 */
export interface AbortLineSignal {
  brand: 'Abort_Signal',
  assembledLines: number,
  pipeValue?: PipeValue
}