import { PipeValue } from "botmation/types/pipe-value"

/**
 * @description    The last inject of a piped BotAction (ran inside pipe()()) is a Pipe object whose `value` key is set to the value returned by the last BotAction in the pipe()()
 */
export interface Pipe<V = PipeValue> {
  brand: 'piped',
  value?: V
}

/**
 * @description    Type Gaurd for Piped values (values branded as `piped`)
 * @param value 
 */
export const isPipe = <V extends PipeValue = PipeValue>(value: any): value is Pipe<V> => {
  // check undefined
  if (!value) {
    return false
  }

  // check type gaurd
  if (value.brand && value.brand === 'piped') {
    return true
  }

  return false
}

/**
 * @description    Programmatic expression of what an Empty Pipe looks like
 */
export interface EmptyPipe extends Pipe<undefined> {}