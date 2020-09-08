import { Dictionary, PipeValue } from "../types"
import { CasesSignal } from "../types/cases-signal"

/**
 * Create a CasesSignal object with safe defaults for no params provided (default is no matches, pipe value undefined, and conditionPass false)
 * @param matches 
 * @param pipeValue 
 */
export const createCasesSignal = <V = any>(matches: Dictionary<V> = {}, conditionPass: boolean = false, pipeValue?: PipeValue): CasesSignal<V> => ({
  brand: 'Cases_Signal',
  conditionPass,
  matches,
  pipeValue
})