import { Page } from 'puppeteer'

import { BotAction5 } from '../interfaces/bot-actions.interfaces'

/**
 * @description   Botmation.actions() method comes from this Factory
 *                It provides an interface to inject the Puppeteer Page instance for the BotAction's to operate on
 *                Can be reused in building separate chains of bot actions as a single BotAction
 * @example       see `login()` under `./src/bots/instagram/actions/auth.ts`
 * @param page 
 */
export const BotActionsChainFactory = 
  (page: Page, ...injects: any[]) => 
    async (...actions: BotAction5[]): Promise<void> =>
      actions.reduce(
        async(chain, action) => {
          // Resolve the last returned promise, making a chain of resolved promises
          await chain
          
          // Inject the Puppeteer page into the BotAction, and options (with safe defaults in case none provided), and injects for further needs
          return action(page, ...injects)
        }, 
        Promise.resolve()
      )