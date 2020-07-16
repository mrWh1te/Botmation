import { BotAction } from "botmation/interfaces"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 */
export const injects = (...newInjects: any[]) =>
  (...actions: BotAction[]): BotAction =>
    async(page, ...injects: any[]) =>
      await BotActionsPipe(page, ...newInjects, ...injects)(...actions)