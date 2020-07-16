import { BotAction } from "botmation/interfaces"
import { BotActionsPipeFactory } from "botmation/factories/bot-actions-pipe.factory"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 */
export const injects = (...newInjects: any[]) =>
  (...actions: BotAction[]): BotAction =>
    async(page, ...injects: any[]) =>
      await BotActionsPipeFactory(page, ...newInjects, ...injects)(...actions)