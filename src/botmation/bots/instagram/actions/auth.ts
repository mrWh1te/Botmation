import { ConditionalBotAction } from '../../../interfaces/bot-actions'
import { BotAction } from '../../../interfaces/bot-actions'

import { chain } from '../../../actions/assembly-lines'
import { goTo, waitForNavigation } from '../../../actions/navigation'
import { click, type } from '../../../actions/input'
import { getIndexedDBValue, indexedDBStore } from '../../../actions/indexed-db'
import { map } from '../../../actions/pipe'
import { log } from '../../../actions/console'

import { getInstagramLoginUrl } from '../helpers/urls'
import { 
  FORM_AUTH_USERNAME_INPUT_SELECTOR,
  FORM_AUTH_PASSWORD_INPUT_SELECTOR,
  FORM_AUTH_SUBMIT_BUTTON_SELECTOR
} from '../selectors'
import { errors } from '../../../actions/errors'
import { wait } from '../../../actions/utilities'

/**
 * @description    ConditionalBotAction that resolves TRUE if the User is NOT logged in
 *                 Checks IndexedDB redux, store 'paths' for `users.viewerId` value (only has value if logged in)
 * @param page
 * @param injects
 */
export const isGuest: ConditionalBotAction = 
  indexedDBStore('redux', 'paths')(
    getIndexedDBValue('users.viewerId'),
    map(viewerId => viewerId ? false : true),
  )

/**
 * @description    ConditionalBotAction that resolves TRUE if the User is logged in
 *                 Checks IndexedDB redux, store 'paths' for `users.viewerId` value (only has value if logged in)
 * @param page
 * @param injects
 */
export const isLoggedIn: ConditionalBotAction =
  indexedDBStore('redux', 'paths')(
    getIndexedDBValue('users.viewerId'),
    map(viewerId => viewerId ? true : false)
  )

/**
 * @description  BotAction that attempts the login flow for Instagram
 * @param {username, password} destructured
 */
export const login = ({username, password}: {username: string, password: string}): BotAction =>
  chain(
    errors('Instagram login()')(
      goTo(getInstagramLoginUrl()),
      click(FORM_AUTH_USERNAME_INPUT_SELECTOR),
      type(username),
      click(FORM_AUTH_PASSWORD_INPUT_SELECTOR),
      type(password),
      click(FORM_AUTH_SUBMIT_BUTTON_SELECTOR),
      waitForNavigation,
      wait(1000), // artificially wait 1sec to give time for app to update IndexedDB (so auth checks work)
      log('Login Complete')
    )
  )
  