import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'

/**
 * @description   Botmation.actions() method comes from this Factory
 *                It provides an interface to inject the Puppeteer Page instance for the BotAction's to operate on
 *                Can be reused in building separate chains of bot actions as a single BotAction
 * @example       see `login()` under `./src/bots/instagram/actions/auth.ts`
 * @param page 
 */
export const BotActionsChain = 
  (page: Page, ...injects: any[]) => 
    async (...actions: BotAction<void>[]): Promise<void> =>
      actions.reduce(
        async(chain, action) => {
          // Resolve the last returned promise, making a chain of resolved promises
          await chain
          
          // Provide the Puppeteer page into the BotAction, and any injects for further needs
          return action(page, ...injects)
        }, 
        Promise.resolve()
      )

      // todo will this return a value if the last action resolves to a value ? <- test