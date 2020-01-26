/**
 * @description   Delay execution of next line by X milliseconds, promisified so you can await a setTimeout call
 * @param milliseconds 
 */
// TODO: move outside of mationbot class
export const sleep = async(milliseconds: number): Promise<any> => 
  new Promise(resolve => setTimeout(resolve, milliseconds))





import puppeteer from 'puppeteer'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'
import { BotActionsChainFactory } from '@mationbot/factories/bot-actions-chain.factory'

/**
 * 
 * @param tab 
 * @param actions 
 */
export const applyBotActionOrActions = async(tab: puppeteer.Page, actions: BotAction[] | BotAction) => {
  if (Array.isArray(actions)) {
    await BotActionsChainFactory(tab)(...actions)
  } else {
    await BotActionsChainFactory(tab)(actions)
  }
}