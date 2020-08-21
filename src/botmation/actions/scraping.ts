import { BotAction } from '../interfaces/bot-actions'

/**
 * Returns the first Element that matches the provided HTML Selector
 * @param htmlSelector 
 */
export const $ = (htmlSelector: string): BotAction<Element> => 
  async(page) => 
    await page.evaluate((htmlSelector: string) => document.querySelector(htmlSelector), htmlSelector)
  
/**
 * Returns a NodeListOf Element's that match the provided HTML Selector
 * @param htmlSelector 
 */
export const $$ = (htmlSelector: string): BotAction<NodeListOf<Element>> => 
  async(page) => 
    await page.evaluate((htmlSelector: string) => document.querySelectorAll(htmlSelector), htmlSelector)