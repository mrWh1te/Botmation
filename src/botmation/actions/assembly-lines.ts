import { BotAction, Pipe } from "../interfaces"
import { 
  injectsHavePipe,
  pipeInjects,
  wrapValueInPipe,
  getInjectsPipeOrEmptyPipe,
  createEmptyPipe,
  getInjectsPipeValue
} from "../helpers/pipe"
import { PipeValue } from "../types/pipe-value"
import { AbortLineSignal, isAbortLineSignal } from "../types/abort-line-signal"
import { processAbortLineSignal } from "../helpers/abort"
import { isMatchesSignal, MatchesSignal } from "botmation/types/matches-signal"
import { hasAtLeastOneMatch } from "botmation/helpers/matches"

/**
 * @description     chain() BotAction for running a chain of BotAction's safely and optimized
 *                  If it receives a Pipe in the injects, it will strip it out. It does not return values.
 * @param actions 
 */
export const chain =
  (...actions: BotAction<void|AbortLineSignal>[]): BotAction<void|AbortLineSignal> =>
    async(page, ...injects) => {
      // pipe support for running a chain inside a pipe as a real chain
      // otherwise, the injects will naturally carry the pipe through the whole chain of actions in the last inject
      // but, could that be desirable? A new kind of assembly line, similar to chain but carries a Pipe through (1 case ignoring BotAction returns, the other piping those return values)
      if (injectsHavePipe(injects)) {
        if(actions.length === 1) {
          const returnValue = await actions[0](page, ...injects.splice(0, injects.length - 1)) // remove pipe

          // by avoding the assembledLines 1 case, processAbortLineSignal() will
          // by default, only return an AbortLineSignal
          if (isAbortLineSignal(returnValue) && returnValue.assembledLines !== 1) {
            return processAbortLineSignal(returnValue) as AbortLineSignal
          }
        } else {
          const returnValue = await chainRunner(...actions)(page, ...injects.splice(0, injects.length - 1)) // remove pipe

          if (isAbortLineSignal(returnValue)) {
            return returnValue
          } 
        }
      } else {
        // run regularly in a chain, no need to remove a pipe (last inject)
        if(actions.length === 1) {
          const returnValue = await actions[0](page, ...injects)

          // by avoding the assembledLines 1 case, processAbortLineSignal() will
          // by default, only return an AbortLineSignal
          if (isAbortLineSignal(returnValue) && returnValue.assembledLines !== 1) {
            return processAbortLineSignal(returnValue) as AbortLineSignal
          }
        } else {
          const returnValue = await chainRunner(...actions)(page, ...injects)

          if (isAbortLineSignal(returnValue)) {
            return returnValue
          }
        }
      }
    }

/**
 * @description    Higher Order BotAction for running a sequence of BotAction's with piping
 *                 valueToPipe overwrites the passed in Pipe value
 * @param valueToPipe 
 */
export const pipe =
  (valueToPipe?: PipeValue) => 
    (...actions: BotAction<PipeValue|AbortLineSignal|void>[]): BotAction<any> => 
      async(page, ...injects) => {
        if (injectsHavePipe(injects)) {
          if (actions.length === 0) {return undefined}
          if (actions.length === 1) {
            let returnValue: PipeValue|AbortLineSignal|void
            if (valueToPipe) {
              returnValue = await actions[0](page, ...injects.splice(0, injects.length - 1), wrapValueInPipe(valueToPipe))
            } else {
              returnValue = await actions[0](page, ...injects)
            }

            if (isAbortLineSignal(returnValue)) {
              return processAbortLineSignal(returnValue)
            } else {
              return returnValue
            }
          } else {
            // injects only have a pipe when its ran inside a pipe, so lets return our value to flow with the pipe mechanics
            if (valueToPipe) {
              return await pipeRunner(...actions)(page, ...injects.splice(0, injects.length - 1), wrapValueInPipe(valueToPipe))
            } else {
              return await pipeRunner(...actions)(page, ...injects)
            }
          }
        } else {
          // injects don't have a pipe, so add one
          if (actions.length === 0) {return undefined}
          if (actions.length === 1) {
            const returnValue = await actions[0](page, ...injects, wrapValueInPipe(valueToPipe))

            if (isAbortLineSignal(returnValue)) {
              return processAbortLineSignal(returnValue)
            } else {
              return returnValue
            }
          } else {
            return await pipeRunner(...actions)(page, ...injects, wrapValueInPipe(valueToPipe))
          }
        }
      }

/**
 * switchPipe is similar to Pipe in that is supports piping, EXCEPT every assembled BotAction gets the same pipe object
 * Before each assembled BotAction is ran, the pipe is switched back to whatever is set `toPipe`
 * `toPipe` is optional and can be provided by an injected pipe object value (if nothing provided, default is undefined)
 * 
 *  AbortLineSignal default abort(1) is ignored until a MatchesSignal is returned by an assembled BotAction, marking that at least one Case has ran
 *    to break that, you can abort(2+) 
 *  This is to support the classic switch/case/break flow where its switchPipe/pipeCase/abort
 *    Therefore, if a pipeCase() does run, its returning MatcheSignal will be recognized by switchPipe and then lower the required abort count by 1
 * @param toPipe BotAction to resolve and inject as a wrapped Pipe object in EACH assembled BotAction
 */
