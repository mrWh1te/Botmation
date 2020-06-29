import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-action.interfaces'
import { BotOptions } from '../interfaces/bot-options.interfaces'
import { getDefaultBotOptions } from '../helpers/bot-options'

/**
 * @description   Similar to BotActionsChainFactory except the output of BotPipeAction's are provided as input for subsequent BotPipeAction's
 *                This can be used within a regular BotActionsChain like forAsLong(reading feed)(pipe the feed data through these special actions)
 * 
 * @note          Since core library code has yet to take advantage of `injects`, it is being omitted here, otherwise the `BotPipeAction` could become more complicated than necessary
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