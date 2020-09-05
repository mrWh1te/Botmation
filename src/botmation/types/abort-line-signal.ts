import { PipeValue } from "./pipe-value"

/**
 * @param assembledLines default should be 1 which is abort the line assembled in, 0 means infinite abort all lines to the root, and any positive integer is understood as aborting a specific number of assembled lines, not all the way to the top
 */
export type AbortLineSignal = {
  brand: 'Abort_Signal',
  assembledLines: number,
  pipeValue?: PipeValue
}

/**
 * Test value for the minimum requirements of the AbortLineSignal type
 * @param value 
 */
export const isAbortLineSignal = (value: any): value is AbortLineSignal => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return value.brand === 'Abort_Signal' && typeof value.assembledLines === 'number'
}