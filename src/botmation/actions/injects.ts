import { BotAction } from "botmation/interfaces"
import { PipeValue } from "../types/pipe"
import { assemblyLine } from "./assembly-lines"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 * @note           If you need injects to run as a pipe, wrap injects in pipe()()
 */
export const injects =
  (...newInjects: any[]) => 
    (...actions: BotAction<PipeValue|void>[]): BotAction<any> => 
      async(page, ...injects) => 
        await assemblyLine()(...actions)(page, ...newInjects, ...injects)