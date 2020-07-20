import { BotAction } from "botmation/interfaces"
import { injectsHavePipe, pipeInjects, wrapValueInPipe, getInjectsPipeValue } from "botmation/helpers/pipe"
import { BotActionsChain } from "botmation/factories/bot-actions-chain"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"
import { PipeValue } from "botmation/types/pipe"

//
// These functions actually resolve the actions, like an assembly line 1 action at a time as it flows through
//


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
      //    a) does it get a Pipe value undefined minimum? it did, until the following code to "remove pipe" was added
      //    b) does it get injected as a Pipe or PipeValue in first action? yep, did
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
        if (actions.length === 0) {}
        else if(actions.length === 1) {
          await actions[0](page, ...injects.splice(0, injects.length - 1))
        } else {
          await BotActionsChain(page, ...injects.splice(0, injects.length - 1))(...actions)
        }
      } else {
        // run regularly in a chain, no need to remove a pipe (last inject)
        if (actions.length === 0) {}
        else if(actions.length === 1) {
          await actions[0](page, ...injects)
        } else {
          await BotActionsChain(page, ...injects)(...actions)
        }
      }
    }

/**
 * @description    Higher Order BotAction for running a chain link as a pipe
 *                 It will try to inject the valueToPipe as the piped value unless that is undefined, then it will try to pipe the higher pipe's value from its injects otherwise undefined, an empty pipe
 * @param valueToPipe 
 */
export const pipe =
  (valueToPipe?: any) => 
    (...actions: BotAction<PipeValue|void>[]): BotAction<any> => 
      async(page, ...injects) => {
        if (injectsHavePipe(injects)) {
          if (actions.length === 0) {return undefined}
          if (actions.length === 1) {
            if (valueToPipe) {
              return await actions[0](page, ...injects.splice(0, injects.length - 1), wrapValueInPipe(valueToPipe))
            } else {
              return await actions[0](page, ...injects)
            }
          } else {
            // injects only have a pipe when its ran inside a pipe, so lets return our value to flow with the pipe mechanics
            if (valueToPipe) {
              return (await BotActionsPipe(page, ...injects.splice(0, injects.length - 1), wrapValueInPipe(valueToPipe))(...actions)).value
            } else {
              return (await BotActionsPipe(page, ...injects)(...actions)).value
            }
          }
        } else {
          // injects don't have a pipe, so add one:
          if (actions.length === 0) {return undefined}
          else if (actions.length === 1) {
            return await actions[0](page, ...injects, wrapValueInPipe(valueToPipe))
          } else {
            return (await BotActionsPipe(page, ...injects, wrapValueInPipe(valueToPipe))(...actions)).value
          }
        }

      }

/**
 * @description   Efficiently run actions in a pipe or a chain
 *                Checks if injects provided are piped, and then runs it as a chain or pipe based on that
 *                Can override that behavior to run in a pipe anyway by setting `forceInPipe` to true
 * @param forceInPipe boolean default is FALSE
 */
export const assemblyLine = 
  (forceInPipe: boolean = false) =>
    (...actions: BotAction<any>[]): BotAction<any> =>
      async(page, ...injects) => {
        if (injectsHavePipe(injects) || forceInPipe) {
          // running a pipe
          if (actions.length === 0) {return undefined}
          else if (actions.length === 1) {
            return await actions[0](page, ...pipeInjects(injects))
          } else {
            return await pipe()(...actions)(page, ...pipeInjects(injects))
          }
        } else {
          // running a chain
          if (actions.length === 0) {}
          else if (actions.length === 1) {
            await actions[0](page, ...injects)
          } else {
            await chain(...actions)(page, ...injects)
          }
        }
      }

/**
 * @description   For a particular utility BotAction that doesn't know whether it's receiving an array of BotActions of just 1 BotAction
 *                Can be helpful for advanced BotAction's that use a callback function as a param to return BotActions to run
 *                For example, see forAll()()
 * @param actionOrActions Botaction | BotAction[]
 */
export const pipeActionOrActions = 
  (actionOrActions: BotAction | BotAction[]): BotAction =>
    async(page, ...injects) => {
      if (Array.isArray(actionOrActions)) {
        await pipe()(...actionOrActions)(page, ...injects)
      } else {
        await actionOrActions(page, ...pipeInjects(injects))
      }
    }