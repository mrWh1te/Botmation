import { PipeValue } from "./pipe-value"

/**
 * Function that operates on a PipeValue to return a boolean
 *  like Checking the pipe value against a case (ie equals 5?)
 */
export interface ConditionalCallback<V = PipeValue> extends Function {
  (value: V) : boolean
}