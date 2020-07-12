import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { BotActionsChainFactory } from '../factories/bot-actions-chain.factory'
import { BotOptions } from '../interfaces/bot-options.interfaces'

/**
 * 
 * @param page 
 * @param actions 
 */
export const applyBotActionOrActions = async(page: Page, options: BotOptions, actions: BotAction<any|void>[] | BotAction<any|void>, ...injects: any[]) => {
  if (Array.isArray(actions)) {
    await BotActionsChainFactory(page, options, ...injects)(...actions)
  } else {
    await BotActionsChainFactory(page, options, ...injects)(actions)
  }
}