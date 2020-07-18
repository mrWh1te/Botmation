import { BotAction } from "botmation/interfaces"
import { pipe } from "./pipe"
import { PipeValue } from "../types/pipe"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 */
export const injects = (...newInjects: any[]) =>
  (...actions: BotAction<PipeValue|void>[]): BotAction =>
    pipe(undefined, ...newInjects)(...actions)