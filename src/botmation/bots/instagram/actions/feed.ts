import { Page } from 'puppeteer'

import { BotAction } from '../../../interfaces/bot-action.interfaces'

/**
 * TODO: implement, use doWhile(scrolling feed)(like posts) until we can't scroll anymore (NO, found bottom of page, that message that there are no more new posts)
 * @description   Favorite all published photos from these usernames
 * @param usernames 
 */
export const favoriteAllFrom = (...usernames: string[]): BotAction => async(page: Page) => {
  console.log(`favorite all from ${usernames.join(', ')}`)
}