export const switchPipe = 
  (toPipe?: BotAction | Exclude<PipeValue, Function>) => 
    (...actions: BotAction<PipeValue|AbortLineSignal|MatchesSignal|void>[]): BotAction<any[]|AbortLineSignal|PipeValue> =>
      async(page, ...injects) => {
        // fallback is injects pipe value
        if (!toPipe) {
          toPipe = getInjectsPipeValue(injects)
        }

        // if function, it's an async BotAction function
        // resolve it to Pipe the resolved value
        if (typeof toPipe === 'function') {
          if(injectsHavePipe(injects)) {
            toPipe = await toPipe(page, ...injects)
          } else {
            // simulate pipe
            toPipe = await toPipe(page, ...injects, createEmptyPipe())
          }

          if (isAbortLineSignal(toPipe)) {
            return processAbortLineSignal(toPipe)
          }
        }

        // remove pipe from injects if there is one to set the one for all actions
        if (injectsHavePipe(injects)) {
          injects = injects.slice(0, injects.length - 1)
        }

        // inject toPipe wrapped in a pipe object
        injects.push(wrapValueInPipe(toPipe))

        // run the assembled BotAction's with the same Pipe object
        let atLeastOneCaseMatched = false
        const actionsResults = []
        for(const action of actions) {
          const resolvedActionResult = await action(page, ...injects)

          if (isMatchesSignal(resolvedActionResult) && hasAtLeastOneMatch(resolvedActionResult)) {
            atLeastOneCaseMatched = true
          } else if (isAbortLineSignal(resolvedActionResult)) {
            // switchPipe has unique AbortLineSignal behavior where it takes at least one succesful case()() to reduce
            // the necessary count to abort out
            const processedAbortSignal = processAbortLineSignal(resolvedActionResult)
          
            // takes abort(1) to abort out of switchPipe if at least one case has matched
            if (atLeastOneCaseMatched) {
              return processedAbortSignal
            } else {
              // otherwise it takes at least abort(2) to abort out of the case matching test & line of botaction's
              if (isAbortLineSignal(processedAbortSignal)) {
                return processAbortLineSignal(processedAbortSignal) 
              } else {
                actionsResults.push(processedAbortSignal)
              }
            }
          } else {
            actionsResults.push(resolvedActionResult)
          }
        }

        return actionsResults
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
            const pipeActionResult = await actions[0](page, ...pipeInjects(injects))

            if (isAbortLineSignal(pipeActionResult)) {
              return processAbortLineSignal(pipeActionResult)
            } else {
              return pipeActionResult
            }
          } else {
            return await pipeRunner(...actions)(page, ...pipeInjects(injects))
          }
        } else {
          // while chains dont return pipeValues, this is an assembly line running botactions
          // in a chain but it's still an assembly line, and without changing anything, you can use this
          // to still work with the `pipeValue` of an AbortLineSignal, so a step-up from chain in terms of functionality but not quite pipe
          // with a flag to switch into pipe, which can be great for new dev's, to explore these concepts at their own pace, one step at a time
          if (actions.length === 1) {
            const chainActionResult = await actions[0](page, ...injects)

            // ignore the 1 case since then we would return the pipeValue, but chains..
            if (isAbortLineSignal(chainActionResult)) {
              return processAbortLineSignal(chainActionResult)
            }
          } else if (actions.length > 1) {
            return await chainRunner(...actions)(page, ...injects)
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
  (actionOrActions: BotAction<PipeValue> | BotAction<PipeValue>[]): BotAction<PipeValue|undefined|AbortLineSignal> =>
    async(page, ...injects) => {
      if (Array.isArray(actionOrActions)) {
        // pipe handles AbortLineSignal for itself and therefore we don't need to evaluate the signal here just return it
        return await pipe()(...actionOrActions)(page, ...injects)
      } else {
        const singleActionResult = await actionOrActions(page, ...pipeInjects(injects)) // simulate pipe

        if (isAbortLineSignal(singleActionResult)) {
          return processAbortLineSignal(singleActionResult)
        } else {
          return singleActionResult
        }
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
  (...actions: BotAction<void|AbortLineSignal>[]): BotAction<void|AbortLineSignal|PipeValue> =>
    async(page, ...injects) => {
      let returnValue: any
      for(const action of actions) {
        returnValue = await action(page, ...injects)

        if (isAbortLineSignal(returnValue)) {
          return processAbortLineSignal(returnValue)
        }
      }
    }

/**
 * @description    Runs all actions provided in a pipe
 *                 Does not have checks/safety fall backs/optimizations, etc, so please be careful with using this. Instead consider pipe()()
 * @param actions 
 */  
export const pipeRunner = 
  (...actions: BotAction<PipeValue|void|AbortLineSignal>[]): BotAction<PipeValue|AbortLineSignal|undefined> =>
    async(page, ...injects) => {
      // Possible for last inject to be the piped value
      let pipeObject: Pipe = createEmptyPipe()

      // in case we are used in a chain, injects won't have a pipe at the end
      if (injectsHavePipe(injects)) {
        pipeObject = getInjectsPipeOrEmptyPipe(injects)
        injects = injects.slice(0, injects.length - 1)
      }

      // let piped // pipe's are closed chain-links, so nothing pipeable comes in, so data is grabbed in a pipe and shared down stream a pipe, and returns
      for(const action of actions) {
        const nextPipeValueOrUndefined: AbortLineSignal|PipeValue|void = await action(page, ...injects, pipeObject) // typing.. botaction's async return can be void, but given how promises must resolve(), the value is actually undefined

        if (isAbortLineSignal(nextPipeValueOrUndefined)) {
          return processAbortLineSignal(nextPipeValueOrUndefined)
        }

        // Bot Actions return the value removed from the pipe, and BotActionsPipe wraps it for injecting
        pipeObject = wrapValueInPipe(nextPipeValueOrUndefined as PipeValue|undefined)
      }

      return pipeObject.value
    }    