import { BotAction } from "botmation/interfaces"
import { pipe } from "./pipe"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 */
export const injects = (...newInjects: any[]) =>
  (...actions: BotAction[]): BotAction =>
      pipe(undefined, ...newInjects)(...actions)