import puppeteer from 'puppeteer'

import { BotAction } from '../interfaces/bot-action.interfaces'

/**
 * @description   Pipeable methods for crawling/interacting with the main feed page in Instagram
 * @param usernames
 */

/**
 * @description   Favorite all published photos from these usernames
 * @param usernames 
 */
export const favoriteAllFrom = (...usernames: string[]): BotAction => async(tab: puppeteer.Page) => {
  console.log(`favorite all from ${usernames.join(', ')}`)
}