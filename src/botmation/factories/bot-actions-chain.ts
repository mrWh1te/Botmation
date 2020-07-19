import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { logError } from 'botmation/helpers/console'

/**
 * @description   Botmation.actions() method comes from this Factory
 *                It provides an interface to inject the Puppeteer Page instance for the BotAction's to operate on
 *                Can be reused in building separate chains of bot actions as a single BotAction
 * @example       see `login()` under `./src/bots/instagram/actions/auth.ts`
 * @param page 
 */
export const BotActionsChain = 
  (page: Page, ...injects: any[]) => 
    async (...actions: BotAction[]): Promise<void> => {
      let actionCount = 1 // keep track of the action that ran for debugging errors

      try {
        for(const action of actions) {
          await action(page, ...injects)
          actionCount++
        }
      } catch(error) {
        logError(' -- ChainCaughtError in BotAction #' + actionCount + ' -- ')
        logError(error)
      }
    }