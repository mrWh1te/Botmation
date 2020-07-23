import { BotAction } from '../interfaces/bot-actions'

/**
 * @description   Manually left-click an HTML element on the page given the provided HTML selector
 * @param selector 
 */
export const click = (selector: string): BotAction => async(page) =>
  await page.click(selector)

/**
 * @description   Focus an HTML element given the provided HTML selector
 * @param selector
 */
export const focus = (selector: string): BotAction => async(page) =>
  await page.focus(selector)

/**
 * @description   Types the `copy` provided with a "keyboard"
 *                Can be used to fill text based form fields
 * @param copy 
 */
export const type = (copy: string): BotAction => async(page) =>
  await page.keyboard.type(copy)