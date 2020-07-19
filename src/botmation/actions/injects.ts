import { BotAction } from "botmation/interfaces"
import { pipe } from "./pipe"
import { PipeValue } from "../types/pipe"
import { injectsHavePipe } from "botmation/helpers/pipe"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 */
// export const injects_working = (...newInjects: any[]) =>
//   (...actions: BotAction<PipeValue|void>[]): BotAction =>
//     pipe(undefined, ...newInjects)(...actions)

export const injects =
  (...newInjects: any[]) => 
    (...actions: BotAction<PipeValue|void>[]): BotAction<any> => 
      async(page, ...injects) => {
        if (injectsHavePipe(injects)) {
          return (await BotActionsPipe(page, ...newInjects, ...injects)(...actions)).value
        }

        // otherwise, we are not in a pipe, therefore we are in a chain and do no want to return the value, because chain links are isolated, no piping
        await BotActionsPipe(page, ...newInjects, ...injects)(...actions)
      }    