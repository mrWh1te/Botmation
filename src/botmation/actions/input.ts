import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-action.interfaces'

/**
 * @description   Manually left-click an HTML element on the page given the provided HTML selector
 * @param selector 
 */
export const click = (selector: string): BotAction => async(page: Page) =>
  await page.click(selector)

/**
 * @description   Using the keyboard, type the `copy` provided. 
 *                Recommended you click a form input or something that can have keyboard typing by a user
 * @param copy 
 */
export const type = (copy: string): BotAction => async(page: Page) =>
  await page.keyboard.type(copy)