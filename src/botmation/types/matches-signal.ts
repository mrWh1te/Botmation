import { Dictionary, isDictionary } from "./objects"
import { PipeValue } from "./pipe-value"

export type MatchesSignal<V = any> = {
  brand: 'Matches_Signal',
  matches: Dictionary<V>,
  pipeValue?: PipeValue
}

export const isMatchesSignal = <V = any>(value: any): value is MatchesSignal<V> => 
  typeof value === 'object' && value !== null && value.brand === 'Matches_Signal' && isDictionary<V>(value.matches)