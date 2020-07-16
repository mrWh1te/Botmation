import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { BotActionsChainFactory } from '../factories/bot-actions-chain.factory'

/**
 * 
 * @param page 
 * @param actions 
 */
export const applyBotActionOrActions = async(page: Page, actions: BotAction[] | BotAction, ...injects: any[]) => {
  if (Array.isArray(actions)) {
    await BotActionsChainFactory(page, ...injects)(...actions)
  } else {
    await BotActionsChainFactory(page, ...injects)(actions)
  }
}