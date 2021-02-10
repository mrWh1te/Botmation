import { BotAction } from "../interfaces"
import { PipeValue } from "../types/pipe-value"
import { injectsHavePipe } from "../helpers/pipe"
import { logError } from "../helpers/console"
import { pipe, chain } from "../actions/assembly-lines"

/**
 * @description    Higher-order BotAction to run actions in a try/catch block that logs errors with the provided errorBlockName
 *                 
 *                 Helps with finding thrown errors, as you can nest errors()() closer and closer to the action in complex sequences
 * 
 *                 Supports chain()() and pipe()()
 * @param errorsBlockName errors caught will be logged with this name
 */
export const errors =
  (errorsBlockName: string = 'Unnamed Errors Block') => 
    (...actions: BotAction<PipeValue|void>[]): BotAction<any> => 
      async(page, ...injects) => {
        try {
          if (injectsHavePipe(injects)) {
            return await pipe()(...actions)(page, ...injects)
          }
  
          return await chain(...(actions as BotAction[]))(page, ...injects)
        } catch(error) {
          logError('caught in ' + errorsBlockName)
          console.error(error)
          console.log('\n') // space between this message block and the next

          // @TODO future is it possible to return something if we're in a pipe like an error flag? That way something next in the pipe can react to the error, for such use-cases?
        }
      }    