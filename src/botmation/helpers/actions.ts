import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { pipe } from 'botmation/actions/assembly-line'

/**
 * 
 * @param page 
 * @param actionOrActions 
 */
export const applyBotActionOrActions = async(page: Page, actionOrActions: BotAction[] | BotAction, ...injects: any[]) => {
  if (Array.isArray(actionOrActions)) {
    await pipe()(...actionOrActions)(page, ...injects)
  } else {
    await pipe()(actionOrActions)(page, ...injects)
  }
}

// for the time being, utility botaction's like forAll, givenThat don't return values, which makes them fit in chains but they can't either
// maybe one day that will change, come need