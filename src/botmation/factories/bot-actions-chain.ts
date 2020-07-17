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
    async (...actions: BotAction<void>[]): Promise<void> => {
      // let piped // pipe's are closed chain-links, so nothing pipeable comes in, so data is grabbed in a pipe and shared down stream a pipe, and returns
      try {
        for(const action of actions) {
          await action(page, ...injects) // if action doesn't return anything, is this value === undefined !?!?!?! TODO test this
        }
      } catch(error) {
        logError(' -- ChainCaughtError -- ')
        logError(error)
      }
    }