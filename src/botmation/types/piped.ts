/**
 * @description     Type of the value being piped in a pipeable BotAction
 * @deprecated
 */
export type PipedValue<T> = T|undefined

/**
 * @description    Wrapping piped values with a property `brand` to give us a way to test it with a gaurd against other injects
 * @todo move to another file
 */
export interface Piped<P = any> {
  brand: 'piped',
  value: P
}

/**
 * @description    Type Gaurd for Piped Values
 * @param value 
 */
export const isPipedValue = <P = any>(value: Piped<P> | any): value is Piped<P> => {
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