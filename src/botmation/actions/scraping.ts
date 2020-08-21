import { BotAction } from '../interfaces/bot-actions'

/**
 * 
 * @param htmlSelector 
 */
export const $ = (htmlSelector: string): BotAction<Element> => 
  async(page) => 
    page.evaluate((htmlSelector: string) => document.querySelector(htmlSelector), htmlSelector)
  
/**
 * 
 * @param htmlSelector 
 */
export const $$ = (htmlSelector: string): BotAction<NodeListOf<Element>> => 
  async(page) => 
    page.evaluate((htmlSelector: string) => document.querySelectorAll(htmlSelector), htmlSelector)