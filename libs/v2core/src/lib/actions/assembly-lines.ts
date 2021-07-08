import { Page } from "puppeteer"

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
import { isCasesSignal, CasesSignal } from "../types/cases"

/**
 * @description     chain() BotAction for running a chain of BotAction's safely and optimized
 *                  If it receives a Pipe in the injects, it will strip it out. It does not return values.
 * @param actions
 */
export const chain =
  <I extends {} = {}>(...actions: BotAction<I>[]): BotAction<I> =>
    async(injects: I) => {
      if(actions.length === 1) {
        const returnValue = await actions[0](injects)

        if (isAbortLineSignal(returnValue)) {
          return processAbortLineSignal(returnValue)
        }
      } else {
        const returnValue = await chainRunner(...actions)(injects)

        if (isAbortLineSignal(returnValue)) {
          return processAbortLineSignal(returnValue)
        }
      }
    }

/**
 * @description    Higher Order BotAction for running a sequence of BotAction's with piping
 *                 valueToPipe overwrites the passed in Pipe value
 * @param valueToPipe
 */
// export const pipe =
//   (valueToPipe?: PipeValue) =>
//     (...actions: BotAction<PipeValue|AbortLineSignal|void>[]): BotAction<any> =>
//       async(page, ...injects) => {
//         if (injectsHavePipe(injects)) {
//           if (actions.length === 0) {return undefined}
//           if (actions.length === 1) {
//             let returnValue: PipeValue|AbortLineSignal|void
//             if (valueToPipe) {
//               returnValue = await actions[0](page, ...injects.splice(0, injects.length - 1), wrapValueInPipe(valueToPipe))
//             } else {
//               returnValue = await actions[0](page, ...injects)
//             }

//             if (isAbortLineSignal(returnValue)) {
//               return processAbortLineSignal(returnValue)
//             } else {
//               return returnValue
//             }
//           } else {
//             // injects only have a pipe when its ran inside a pipe, so lets return our value to flow with the pipe mechanics
//             if (valueToPipe) {
//               return pipeRunner(...actions)(page, ...injects.splice(0, injects.length - 1), wrapValueInPipe(valueToPipe))
//             } else {
//               return pipeRunner(...actions)(page, ...injects)
//             }
//           }
//         } else {
//           // injects don't have a pipe, so add one
//           if (actions.length === 0) {return undefined}
//           if (actions.length === 1) {
//             const returnValue = await actions[0](page, ...injects, wrapValueInPipe(valueToPipe))

//             if (isAbortLineSignal(returnValue)) {
//               return processAbortLineSignal(returnValue)
//             } else {
//               return returnValue
//             }
//           } else {
//             return pipeRunner(...actions)(page, ...injects, wrapValueInPipe(valueToPipe))
//           }
//         }
//       }

/**
 * switchPipe is similar to Pipe in that is supports piping, EXCEPT every assembled BotAction gets the same pipe object
 * Before each assembled BotAction is ran, the pipe is switched back to whatever is set `toPipe`
 * `toPipe` is optional and can be provided by an injected pipe object value (if nothing provided, default is undefined)
 *
 *  AbortLineSignal default abort(1) is ignored until a CasesSignal is returned by an assembled BotAction, marking that at least one Case has ran
 *    to break that, you can abort(2+)
 *  This is to support the classic switch/case/break flow where its switchPipe/pipeCase/abort
 *    Therefore, if a pipeCase() does run, its returning MatcheSignal will be recognized by switchPipe and then lower the required abort count by 1
 * @param toPipe BotAction to resolve and inject as a wrapped Pipe object in EACH assembled BotAction
 */
// export const switchPipe =
//   (toPipe?: PipeValue) =>
//     (...actions: BotAction<PipeValue|AbortLineSignal|CasesSignal|void>[]): BotAction<any[]|AbortLineSignal|PipeValue> =>
//       async(page, ...injects) => {
//         // fallback is injects pipe value
//         if (!toPipe) {
//           toPipe = getInjectsPipeValue(injects)
//         }

//         // remove pipe from injects if there is one to set the one for all actions
//         if (injectsHavePipe(injects)) {
//           injects = injects.slice(0, injects.length - 1)
//         }

//         // inject toPipe wrapped in a pipe object
//         injects.push(wrapValueInPipe(toPipe))

//         // run the assembled BotAction's with the same Pipe object
//         let hasAtLeastOneCaseMatch = false
//         const actionsResults = []

//         for(const action of actions) {
//           let resolvedActionResult = await action(page, ...injects)

//           // resolvedActionResult can be of 3 things
//           // 1. CasesSignal 2. AbortLineSignal 3. PipeValue
//           // switchPipe will return (if not aborted) an array of all the resolved results of each BotAction assembled in the switchPipe()() 2nd call
//           if (isCasesSignal(resolvedActionResult) && resolvedActionResult.conditionPass) {
//             hasAtLeastOneCaseMatch = true
//             actionsResults.push(resolvedActionResult)
//           } else if (isAbortLineSignal(resolvedActionResult)) {
//             // infinity signal breaks function, and returns upward
//             if (resolvedActionResult.assembledLines === 0) {
//               return resolvedActionResult
//             }

