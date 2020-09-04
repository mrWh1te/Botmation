import { Dictionary, PipeValue } from "../types"
import { MatchesSignal } from "../types/matches-signal"

/**
 * 
 * @param matches 
 * @param pipeValue 
 */
export const createMatchesSignal = <V = any>(matches: Dictionary<V> = {}, pipeValue?: PipeValue): MatchesSignal<V> => ({
  brand: 'Matches_Signal',
  matches,
  pipeValue
})

/**
 * 
 * @param signal 
 */
export const hasAtLeastOneMatch = (signal: MatchesSignal): boolean => 
  Object.keys(signal.matches).length > 0