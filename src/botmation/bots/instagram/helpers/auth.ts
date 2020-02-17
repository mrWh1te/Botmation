import { Page } from 'puppeteer'

import { goTo } from 'botmation/actions/navigation'
import { BotOptions } from 'botmation/interfaces/bot-options.interfaces'
import { ConditionalBotAction } from 'botmation/interfaces'

import { getInstagramLoginUrl } from './urls'

/**
 * @description    async condition function that resolves TRUE/FALSE depending on user auth
 *                 Used in higher order Bot Action's like givenThat()() or doWhile()()
 * @future         Go into the data, directly, and grab from the database, IndexedDB (redux). There is no data if guest
 * @param page 
 * @param options 
 */
export const isLoggedIn: ConditionalBotAction = async(page: Page, options: BotOptions): Promise<boolean> => {
  // Go to the login page
  await goTo(getInstagramLoginUrl())(page, options)
  
  // if you're logged in, Instagram would have redirected you to the feed
  // if you were a guest, logged out, you would be on the Instagram Login URL
  return page.url() !== getInstagramLoginUrl()
}

/**
 * @description    async condition function that resolves TRUE/FALSE depending on user auth
 *                 Used in higher order Bot Action's like givenThat()() or doWhile()()
 * @param page 
 * @param options 
 */
export const isGuest: ConditionalBotAction = async(page: Page, options: BotOptions): Promise<boolean> =>
  !(await isLoggedIn(page, options))
