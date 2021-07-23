import { clickText, InjectBrowserPage, textExists } from '@botmation/puppeteer'
import { Action, pipe, wait } from '@botmation/v2core'

import { chain, errors } from '@botmation/v2core'
import {
  getIndexedDBValue,
  indexedDBStore,
  clearAllLocalStorage,
  click,
  type,
  goTo,
  reload,
  waitForNavigation,
  getCookies,
  deleteCookies
} from '@botmation/puppeteer'
import { map } from '@botmation/v2core'
import { log } from '@botmation/v2core'

import { INSTAGRAM_URL_LOGIN } from '../constants/urls'
import {
  FORM_AUTH_USERNAME_INPUT_SELECTOR,
  FORM_AUTH_PASSWORD_INPUT_SELECTOR,
  FORM_AUTH_SUBMIT_BUTTON_SELECTOR
} from '../constants/selectors'

/**
 * @description    Action that resolves TRUE if the User is NOT logged in
 *                 Checks IndexedDB redux, store 'paths' for `users.viewerId` value (only has value if logged in)
 * @param page
 * @param injects
 */
export const isGuest: Action<InjectBrowserPage> =
  indexedDBStore('redux', 'paths')(
    getIndexedDBValue('users.viewerId'),
    map(viewerId => viewerId ? false : true),
  )

/**
 * @description    Action that resolves TRUE if the User is logged in
 *                 Checks IndexedDB redux, store 'paths' for `users.viewerId` value (only has value if logged in)
 * @param page
 * @param injects
 */
export const isLoggedIn: Action<InjectBrowserPage> =
  indexedDBStore('redux', 'paths')(
    getIndexedDBValue('users.viewerId'),
    map(viewerId => viewerId ? true : false)
  )

/**
 * @description  Action that attempts the login flow for Instagram
 * @param {username, password} destructured
 */
export const login = ({username, password}: {username: string, password: string}): Action<InjectBrowserPage> =>
  chain(
    errors('Instagram login()')(
      goTo(INSTAGRAM_URL_LOGIN),
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
export const logout: Action = pipe<InjectBrowserPage>()(
  getCookies(),
  deleteCookies(),
  clearAllLocalStorage,
  reload() // instagram will delete IndexedDB 'redux' db after reload
)

/**
 * During initial login, in a brand new environment, Instagram might prompt the User to save their login information
 *  This will disrupt feed access, therefore this function can be used to check if that is being presented
 */
export const isSaveYourLoginInfoActive: Action<InjectBrowserPage> = textExists('Save Your Login Info?')

/**
 *
 */
export const clickSaveYourLoginInfoYesButton: Action<InjectBrowserPage> = clickText('Save Info')

/**
 *
 */
export const clickSaveYourLoginInfoNoButton: Action<InjectBrowserPage> = clickText('Not Now')
