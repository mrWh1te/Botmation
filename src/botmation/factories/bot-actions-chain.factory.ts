import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-action.interfaces'
import { BotOptions } from '../interfaces/bot-options.interfaces'
import { getDefaultBotOptions } from '../helpers/bot-options'

/**
 * @description   Actions() method Factory that will inject the active tab for the BotAction's to operate on
 *                Separated out for future composable actions where an action is a chain of Actions
 * @example       see `login()` under `./src/bots/instagram/auth.ts`
 * @param page 
 */
export const BotActionsChainFactory = (page: Page, overloadOptions: Partial<BotOptions> = {}, ...injects: any[]) => async (...actions: BotAction[]): Promise<void> =>
  actions.reduce(
    async(chain, action) => {
      // Resolve the last returned promise
      await chain
      // Inject the active page into the BotAction, for it to operate on
      return action(page, getDefaultBotOptions(overloadOptions), ...injects)
    }, 
    Promise.resolve()
  )