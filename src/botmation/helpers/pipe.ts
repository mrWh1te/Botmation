/**
 * Functions that help with piping: pipe()() / Pipe
 */

import { isPipe, Pipe, EmptyPipe } from "botmation/interfaces/pipe"

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
 * @description     Gets a Pipe from the provided injects, if they don't have one, it provides an empty one instead as a safe fallback
 * @param injects 
 */
export const getInjectsPipeOrEmptyPipe = <P = any>(injects: any[]): Pipe<P> =>
  injects.length > 0 && isPipe(injects[injects.length - 1]) ? injects[injects.length - 1] : emptyPipe()


/**
 * @description     Creates an empty Pipe
 */
export const emptyPipe = (): EmptyPipe => wrapValueInPipe()

/**
 * @description     Creates a Pipe with the provided value
 * @param value 
 */
export const wrapValueInPipe = <P = any>(value?: P): Pipe<P> =>  ({
  brand: 'piped',
  value
})

/**
 * @description    Tests provided injects for containing a Pipe
 *                 Injects are piped, when the last inject is actually a Pipe object
 *                 
 * @param injects 
 */
export const injectsHavePipe = (injects: any[]): boolean => {
  if (injects.length === 0) {
    return false
  }

  return isPipe(injects[injects.length - 1])
}

/**
 * @description    Gets the Pipe value from provided `injects`, but if injects are missing a Pipe, this returns undefined instead, as if the injects had an empty Pipe (safe fallback)
 * @param injects 
 */
export const getInjectsPipeValue = (injects: any[]): any => {
  if (injectsHavePipe(injects)) {
    return injects[injects.length - 1].value
  }

  return undefined
}

/**
 * @description    If the provided injects don't have a Pipe at the end, this appends an empty one
 *                 Can simulate running inside a pipe()() for a BotAction
 * @param injects 
 */
export const pipeInjects = (injects: any[]): any[] => {
  if (injectsHavePipe(injects)) {
    return injects
  }

  return [...injects, emptyPipe()]
}