/**
 * Functions that help with the Pipe
 */

import { isPiped, Piped } from "botmation/types/piped"

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

/**
 * 
 * @param injects 
 */
export const getInjectsPipedValue = (injects: any[]): any => {
  if (injectsArePiped(injects)) {
    return injects[injects.length - 1].value
  }

  // there's an expectation that this function is ONLY used in pipe's
  // where the last thing in the injects array, is a piped value
  throw new Error('[getInjectsPipedValue] Piped value missing from Injects -> Maybe this ran inside a chain and not a pipe?') 
}