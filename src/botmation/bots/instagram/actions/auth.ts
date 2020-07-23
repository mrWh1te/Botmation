import { ConditionalBotAction } from 'botmation/interfaces/bot-actions'
import { BotAction } from 'botmation/interfaces/bot-actions'

import { chain } from 'botmation/actions/assembly-lines'
import { goTo, waitForNavigation } from 'botmation/actions/navigation'
import { click, type } from 'botmation/actions/input'
import { getIndexedDBValue, indexedDBStore } from 'botmation/actions/indexed-db'
import { map } from 'botmation/actions/pipe'
import { log } from 'botmation/actions/console'

import { getInstagramLoginUrl } from '../helpers/urls'
import { 
  FORM_AUTH_USERNAME_INPUT_SELECTOR,
  FORM_AUTH_PASSWORD_INPUT_SELECTOR,
  FORM_AUTH_SUBMIT_BUTTON_SELECTOR
} from '../selectors'
import { errors } from 'botmation/actions/errors'

/**
 * @description    ConditionalBotAction that resolves TRUE if the User is NOT logged in
 *                 Checks IndexedDB redux, store 'paths' for `users.viewerId` value (only has value if logged in)
 * @param page
 * @param injects
 */
export const isGuest: ConditionalBotAction = async(page, ...injects) =>
  await indexedDBStore('redux', 1, 'paths')(
    getIndexedDBValue('users.viewerId'),
    map(viewerId => viewerId ? false : true),
  )(page, ...injects)

/**
 * @description    ConditionalBotAction that resolves TRUE if the User is logged in
 *                 Checks IndexedDB redux, store 'paths' for `users.viewerId` value (only has value if logged in)
 * @param page
 * @param injects
 */
export const isLoggedIn: ConditionalBotAction = async(page, ...injects) =>
  await indexedDBStore('redux', 1, 'paths')(
    getIndexedDBValue('users.viewerId'),
    map(viewerId => viewerId ? true : false)
  )(page, ...injects)

/**
 * @description  BotAction that attempts the login flow for Instagram
 * @param {username, password} destructured
 */
export const login = ({username, password}: {username: string, password: string}): BotAction => async(page, ...injects) =>
  chain(
    errors('Instagram login()')(
      goTo(getInstagramLoginUrl()),
      click(FORM_AUTH_USERNAME_INPUT_SELECTOR),
      type(username),
      click(FORM_AUTH_PASSWORD_INPUT_SELECTOR),
      type(password),
      click(FORM_AUTH_SUBMIT_BUTTON_SELECTOR),
      waitForNavigation,
      log('Login Complete')
    )
  )(page, ...injects)
  