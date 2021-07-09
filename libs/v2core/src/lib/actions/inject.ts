import { Action } from "../interfaces"
import { injects } from "../types"
import { PipeValue } from "../types/pipe-value"
import { assemblyLine } from "./assembly-lines"

/**
 * @description    Higher-order to set the first few injects for wrapped BotAction's
 * @note           If you need the injects to run as a pipe, wrap injects in pipe()() otherwise assemblyLine()() will run it as a chain
 */
export const inject =
  (newInjects: injects) =>
    (...actions: Action[]): Action =>
      async(injects: injects = {}) =>
        await assemblyLine()(...actions)({...injects, ...newInjects})

/**
 * Create a line of BotActions with upserted injected with key of Higher-Order param and return value of final BotAction provided in the first line (second line of actions is ran after with updated injects)
 * @param injectKey ie `page`
 */
export const upsertInject =
  (injectKey: string) =>
    (...actionsToGetNewInjectValue: Action[]) =>
      (...actionsWithUpsertedInject: Action<injects & {[injectKey: string]: PipeValue}>[]):Action =>
        async(injects: injects = {}) => {
          const newInjectValue = await assemblyLine()(...actionsToGetNewInjectValue)(injects)
          return await assemblyLine()(...actionsWithUpsertedInject)({...injects, [injectKey]: newInjectValue})
        }
