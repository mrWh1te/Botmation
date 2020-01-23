import puppeteer from 'puppeteer'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'

/**
 * @description   Actions() method Factory that will inject the active tab for the BotAction's to operate on
 *                Separated out for future complex composable actions like ifThen(conditional, thenExpression)
 *                  where the tab is injected, and the if can run with that available in checking for awaited boolean
 *                    on awaited boolean true, run await thenExpression() -> missing arguments? WIP concept
 *                Ideally, the thenExpression is another BotAction, so you can it give it a promise as a conditional for a boolean
 *                  to run against the tab, before letting a particular BotAction running
 * 
 *                Be nice to support a list of Actions...... hence the factory separation, as it may get reused there
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