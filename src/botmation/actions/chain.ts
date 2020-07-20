import { BotAction } from "botmation/interfaces"
import { BotActionsChain } from "botmation/factories/bot-actions-chain"
import { injectsHavePipe } from "botmation/helpers/pipe"

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
      //    b) does it get injected as a Pipe or PipeValue in first action?
      //    c) is (b) good/bad? is this a bug (standards considered) that could become a desirable feature?

      // pipe support for running a chain inside a pipe as a real chain
      // otherwise, the injects will naturally carry the pipe through the whole chain of actions in the last inject
      // like the questions above, could that be desirable? Chain could be a way to run a bunch of functions without effecting the Pipe...
          // ^if yes, then there is no way (atm) to distinguish pipe and chain
          // maybe instead, a new kind of Pipe that acts like a chain where the behavior of not returning a value no longer empties the pipe (set value undefined)
          //   but let's the previous value, get carried over?
          //   It could even be `pipe()()` with some kind of configuration, new param ie `carryPipeValue: true` when a BotAction does not return a value or returns undefined
      if (injectsHavePipe(injects)) {
        // remove pipe
        await BotActionsChain(page, ...injects.splice(0, injects.length - 1))(...actions)
      } else {
        await BotActionsChain(page, ...injects)(...actions)
      }

    }