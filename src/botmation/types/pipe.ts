/**
 * @description     Type of the value in a pipe object being carried through the injects of BotActions
 *                    It's every type except `any`, `never` and `void`
 * 
 *                  This provides stronger typing for BotAction's that return a PipeValue versus those that don't (therefore work in a chain)
 */
export type AllPipeValues = boolean|number|string|object|Function|Array<any>|null|undefined
export type PipeValue<V = AllPipeValues> = V

/**
 * @description    Wrapping piped values with a property `brand` to give us a way to test it with a gaurd against other injects
 * @todo move to another file
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