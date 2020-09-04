import { Dictionary, PipeValue } from "../types"
import { MatchesSignal } from "../types/matches-signal"

export const createMatchesSignal = <V = any>(matches: Dictionary<V> = {}, pipeValue?: PipeValue): MatchesSignal<V> => ({
  brand: 'Matches_Signal',
  matches,
  pipeValue
})

export const hasMatches = (matches: Dictionary): boolean => 
  Object.keys(matches).length > 0