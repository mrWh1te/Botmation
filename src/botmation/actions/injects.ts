import { BotAction5 } from "botmation/interfaces"
import { BotActionsPipeFactory5 } from "botmation/factories/bot-actions-pipe.factory"

/**
 * @description    Higher-order to set first set of injects for provided BotAction's
 */
export const injects = (...newInjects: any[]) =>
  (...actions: BotAction5[]): BotAction5 =>
    async(page, ...injects: any[]) =>
      await BotActionsPipeFactory5(page, ...newInjects, ...injects)(...actions)