import { PipeValue } from "../types"
import { CasesSignal, isCasesSignal } from "../types/cases"

/**
 * Create a CasesSignal object with safe defaults for no params provided (default is no matches, pipe value undefined, and conditionPass false)
 * @param matches
 * @param pipeValue
 */
export const createCasesSignal = <V = any>(matches: {} = {}, conditionPass: boolean = false, pipeValue?: PipeValue): CasesSignal<V> => ({
  brand: 'Cases_Signal',
  conditionPass,
  matches,
  pipeValue
})

/**
 * If a CasesSignal is provided, its pipeValue is returned, otherwise `undefined` is returned
 * @param casesSignal
 */
export const casesSignalToPipeValue = (casesSignal: CasesSignal|any): PipeValue =>
  isCasesSignal(casesSignal) ? casesSignal.pipeValue : undefined
