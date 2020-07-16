/**
 * Functions that help with the Pipe
 */

import { isPipe, Pipe } from "botmation/types/pipe"

/**
 * @description    Returns an array of all the injects with the piped value unpiped (removed from branded wrapping)
 *                 If there is no pipe, then undefined will be injected as if there was (safe default, empty pipe)
 * @param injectsMaybePipe 
 * @todo move to a pipe helper
 */
export const openInjectsPipe = (injectsMaybePipe: any[]): any[] => {
  let injectsWithoutPipe = injectsMaybePipe.slice(0, injectsMaybePipe.length - 1)

  // if the branded pipe has a value, return that, otherwise return undefined
  return [...injectsWithoutPipe, getInjectsPipeValue(injectsMaybePipe)]
}

/**
 * @description     Returns a Piped Value, if found in the Injects array, otherwise returns the representation of an empty pipe
 * @param injects 
 */
export const injectsPipeOrEmptyPipe = <P = any>(injects: any[]): Pipe<P> =>
  injects.length > 0 && isPipe(injects[injects.length - 1]) ? injects[injects.length - 1] : wrapValueInPipe(undefined) // empty pipe

/**
 * @description   Default return is a empty pipe (missing `value` key from Piped object)
 * @param value 
 */
export const wrapValueInPipe = <P = any>(value: P): Pipe<P> =>  ({
  brand: 'piped',
  value
})

/**
 * @description    Injects are piped when the last inject is actually the piped value
 *                 Checks injects to see if the last inject is a piped value
 * @param injects 
 */
export const injectsHavePipe = (injects: any[]): boolean => {
  if (injects.length === 0) {
    return false
  }

  return isPipe(injects[injects.length - 1])
}

/**
 * @description    For when your not sure if the value is in a pipe or not, but you need it
 *                 If not pipe, returns the param value
 * @param pipeOrValue 
 */
export const getPipeValue = <R = any>(pipeOrValue: Pipe<R>|R): R => {
  if (isPipe(pipeOrValue)) {
    // piped value
    return pipeOrValue.value
  }

  // value
  return pipeOrValue
}

/**
 * @description    Gets the pipe value from an `injects` array, but if the array is missing the pipe, it returns undefined (like an empty pipe value would be)
 * @param injects 
 */
export const getInjectsPipeValue = (injects: any[]): any => {
  if (injectsHavePipe(injects)) {
    return injects[injects.length - 1].value
  }

  return undefined
}