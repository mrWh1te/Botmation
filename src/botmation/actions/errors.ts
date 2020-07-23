import { BotAction } from "botmation/interfaces"
import { PipeValue } from "../types/pipe-value"
import { injectsHavePipe } from "botmation/helpers/pipe"
import { logError } from "botmation/helpers/console"
import { pipe, chain } from "./assembly-lines"

/**
 * @description    Higher-order BotAction to run actions in a try/catch block that logs errors with the provided errorBlockName
 *                 
 *                 Helps with finding thrown errors, as you can nest errors()() closer and closer to the action in complex sequences
 * 
 *                 Supports chain()() and pipe()()
 * @param errorBlockName errors caught will be logged with this name
 */
export const errors =
  (errorBlockName: string = 'Anonymous') => 
    (...actions: BotAction<PipeValue|void>[]): BotAction<any> => 
      async(page, ...injects) => {
        try {
          if (injectsHavePipe(injects)) {
            return await pipe()(...actions)(page, ...injects)
          }
  
          await chain(...(actions as BotAction[]))(page, ...injects)
        } catch(error) {
          logError('caught in ' + errorBlockName)
          console.error(error)
          console.log('\n') // space between this message block and the next

          // @TODO future is it possible to return something if we're in a pipe like an error flag? That way something next in the pipe can react to the error, for such use-cases?
        }
      }    