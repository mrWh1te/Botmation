import { BotAction } from "botmation/interfaces"
import { PipeValue } from "../types/pipe"
import { injectsHavePipe } from "botmation/helpers/pipe"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"
import { logError } from "botmation/helpers/console"

/**
 * @description    Mechanic for error handling
 *                 Higher-order to wrap ran actions in a named try/catch block
 *                 
 *                 Helps with finding thrown errors
 * @param errorBlockName errors caught will be logged with this name
 */
export const errors =
  (errorBlockName: string = 'Anonymous') => 
    (...actions: BotAction<PipeValue|void>[]): BotAction<any> => 
      async(page, ...injects) => {
        try {
          if (injectsHavePipe(injects)) {
            return (await BotActionsPipe(page, ...injects)(...actions)).value
          }
  
          // otherwise, we are not in a pipe, therefore we are in a chain and do no want to return the value, because chain links are isolated, no piping
          await BotActionsPipe(page, ...injects)(...actions)
        } catch(error) {
          logError('caught in ' + errorBlockName)
          console.error(error)
          console.log('\n') // space between this message block and the next

          // @TODO future is it possible to return something if we're in a pipe like an error flag? That way something next in the pipe can react to the error, for such use-cases?
        }
      }    