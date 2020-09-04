import { Dictionary, PipeValue } from "../types"
import { MatchesSignal } from "../types/matches-signal"

/**
 * Create a MatchesSignal object with safe defaults for no params provided (default is no matches, and pipe value undefined)
 * @param matches 
 * @param pipeValue 
 */
export const createMatchesSignal = <V = any>(matches: Dictionary<V> = {}, pipeValue?: PipeValue): MatchesSignal<V> => ({
  brand: 'Matches_Signal',
  matches,
  pipeValue
})

/**
 * Does the MatchesSignal have at least one match represented?
 * @param signal 
 */
export const hasAtLeastOneMatch = (signal: MatchesSignal): boolean => 
  Object.keys(signal.matches).length > 0