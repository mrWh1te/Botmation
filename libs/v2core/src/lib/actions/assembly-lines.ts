import { Action } from "../interfaces"
import {
  getInjectsPipeValue
} from "../helpers/pipe"
import { PipeValue } from "../types/pipe-value"
import { AbortLineSignal, isAbortLineSignal } from "../types/abort-line-signal"
import { processAbortLineSignal } from "../helpers/abort"
import { isCasesSignal } from "../types/cases"
import { Injects, InjectValue } from "../types"

/**
 * @description     chain() Action for running a chain of Action's safely and optimized
 *                  If it receives a Pipe in the injects, it will strip it out. It does not return values.
 * @param actions
 */
export const chain =
  (...actions: Action[]): Action =>
    async(injects) => {
      if (actions.length === 0) {
        return undefined
      }

      if(actions.length === 1) {
        const returnValue = await actions[0](injects)

        if (isAbortLineSignal(returnValue)) {
          return processAbortLineSignal(returnValue)
        }

        return returnValue
      }

      const returnValue = await chainRunner(...actions)(injects)
      if (isAbortLineSignal(returnValue)) {
        return processAbortLineSignal(returnValue)
      }

      return returnValue
    }

/**
 * @description    Higher Order Action for running a sequence of Action's with piping
 *                 valueToPipe overwrites the passed in Pipe value
 * @param valueToPipe
 */
export const pipe =
  <I extends Injects = {}, R extends PipeValue|AbortLineSignal|void = void>(valueToPipe?: PipeValue) =>
    (...actions: Action<InjectValue & I>[]): Action<Partial<InjectValue> & I, R> =>
      async(injects) => {
        if (injects.value) {
          if (actions.length === 0) {
            return undefined
          }

          if (actions.length === 1) {
            let returnValue
            if (valueToPipe) {
              returnValue = await actions[0]({...injects, value: valueToPipe})
            } else {
              returnValue = await actions[0]({value: undefined, ...injects})
            }

            if (isAbortLineSignal(returnValue)) {
              return processAbortLineSignal(returnValue)
            } else {
              return returnValue
            }
          } else {
            // injects only have a pipe when its ran inside a pipe, so lets return our value to flow with the pipe mechanics
            if (valueToPipe) {
              return pipeRunner(...actions)({...injects, value: valueToPipe})
            } else {
              return pipeRunner(...actions)({value: undefined, ...injects})
            }
          }
        } else {
          // injects don't have a pipe, so add one
          if (actions.length === 0) {return undefined}
          if (actions.length === 1) {
            const returnValue = await actions[0]({value: undefined, ...injects})

            if (isAbortLineSignal(returnValue)) {
              return processAbortLineSignal(returnValue)
            } else {
              return returnValue
            }
          } else {
            return pipeRunner(...actions)({value: undefined, ...injects})
          }
        }
      }

/**
 * switchPipe is similar to Pipe in that is supports piping, EXCEPT every assembled Action gets the same pipe object
 * Before each assembled Action is ran, the pipe is switched back to whatever is set `toPipe`
 * `toPipe` is optional and can be provided by an injected pipe object value (if nothing provided, default is undefined)
 *
 *  AbortLineSignal default abort(1) is ignored until a CasesSignal is returned by an assembled Action, marking that at least one Case has ran
 *    to break that, you can abort(2+)
 *  This is to support the classic switch/case/break flow where its switchPipe/pipeCase/abort
 *    Therefore, if a pipeCase() does run, its returning MatcheSignal will be recognized by switchPipe and then lower the required abort count by 1
 * @param pipeValue Action to resolve and inject as a wrapped Pipe object in EACH assembled Action
 */
