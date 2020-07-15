/**
 * Functions that help with the Pipe
 */

import { getInjectsPipedValue, isPiped, Piped } from "botmation/types/piped"

/**
 * @description    Returns an array of all the injects with the piped value unpiped (removed from branded wrapping)
 *    Can't remap `value` with restructuring when it's undefined
 * @param injectsPiped 
 * @todo move to a pipe helper
 */
export const openInjectsPipe = (injectsPiped: any[]): any[] => {
  let injectsWithoutPipe = injectsPiped.slice(0, injectsPiped.length - 1)

  // if the branded pipe has a value, return that, otherwise return undefined
  return [...injectsWithoutPipe, getInjectsPipedValue(injectsPiped)]
}

/**
 * @description     Returns a Piped Value, if found in the Injects array, otherwise returns the representation of an empty pipe
 * @param injects 
 */
export const injectsPipeOrEmptyPipe = <P = any>(injects: any[]): Piped<P> =>
  injects.length > 0 && isPiped(injects[injects.length - 1]) ? injects[injects.length - 1] : wrapValueInPipe(undefined) // empty pipe

/**
 * @description   Default return is a empty pipe (missing `value` key from Piped object)
 * @param value 
 */
export const wrapValueInPipe = <P = any>(value: P): Piped<P> =>  ({
  brand: 'piped',
  value
})