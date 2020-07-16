import { BotAction } from "botmation/interfaces"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"
import { pipe } from "./pipe"
import { getInjectsPipeValue } from "botmation/helpers/pipe"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 */
export const injects_working = (...newInjects: any[]) =>
  (...actions: BotAction[]): BotAction =>
    async(page, ...injects) =>
      await BotActionsPipe(page, ...newInjects, ...injects)(...actions)

//
// new-gen
export const injects = (...newInjects: any[]) =>
  (...actions: BotAction[]): BotAction =>
    async(page, ...injects) =>
      pipe(getInjectsPipeValue(injects), ...newInjects)(...actions)(page, ...injects)