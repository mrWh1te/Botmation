import { clickText, ConditionalBotAction, pipe, textExists } from '@botmation/core'
import { BotAction } from '@botmation/core'

import { chain, errors } from '@botmation/core'
import { goTo, reload, waitForNavigation, wait } from '@botmation/core'
import { getCookies, deleteCookies } from '@botmation/core'
import { click, type } from '@botmation/core'
import { getIndexedDBValue, indexedDBStore, clearAllLocalStorage } from '@botmation/core'
import { map } from '@botmation/core'
import { log } from '@botmation/core'

import { getInstagramLoginUrl } from '../helpers/urls'
import {
  FORM_AUTH_USERNAME_INPUT_SELECTOR,
  FORM_AUTH_PASSWORD_INPUT_SELECTOR,
  FORM_AUTH_SUBMIT_BUTTON_SELECTOR
} from '../selectors'

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

/**
 *
 * @param page
 */
export const logout: BotAction = pipe()(
  getCookies(),
  deleteCookies(),
  clearAllLocalStorage,
  reload() // instagram will delete IndexedDB 'redux' db after reload
)

/**
 * During initial login, in a brand new environment, Instagram might prompt the User to save their login information
 *  This will disrupt feed access, therefore this function can be used to check if that is being presented
 */
export const isSaveYourLoginInfoActive: ConditionalBotAction = textExists('Save Your Login Info?')

/**
 *
 */
export const clickSaveYourLoginInfoYesButton: BotAction = clickText('Save Info')

/**
 *
 */
export const clickSaveYourLoginInfoNoButton: BotAction = clickText('Not Now')
