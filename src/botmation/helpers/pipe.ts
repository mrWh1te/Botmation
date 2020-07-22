/**
 * Functions that help with piping: pipe()() / Pipe
 */

import { PipeValue } from "botmation/types/pipe-value"
import { isPipe, Pipe } from "botmation/interfaces/pipe"

/**
 * @description    Unpipe the injects by returning the injects but with the value from the Pipe object, instead of the Pipe, with a safe fallback
 *                 If no Pipe detected, it will return the injects with undefined appended, as if an empty pipe (safe fallback)
 * @param injectsMaybePiped 
 * @returns        Unpiped Injects
 */
export const unpipeInjects = (injectsMaybePiped: any[]): any[] => {
  if (injectsHavePipe(injectsMaybePiped)) {
    // return the injects, but unpipe the value by returning the Pipe object's value
    return [...injectsMaybePiped.slice(0, injectsMaybePiped.length - 1), injectsMaybePiped[injectsMaybePiped.length - 1].value]
  } else {
    // return the injects with an undefined value appended, as if we unpiped an empty pipe (safe fallback)
    return [...injectsMaybePiped, undefined]
  }
}

/**
 * @description     Returns a Pipe if found in the Injects array, otherwise returns the representation of an empty pipe
 * @param injects 
 */
export const injectsPipeOrEmptyPipe = <P = any>(injects: any[]): Pipe<P> =>
  injects.length > 0 && isPipe(injects[injects.length - 1]) ? injects[injects.length - 1] : wrapValueInPipe()

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
 * @description    For when your not sure if the value is in a pipe or not, but you need a value
 *                 If not pipe, returns the param value
 * @param pipeOrValue 
 */
export const getPipeValue = <V = PipeValue>(pipeOrValue: Pipe|PipeValue): V => {
  if (isPipe(pipeOrValue)) {
    return pipeOrValue.value as any as V
  }

  // value
  return pipeOrValue as any as V

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

/**
 * @description    If the provided injects don't have a pipe at the end, this will add one. That makes this condition "simulate" being ran in a pipe, not a chain
 *                 Helpful for utility functions running pipes inside chains like givenThat(condition), otherwise pipes ran inside will not return values (in case of conditionalbotaction, that is a boolean)
 * @param injects 
 */
export const pipeInjects = (injects: any[]): any[] => {
  if (injectsHavePipe(injects)) {
    return injects
  }

  return [...injects, wrapValueInPipe()]
}