import {
  clickText,
  getCookies,
  waitForNavigation,
  click,
  type,
  InjectBrowserPage
} from '@botmation/puppeteer'

import {
  Action,
  log,
  chain,
  errors,
  pipe,
  map,
} from '@botmation/v2core'

import { FORM_AUTH_PASSWORD_INPUT_SELECTOR, FORM_AUTH_USERNAME_INPUT_SELECTOR } from '../constants/selectors'
import { goToLogin, goToLogout } from './navigation'

/**
 * @description  Action that attempts the login flow for Twitter
 * @param {username, password} destructured
 */
export const login = ({username, password}: {username: string, password: string}): Action<InjectBrowserPage> =>
  chain(
    errors('Twitter login()')(
      goToLogin,
      click(FORM_AUTH_USERNAME_INPUT_SELECTOR),
      type(username),
      click(FORM_AUTH_PASSWORD_INPUT_SELECTOR),
      type(password),
      clickText('Log in'),
      waitForNavigation,
      log('Login Complete')
    )
  )

/**
 * @param page
 */
export const logout: Action = chain(
  goToLogout,
  clickText('Log out'),
  waitForNavigation
)

/**
 * @param page
 * @param injects
 */
export const isGuest = pipe<InjectBrowserPage, boolean>()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'auth_token') ? false : true)
)

/**
 * @param page
 * @param injects
 */
export const isLoggedIn = pipe<InjectBrowserPage, boolean>()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'auth_token') ? true : false)
)

