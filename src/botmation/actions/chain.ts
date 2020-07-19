import { BotAction } from "botmation/interfaces"
import { BotActionsChain } from "botmation/factories/bot-actions-chain"

/**
 * @description     chain() BotAction for running a chain of BotAction's
 *                  With this, you can skip touching a BotActionFactory directly
 *                  100% BotAction's, if you want..
 * @param actions 
 */
export const chain =
  (...actions: BotAction[]): BotAction =>
    async(page, ...injects) => {
      BotActionsChain(page, ...injects)(...actions) // TODO need await ? Type wise, no... but TBD test with subsequent chain()() ? maintain proper order?
    }