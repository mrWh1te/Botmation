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
 * @description    Type Gaurd for Piped values (values branded as `piped`)
 * @param value 
 */
export const isPiped = <P = any>(value: Piped<P> | any): value is Piped<P> => {
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

/**
 * @description    Injects are piped when the last inject is actually the piped value
 *                 Checks injects to see if the last inject is a piped value
 * @param injects 
 */
export const injectsArePiped = (injects: any[]): boolean => {
  if (injects.length === 0) {
    return false
  }

  return isPiped(injects[injects.length - 1])
}

export const getInjectsPipedValue = (injects: any[]): any => {
  if (injectsArePiped(injects)) {
    return injects[injects.length - 1].value
  }

  throw new Error('Piped value missing from Injects') // TODO confirm the utility of this code
}