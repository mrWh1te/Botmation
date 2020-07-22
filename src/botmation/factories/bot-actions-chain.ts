import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions'

/**
 * @description   Botmation.actions() method comes from this Factory
 *                It provides an interface to inject the Puppeteer Page instance for the BotAction's to operate on
 *                Can be reused in building separate chains of bot actions as a single BotAction
 * @example       see `login()` under `./src/bots/instagram/actions/auth.ts`
 * @param page 
 * @deprecated    Will delete once tests are upgraded for chain()()
 */
export const BotActionsChain = 
  (page: Page, ...injects: any[]) => 
    async (...actions: BotAction[]): Promise<void> => {
      for(const action of actions) {
        await action(page, ...injects)
      }
    }