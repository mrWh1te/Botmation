import { BotAction, Pipe } from "botmation/interfaces"
import { injectsHavePipe, pipeInjects, wrapValueInPipe, getInjectsPipeOrEmptyPipe, createEmptyPipe } from "botmation/helpers/pipe"
import { PipeValue } from "botmation/types/pipe-value"

//
// These functions resolve the actions (aka run them), in order received, like on an assembly line, 1 action at a time - going down the conveyer belt
//


/**
 * @description     chain() BotAction for running a chain of BotAction's safely and optimized
 *                  If it receives a Pipe in the injects, it will strip it out. It does not return values.
 * @param actions 
 */
export const chain =
  (...actions: BotAction[]): BotAction =>
    async(page, ...injects) => {
      // pipe support for running a chain inside a pipe as a real chain
      // otherwise, the injects will naturally carry the pipe through the whole chain of actions in the last inject
      // but, could that be desirable? A new kind of assembly line, similar to chain but carries a Pipe through (1 case ignoring BotAction returns, the other piping those return values)
      if (injectsHavePipe(injects)) {
        // remove pipe
        if (actions.length === 0) {}
        else if(actions.length === 1) {
          await actions[0](page, ...injects.splice(0, injects.length - 1))
        } else {
          await chainRunner(...actions)(page, ...injects.splice(0, injects.length - 1))
        }
      } else {
        // run regularly in a chain, no need to remove a pipe (last inject)
        if (actions.length === 0) {}
        else if(actions.length === 1) {
          await actions[0](page, ...injects)
        } else {
          await chainRunner(...actions)(page, ...injects)
        }
      }
    }

/**
 * @description    Higher Order BotAction for running a sequence of BotAction's with piping
 *                 valueToPipe overwrites the passed in Pipe value
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
              return (await pipeRunner(...actions)(page, ...injects.splice(0, injects.length - 1), wrapValueInPipe(valueToPipe)))
            } else {
              return (await pipeRunner(...actions)(page, ...injects))
            }
          }
        } else {
          // injects don't have a pipe, so add one:
          if (actions.length === 0) {return undefined}
          else if (actions.length === 1) {
            return await actions[0](page, ...injects, wrapValueInPipe(valueToPipe))
          } else {
            return (await pipeRunner(...actions)(page, ...injects, wrapValueInPipe(valueToPipe)))
          }
        }
      }

/**
 * @description   Efficiently run actions in a pipe or a chain by detecting the higher order assembly line runner
 *                Detects by checking if injects provided are piped. If piped, runs it in a pipe()() else runs it in a chain()
 *                Can override that behavior, to force running in a pipe, by setting `forceInPipe` to true
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
            return await pipeRunner(...actions)(page, ...pipeInjects(injects))
          }
        } else {
          // running a chain
          if (actions.length === 0) {}
          else if (actions.length === 1) {
            await actions[0](page, ...injects)
          } else {
            await chainRunner(...actions)(page, ...injects)
          }
        }
      }

/**
 * @description   For a particular utility BotAction that doesn't know whether it's receiving an array (not spread!) of BotActions or just 1 BotAction
 *                Can be helpful for advanced BotAction's that use a callback function as a param to return BotAction(s) for running in some new context
 * @example       See forAll()()
 * @param actionOrActions Botaction<PipeValue> | BotAction<PipeValue>[]
 */
export const pipeActionOrActions = 
  (actionOrActions: BotAction<PipeValue> | BotAction<PipeValue>[]): BotAction<PipeValue|undefined> =>
    async(page, ...injects) => {
      if (Array.isArray(actionOrActions)) {
        return await pipe()(...actionOrActions)(page, ...injects)
      } else {
        return await actionOrActions(page, ...pipeInjects(injects)) // simulate pipe
      }
    }

//
// Avoid using the following BotAction's, unless you know what you're doing
//

/**
 * @description    Runs all actions provided in a chain
 *                 Does not have checks/safety fall backs/optimizations, etc, so please be careful with using this. Instead consider chain()()
 * @param actions 
 */    
export const chainRunner =
  (...actions: BotAction[]): BotAction =>
    async(page, ...injects) => {
      for(const action of actions) {
        await action(page, ...injects)
      }
    }

/**
 * @description    Runs all actions provided in a pipe
 *                 Does not have checks/safety fall backs/optimizations, etc, so please be careful with using this. Instead consider pipe()()
 * @param actions 
 */  
export const pipeRunner = 
  <R extends PipeValue = PipeValue, P extends PipeValue = PipeValue>
  (...actions: BotAction<PipeValue|void>[]): BotAction<PipeValue<R>> =>
    async(page, ...injects) => {
      // Possible for last inject to be the piped value
      let pipe: Pipe = createEmptyPipe()

      // in case we are used in a chain, injects won't have a pipe at the end
      if (injectsHavePipe(injects)) {
        pipe = getInjectsPipeOrEmptyPipe<P>(injects)
        injects = injects.slice(0, injects.length - 1)
      }

      // let piped // pipe's are closed chain-links, so nothing pipeable comes in, so data is grabbed in a pipe and shared down stream a pipe, and returns
      for(const action of actions) {
        const nextPipeValueOrUndefined: PipeValue|void = await action(page, ...injects, pipe) // typing.. botaction's async return can be void, but given how promises must resolve(), the value is actually undefined

        // Bot Actions return the value removed from the pipe, and BotActionsPipe wraps it for injecting
        pipe = wrapValueInPipe(nextPipeValueOrUndefined as PipeValue|undefined)
      }

      return pipe.value as any as PipeValue<R>
    }    