//             // if no case matches, reduce abortLineSignal.assembledLines count by 1
//             // to prevent aborting without a case match ie abort(1)
//             if (!hasAtLeastOneCaseMatch) {
//               resolvedActionResult = processAbortLineSignal(resolvedActionResult)
//             }

//             // switchPipe abort behavior
//             if (!isAbortLineSignal(resolvedActionResult)) {
//               // special case of "0" where the assembledLines was processed from 1->0 which returns the pipeValue
//               // don't break the line, simply append abortLineSignal.pipeValue to array
//               actionsResults.push(resolvedActionResult)
//             } else if (resolvedActionResult.assembledLines === 1) {
//               actionsResults.push(resolvedActionResult.pipeValue)
//               return actionsResults
//             } else {
//               // assembledLines 2+ - breaks line and breaks returning array functionality
//               // hence returned a processed abort line signal
//               return processAbortLineSignal(resolvedActionResult)
//             }
//           } else {
//             // normal BotAction so add the result to the array to return later
//             actionsResults.push(resolvedActionResult)
//           }

//         }

//         return actionsResults
//       }

/**
 * @description   Efficiently run actions in a pipe or a chain by detecting if `value` is injected with a value (intead of undefined)
 *                  Runs in pipe()() if `value` set else runs it in a chain()
 *                Can override that behavior, to force running in a pipe, by setting `forceInPipe` to true
 * @param forceInPipe boolean default is FALSE
 */
export const assemblyLine =
  <I extends {value?: PipeValue} = {}>(forceInPipe: boolean = false) =>
    (...actions: BotAction<I>[]): BotAction<I> =>
      async(injects: I) => {
        if (injects.value) {
          // running a pipe
          if (actions.length === 0) {return undefined}
          else if (actions.length === 1) {
            const pipeActionResult = await actions[0](injects)

            if (isAbortLineSignal(pipeActionResult)) {
              return processAbortLineSignal(pipeActionResult)
            } else {
              return pipeActionResult
            }
          } else {
            return pipeRunner(...actions)(injects)
          }
        } else {
          // while chains dont return pipeValues, this is an assembly line running botactions
          // in a chain but it's still an assembly line, and without changing anything, you can use this
          // to still work with the `pipeValue` of an AbortLineSignal, so a step-up from chain in terms of functionality but not quite pipe
          // with a flag to switch into pipe, which can be great for new dev's, to explore these concepts at their own pace, one step at a time
          if (actions.length === 1) {
            const chainActionResult = await actions[0](injects)

            // ignore the 1 case since then we would return the pipeValue, but chains..
            if (isAbortLineSignal(chainActionResult)) {
              return processAbortLineSignal(chainActionResult)
            }
          } else if (actions.length > 1) {
            return chainRunner(...actions)(injects)
          }
        }
      }

/**
 * @description   For a particular utility BotAction that doesn't know whether it's receiving an array (not spread!) of BotActions or just 1 BotAction
 *                Can be helpful for advanced BotAction's that use a callback function as a param to return BotAction(s) for running in some new context
 * @example       See forAll()()
 * @param actionOrActions Botaction<PipeValue> | BotAction<PipeValue>[]
 */
// export const pipeActionOrActions =
//   (actionOrActions: BotAction<PipeValue> | BotAction<PipeValue>[]): BotAction<PipeValue|undefined|AbortLineSignal> =>
//     async(page, ...injects) => {
//       if (Array.isArray(actionOrActions)) {
//         // pipe handles AbortLineSignal for itself and therefore we don't need to evaluate the signal here just return it
//         return pipe()(...actionOrActions)(page, ...injects)
//       } else {
//         const singleActionResult = await actionOrActions(page, ...pipeInjects(injects)) // simulate pipe

//         if (isAbortLineSignal(singleActionResult)) {
//           return processAbortLineSignal(singleActionResult)
//         } else {
//           return singleActionResult
//         }
//       }
//     }

//
// Avoid using the following BotAction's, unless you know what you're doing
//

/**
 * @description    Runs all actions provided in a chain
 *                 Does not have checks/safety fall backs/optimizations, etc, so please be careful with using this. Instead consider chain()()
 * @param actions
 */
export const chainRunner =
  <I extends {} = {}>(...actions: BotAction<I>[]): BotAction<I> =>
    async(injects: I) => {
      let returnValue: any
      for(const action of actions) {
        returnValue = await action(injects)

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
  <I extends {value?: PipeValue} = {}>(...actions: BotAction<I>[]): BotAction<I> =>
    async(injects) => {
      // possible injects has no `value`
      let injectsWithPipeValue = {value: undefined}
      if (injects['value']) {
        // add it if it does
        injectsWithPipeValue.value = injects['value']
      }

      for(const action of actions) {
        const value: AbortLineSignal|PipeValue|void = await action({...injects, ...injectsWithPipeValue})

        if (isAbortLineSignal(value)) {
          return processAbortLineSignal(value)
        }

        // Bot Actions return the value removed from the pipe, and BotActionsPipe wraps it into injects
        injectsWithPipeValue = { value }
      }

      return injectsWithPipeValue.value
    }
