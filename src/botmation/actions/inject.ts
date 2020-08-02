import { BotAction } from "../interfaces"
import { PipeValue } from "../types/pipe-value"
import { assemblyLine } from "./assembly-lines"

/**
 * @description    Higher-order to set the first few injects for wrapped BotAction's
 * @note           If you need the injects to run as a pipe, wrap injects in pipe()() otherwise assemblyLine()() will run it as a chain
 */
export const inject =
  (...newInjects: any[]) => 
    (...actions: BotAction<PipeValue|void>[]): BotAction<any> => 
      async(page, ...injects) => 
        await assemblyLine()(...actions)(page, ...newInjects, ...injects)