import { BotAction } from "botmation/interfaces"
import { PipeValue } from "../types/pipe"
import { pipe } from "./assembly-line"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 */
export const injects =
  (...newInjects: any[]) => 
    (...actions: BotAction<PipeValue|void>[]): BotAction<any> => 
      async(page, ...injects) => 
        await pipe()(...actions)(page, ...newInjects, ...injects)