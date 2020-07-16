import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { BotActionsChain } from '../factories/bot-actions-chain'

/**
 * 
 * @param page 
 * @param actionOrActions 
 */
export const applyBotActionOrActions = async(page: Page, actionOrActions: BotAction[] | BotAction, ...injects: any[]) => {
  if (Array.isArray(actionOrActions)) {
    await BotActionsChain(page, ...injects)(...actionOrActions)
  } else {
    await BotActionsChain(page, ...injects)(actionOrActions)
  }
}