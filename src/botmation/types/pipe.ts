/**
 * @description     Type of the value being piped in a pipeable BotAction
 * @deprecated
 */
export type PipeValue<V = any> = V

/**
 * @description    Wrapping piped values with a property `brand` to give us a way to test it with a gaurd against other injects
 * @todo move to another file
 */
export interface Pipe<P = any> {
  brand: 'piped',
  value: P
}

/**
 * @description    Type Gaurd for Piped values (values branded as `piped`)
 * @param value 
 */
export const isPipe = <P = any>(value: Pipe<P> | any): value is Pipe<P> => {
  // check undefined
  if (!value) {
    return false
  }

  // check type gaurd
  if (value.brand === 'piped') {
    return true
  }

  return false
}