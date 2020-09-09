import { Dictionary, isDictionary } from "./objects"
import { PipeValue } from "./pipe-value"
import { ConditionalCallback } from "./callbacks"

/**
 * A particular kind of return object for BotAction's that signal the results of an evaluated condition 
 *  while givenThat()() does not use this, it could
 *  atm pipeCase()() && pipeCases()() return this object to standardize the interface for interpretation
 */
export type CasesSignal<V = any> = {
  brand: 'Cases_Signal',
  matches: Dictionary<V>,
  conditionPass: boolean,
  pipeValue?: PipeValue
}

/**
 * 
 * @param value 
 */
export const isCasesSignal = <V = any>(value: any): value is CasesSignal<V> => 
  typeof value === 'object' && 
  value !== null && 
  value.brand === 'Cases_Signal' && 
  typeof value.conditionPass === 'boolean' && 
  isDictionary<V>(value.matches)

/**
 * values that represent cases to test against a pipe value
 */
export type CaseValues = Exclude<PipeValue, Function>|ConditionalCallback
