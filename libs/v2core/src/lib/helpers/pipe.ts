/**
 * Functions that help with piping: pipe()() / Pipe
 */

import { isPipe, Pipe, EmptyPipe } from "../interfaces/pipe"
import { Injects, InjectsValue } from "../types"
import { PipeValue } from "../types/pipe-value"

/**
 * @description    Unpipe the injects by returning the injects with the Pipe value first, followed by the injects
 *                 If no Pipe is detected, it will return the injects with an undefined value prepended, as if the injects had an empty pipe (safe fallback)
 * @param injectsMaybePiped
 * @param minimumInjectsCount     Default is 0
 *                                When you're not sure if the injects have the correct number your hoping for, you can make your code safer by specifying a count here to autofill with minimumInjectsFill (default undefined)
 *                                ie IndexedDB BotAction for getting a key/value, we're not sure if the injects will be there, but we can set a minimum here, to keep the code clean
 * @param minimumInjectsFill      Default is undefined
 *                                If you're using minimumInjectsCount, you can specify what the injects are replaced with, when missing
 *                                This is helpful when your injects are objects and you want to test properties/functions without testing the objects themselves
 * @returns        Unpiped Injects, with the pipe value first
 */
export const unpipeInjects = <P extends PipeValue = PipeValue>(injectsMaybePiped: any[], minimumInjectsCount = 0, minimumInjectsFill = undefined): [P, ...any[]] => {
  if (minimumInjectsCount > 0 && injectsMaybePiped.length < minimumInjectsCount) {
    const minimumInjects = []
    for(let i = 0; i < minimumInjectsCount; i++) {
      // check for inject AND that the inject isn't a Pipe
      if (injectsMaybePiped[i] && !isPipe(injectsMaybePiped[i])) {
        minimumInjects.push(injectsMaybePiped[i])
      } else {
        minimumInjects.push(minimumInjectsFill)
      }
    }

    return [getInjectsPipeValue(injectsMaybePiped), ...minimumInjects]
  }

  return [getInjectsPipeValue(injectsMaybePiped), ...removePipe(injectsMaybePiped)]
}

/**
 * @description    Removes Pipe from injects if the injects has one, then returns injects
 * @param injectsv
 */
export const removePipe = (injects: any[]): any[] => {
  if (injectsHavePipe(injects)) {
    return injects.slice(0, injects.length - 1)
  }

  return injects
}

/**
 * @description     Gets a Pipe from the provided injects, if they don't have one, it provides an empty one instead as a safe fallback
 * @param injects
 */
export const getInjectsPipeOrEmptyPipe = <P = any>(injects: any[]): Pipe<P> =>
  injects.length > 0 && isPipe(injects[injects.length - 1]) ? injects[injects.length - 1] : createEmptyPipe()


/**
 * @description     Creates an empty Pipe object
 */
export const createEmptyPipe = (): EmptyPipe => wrapValueInPipe()

/**
 * @description     Creates a Pipe object with the provided value
 * @param value
 */
export const wrapValueInPipe = <P = any>(value?: P): Pipe<P> =>  ({
  brand: 'Pipe',
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
export const getInjectsPipeValue = ({value}: Partial<InjectsValue>): PipeValue =>
  value

/**
 * @description    If the provided injects don't have a Pipe at the end, this appends an empty one
 *                 Can simulate running inside a pipe()() for a BotAction
 * @param injects
 */
export const pipeInjects = (injects: any[]): any[] => {
  if (injectsHavePipe(injects)) {
    return injects
  }

  return [...injects, createEmptyPipe()]
}
