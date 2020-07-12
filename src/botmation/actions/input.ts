import { BotAction } from '../interfaces/bot-actions.interfaces'

/**
 * @description   Manually left-click an HTML element on the page given the provided HTML selector
 * @param selector 
 */
export const click = (selector: string): BotAction => async(page) =>
  await page.click(selector)

/**
 * @description   Focus an HTML element
 * @param selector 
 * @alpha 
 * @TODO Test this
 */
export const focus = (selector: string): BotAction => async(page) =>
  await page.focus(selector)

/**
 * @description   Using the keyboard, type the `copy` provided. 
 *                Recommended you click a form input or something that can have keyboard typing by a user
 * @param copy 
 */
export const type = (copy: string): BotAction => async(page) =>
  await page.keyboard.type(copy)