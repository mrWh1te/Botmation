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
      // TODO test running chain()() inside a pipe()()
      //    a) does it get a Pipe value undefined minimum?
      //    b) does it unwrap that to inject it in first action?
      //    c) is (b) good/bad?
      await BotActionsChain(page, ...injects)(...actions)
    }