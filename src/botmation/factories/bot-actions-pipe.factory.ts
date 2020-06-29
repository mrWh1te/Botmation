import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-action.interfaces'
import { BotOptions } from '../interfaces/bot-options.interfaces'
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
  <T>(page: Page, overloadOptions: Partial<BotOptions> = {}, ...injects: any[]) => 
    async (...actions: BotAction<any>[]): Promise<T> => {
      let previousActionResolvedValue

      for(const action of actions) {
        let nextActionInjects

        if (previousActionResolvedValue) {
          nextActionInjects = [...injects, previousActionResolvedValue]
        } else {
          nextActionInjects = [...injects]
        }

        previousActionResolvedValue = await action(page, getDefaultBotOptions(overloadOptions), ...nextActionInjects)
      }

      return previousActionResolvedValue
    }