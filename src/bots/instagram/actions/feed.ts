import { Page } from 'puppeteer'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'

/**
 * @description   Pipeable methods for crawling/interacting with the main feed page in Instagram
 * @param usernames
 */

/**
 * @description   Favorite all published photos from these usernames
 * @param usernames 
 */
export const favoriteAllFrom = (...usernames: string[]): BotAction => async(tab: Page) => {
  console.log(`favorite all from ${usernames.join(', ')}`)
}
