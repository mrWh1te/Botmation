import { Page } from 'puppeteer'

import { BotPipeAction, BotAction5 } from '../interfaces/bot-actions.interfaces'
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
    async (...actions: BotPipeAction<any, any>[]): Promise<R> => {
      let piped = undefined

      for(const action of actions) {
        piped = await action(page, piped, getDefaultBotOptions(overloadOptions), ...injects)
      }

      return piped
    }

//
// new gen
export const BotActionsPipeFactory5 = 
  <R = undefined, P = undefined>(page: Page, piped?: Piped<P>, overloadOptions: Partial<BotOptions> = {}, ...injects: any[]) => 
    async (...actions: BotAction5<any>[]): Promise<R> => {
      let piped = undefined

      for(const action of actions) {
        // if (action.pipeable) {
        //   piped = await action(page, piped, getDefaultBotOptions(overloadOptions), ...injects)
        // } else {
        //   piped = await action(page, getDefaultBotOptions(overloadOptions), ...injects)
        // }
        piped = await action(page, getDefaultBotOptions(overloadOptions), ...injects, piped)
      }

      return piped
    }