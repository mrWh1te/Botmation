import puppeteer from 'puppeteer'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'

/**
 * @description   Actions() method Factory that will inject the active tab for the BotAction's to operate on
 *                Separated out for future composable actions where an action is a chain of Actions
 * @example       see `login()` under `./src/bots/instagram/auth.ts`
 * @param tab 
 */
export const BotActionsChainFactory = (tab: puppeteer.Page) => async (...actions: BotAction[]): Promise<void> => {
  return actions.reduce(async(chain, action) => {
    // Resolve the last returned promise
    await chain
    // Inject the active page into the BotAction, for it to operate on
    return action(tab)
  }, Promise.resolve())
}