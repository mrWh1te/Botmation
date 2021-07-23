import { Action } from "../interfaces"
import { logError } from "../helpers/console"
import { pipe, chain } from "./assembly-lines"
import { Injects, InjectValue } from "../types"

/**
 * @description    Higher-order Action to run actions in a try/catch block that logs errors with the provided errorBlockName
 *
 *                 Helps with finding thrown errors, as you can nest errors()() closer and closer to the action in complex sequences
 *
 *                 Supports chain()() and pipe()()
 * @param errorsBlockName errors caught will be logged with this name
 */
export const errors =
  <I extends Partial<InjectValue> = {}>(errorsBlockName: string = 'Unnamed Errors Block') =>
    (...actions: Action[]): Action<I> =>
      async({value, ...otherInjects}: I) => {
        try {
          if (value) {
            return await pipe()(...actions)({value, ...otherInjects})
          }

          return await chain(...actions)({...otherInjects})
        } catch(error) {
          logError('caught in ' + errorsBlockName)
          console.error(error)
          console.log('\n') // space between this message block and the next

          // todo future is it possible to return something if we're in a pipe like an error flag? That way something next in the pipe can react to the error, for such use-cases?
        }
      }
