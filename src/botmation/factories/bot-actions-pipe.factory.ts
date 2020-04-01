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
export const BotActionsPipeFactory = (page: Page, overloadOptions: Partial<BotOptions> = {}) => async (...actions: BotAction[]): Promise<void> =>
  actions.reduce(
    async(previousAction, nextAction) => {
      // Resolve the last returned promise, to provide in the next action, making a pipe of resolved promises, passing data along
      const resolvedValue = await previousAction

      // Inject the Puppeteer page into the BotAction, and options (with safe defaults in case none provided), and previous action's resolve value
      return nextAction(page, getDefaultBotOptions(overloadOptions), resolvedValue)
    }, 
    Promise.resolve()
  )