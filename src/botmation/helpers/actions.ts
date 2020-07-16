import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { BotActionsChain } from '../factories/bot-actions-chain'

/**
 * 
 * @param page 
 * @param actions 
 */
export const applyBotActionOrActions = async(page: Page, actions: BotAction[] | BotAction, ...injects: any[]) => {
  if (Array.isArray(actions)) {
    await BotActionsChain(page, ...injects)(...actions)
  } else {
    await BotActionsChain(page, ...injects)(actions)
  }
}