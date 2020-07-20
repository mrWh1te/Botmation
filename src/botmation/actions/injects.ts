import { BotAction } from "botmation/interfaces"
import { PipeValue } from "../types/pipe"
import { injectsHavePipe } from "botmation/helpers/pipe"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"
import { assemblyLine } from "./assembly-line"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 */
export const injects =
  (...newInjects: any[]) => 
    (...actions: BotAction<PipeValue|void>[]): BotAction<any> => 
      async(page, ...injects) => 
        await assemblyLine()(...actions)(page, ...newInjects, ...injects)
      
      
      // {
      //   if (injectsHavePipe(injects)) {
      //     return (await BotActionsPipe(page, ...newInjects, ...injects)(...actions)).value
      //   }

      //   // otherwise, we are not in a pipe, therefore we are in a chain and do no want to return the value, because chain links are isolated, no piping
      //   await BotActionsPipe(page, ...newInjects, ...injects)(...actions)
      // }    