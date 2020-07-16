/**
 * Functions that help with the Pipe
 */

import { isPipe, Pipe, PipeValue } from "botmation/types/pipe"

/**
 * @description    Safe way to extract injects that may or may not have a pipe
 *                  If no pipe, it acts as if it was an empty pipe, so adds "undefined" so you can safely assume the last extracted value was a pipe value
 *                 Returns an array of all the injects with the piped value unpiped (removed from branded wrapping)
 *                 If there is no pipe, then undefined will be injected as if there was (safe default, empty pipe)
 * @param injectsMaybePipe array of injects thay may or may not have a pipe at the end
 * @return an array of injects with a value at the end, whatever was in the pipe, if no pipe then undefined (empty pipe value)
 */
export const unpipeInjects = (injectsMaybePipe: any[]): any[] => {
  let injectsWithoutPipe 
  
  if (injectsHavePipe(injectsMaybePipe)) {
    injectsWithoutPipe = injectsMaybePipe.slice(0, injectsMaybePipe.length - 1)
  } else {
    injectsWithoutPipe = [...injectsMaybePipe]
  }

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
 * @param value if you don't provide a value, it will return an empty pipe (pipe with value: undefined)
 */
export const wrapValueInPipe = <P = any>(value?: P): Pipe<P> =>  ({
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
export const getPipeValue = <R = PipeValue>(pipeOrValue: Pipe<R>|R): R => {
  if (isPipe(pipeOrValue)) {
    // piped value
    return pipeOrValue.value as R
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