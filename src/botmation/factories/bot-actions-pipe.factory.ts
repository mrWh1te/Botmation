import { Page } from 'puppeteer'

import { BotAction5, BotAction } from '../interfaces/bot-actions.interfaces'
import { BotOptions } from '../interfaces/bot-options.interfaces'
import { Piped } from '../types/piped'
import { getDefaultBotOptions } from '../helpers/bot-options'

/**
 * @description   Similar to BotActionsChainFactory except the output of BotAction's are provided as input for subsequent BotAction's
 *                This can be used within a regular BotActionsChain like forAsLong(reading feed)(pipe the feed data through these special actions)
 * 
 *                Returned data of one botaction is appended to the end of the `injects` in the subsequent action
 *                Therefore, if a custom BotAction strongly types the injects, that isn't lost when used after another BotAction that returns a value
 * 
 * @param page    Puppeteer.Page
 */
export const BotActionsPipeFactory = 
  <R = undefined, P = undefined>(page: Page, piped?: Piped<P>, overloadOptions: Partial<BotOptions> = {}, ...injects: any[]) => 
    async (...actions: BotAction<any>[]): Promise<R> => {
      let piped = undefined

      for(const action of actions) {
        piped = await action(page, piped, getDefaultBotOptions(overloadOptions), ...injects)
      }

      return piped
    }

//
// new gen
//   should a pipe be a self-enclosed chain-link? Nothing goes in, nothing is returned?
//   we can create special botActions for plugging in data like tap() // which pipes whatever it's given to the next bot action
//
// if a pipe can return something and pass in stuff, then pipes can be "piped" in sequence..... is that good/bad?
//    could it create inner pipe depedencies in terms of sequence, etc ?
//
export const BotActionsPipeFactory5 = 
  <R = undefined, P = undefined>(page: Page, piped: any = undefined, ...injects: any[]) => // overloadOptions: Partial<BotOptions> = {}
    async (...actions: BotAction5<any>[]): Promise<any> => {

      // @TODO: !!!!!
      // HOW? do we distinguish between piped and injects in a factory call? Should we separate the two in this method signature? a more unique BotAction, but an async method, never the less

      // let piped // pipe's are closed chain-links, so nothing pipeable comes in, so data is grabbed in a pipe and shared down stream a pipe, and returns

      for(const action of actions) {
        // if (action.pipeable) {
        //   piped = await action(page, piped, getDefaultBotOptions(overloadOptions), ...injects)
        // } else {
        //   piped = await action(page, getDefaultBotOptions(overloadOptions), ...injects)
        // }
        piped = await action(page, ...injects, piped) // getDefaultBotOptions(overloadOptions), ..., piped
      }

      return piped // necessary for isGuest... (instagram helper auth func)
    }

    // maybe in actions factories, we flip the order of where the `piped` param is passed ? always assume it, with default undefined