export const switchPipe =
  (pipeValue?: PipeValue) =>
    (...actions: Action[]): Action<Partial<InjectValue>> =>
      async(injects) => {
        // fallback is injects pipe value
        if (!pipeValue) {
          pipeValue = getInjectsPipeValue(injects)
        }

        // run the assembled Action's with the same Pipe object
        let hasAtLeastOneCaseMatch = false
        const actionsResults = []

        for(const action of actions) {
          let resolvedActionResult = await action(injects)

          // resolvedActionResult can be of 3 things
          // 1. CasesSignal 2. AbortLineSignal 3. PipeValue
          // switchPipe will return (if not aborted) an array of all the resolved results of each Action assembled in the switchPipe()() 2nd call
          if (isCasesSignal(resolvedActionResult) && resolvedActionResult.conditionPass) {
            hasAtLeastOneCaseMatch = true
            actionsResults.push(resolvedActionResult)
          } else if (isAbortLineSignal(resolvedActionResult)) {
            // infinity signal breaks function, and returns upward
            if (resolvedActionResult.assembledLines === 0) {
              return resolvedActionResult
            }

            // if no case matches, reduce abortLineSignal.assembledLines count by 1
            // to prevent aborting without a case match ie abort(1)
            if (!hasAtLeastOneCaseMatch) {
              resolvedActionResult = processAbortLineSignal(resolvedActionResult)
            }

            // switchPipe abort behavior
            if (!isAbortLineSignal(resolvedActionResult)) {
              // special case of "0" where the assembledLines was processed from 1->0 which returns the pipeValue
              // don't break the line, simply append abortLineSignal.pipeValue to array
              actionsResults.push(resolvedActionResult)
            } else if (resolvedActionResult.assembledLines === 1) {
              actionsResults.push(resolvedActionResult.pipeValue)
              return actionsResults
            } else {
              // assembledLines 2+ - breaks line and breaks returning array functionality
              // hence returned a processed abort line signal
              return processAbortLineSignal(resolvedActionResult)
            }
          } else {
            // normal Action so add the result to the array to return later
            actionsResults.push(resolvedActionResult)
          }

        }

        return actionsResults
      }

/**
 * @description   Efficiently run actions in a pipe or a chain by detecting if `value` is injected with a value (intead of undefined)
 *                  Runs in pipe()() if `value` set else runs it in a chain()
 *                Can override that behavior, to force running in a pipe, by setting `forceInPipe` to true
 * @param forceInPipe boolean default is FALSE
 */
export const assemblyLine =
  (forceInPipe: boolean = false) =>
    (...actions: Action[]): Action =>
      async(injects: Partial<InjectValue> = {}) => {
        if (injects.value || forceInPipe) {
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
          if (actions.length === 1) {
            const chainActionResult = await actions[0](injects)

            if (isAbortLineSignal(chainActionResult)) {
              return processAbortLineSignal(chainActionResult)
            }

            return chainActionResult // NEW chains return last Action's return value
          } else if (actions.length > 1) {
            return chainRunner(...actions)(injects)
          } else {
            return undefined
          }
        }
      }

/**
 * @description   For a particular utility Action that doesn't know whether it's receiving an array (not spread!) of Actions or just 1 Action
 *                Can be helpful for advanced Action's that use a callback function as a param to return Action(s) for running in some new context
 * @example       See forAll()()
 * @param actionOrActions action | Action[]
 */
export const pipeActionOrActions =
  (actionOrActions: Action | Action[]): Action<Partial<InjectValue>> =>
    async(injects) => {
      if (Array.isArray(actionOrActions)) {
        // pipe handles AbortLineSignal for itself and therefore we don't need to evaluate the signal here just return it
        return pipe()(...actionOrActions)(injects)
      } else {
        const singleActionResult = await actionOrActions(injects)

        if (isAbortLineSignal(singleActionResult)) {
          return processAbortLineSignal(singleActionResult)
        } else {
          return singleActionResult
        }
      }
    }

//
// Avoid using the following Action's, unless you know what you're doing
//

/**
 * @description    Runs all actions provided in a chain
 *                 Does not have checks/safety fall backs/optimizations, etc, so please be careful with using this. Instead consider chain()()
 * @param actions
 */
export const chainRunner =
  <I extends {} = {}>(...actions: Action<I>[]): Action<I> =>
    async(injects: I) => {
      let returnValue: any
      for(const action of actions) {
        returnValue = await action(injects)

        if (isAbortLineSignal(returnValue)) {
          return processAbortLineSignal(returnValue)
        }

      }
      return returnValue
    }

/**
 * @description    Runs all actions provided in a pipe
 *                 Does not have checks/safety fall backs/optimizations, etc, so please be careful with using this. Instead consider pipe()()
 * @param actions
 */
export const pipeRunner =
  (...actions: Action<InjectValue>[]): Action<Partial<InjectValue>> =>
    async(injects) => {
      // possible injects has no `value`
      let injectsWithPipeValue = {value: undefined}
      if (injects['value']) {
        // add it if it does
        injectsWithPipeValue.value = injects['value']
      }

      for(const action of actions) {
        const value = await action({...injects, ...injectsWithPipeValue})

        if (isAbortLineSignal(value)) {
          return processAbortLineSignal(value)
        }

        // Bot Actions return the value removed from the pipe, and ActionsPipe wraps it into injects
        injectsWithPipeValue = { value }
      }

      return injectsWithPipeValue.value
    }
