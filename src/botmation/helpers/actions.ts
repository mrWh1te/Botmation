import { Page } from 'puppeteer'

import { BotAction5 } from '../interfaces/bot-actions.interfaces'
import { BotActionsChainFactory } from '../factories/bot-actions-chain.factory'

/**
 * 
 * @param page 
 * @param actions 
 */
export const applyBotActionOrActions = async(page: Page, actions: BotAction5[] | BotAction5, ...injects: any[]) => {
  if (Array.isArray(actions)) {
    await BotActionsChainFactory(page, ...injects)(...actions)
  } else {
    await BotActionsChainFactory(page, ...injects)(actions)
  }
}