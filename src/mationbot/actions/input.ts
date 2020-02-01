import { Page } from 'puppeteer'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'

/**
 * @description   Manually click an element on the page based on the query selector provided
 * @param selector 
 */
export const click = (selector: string): BotAction => async(page: Page) =>
  await page.click(selector)

/**
 * @description   Using the keyboard, being typing. It's best that you focus/click a form input element 1st, or something similar
 * @param copy 
 */
export const type = (copy: string): BotAction => async(page: Page) =>
  await page.keyboard.type(copy)