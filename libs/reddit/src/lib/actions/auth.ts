import {
  Action,
  chain,
  errors,
  pipe,
  map,
  log
} from '@botmation/v2core'

import {
  getCookies,
  waitForNavigation,
  click,
  type,
  deleteCookies,
  reload,
  InjectBrowserPage
} from '@botmation/puppeteer'

import { FORM_AUTH_PASSWORD_INPUT_SELECTOR, FORM_AUTH_SUBMIT_BUTTON_SELECTOR, FORM_AUTH_USERNAME_INPUT_SELECTOR } from '../constants/selectors'
import { goToLogin } from './navigation'

/**
 * @description  Action that attempts the login flow for Reddit
 * @param {username, password} destructured
 */
export const login = (username: string, password: string): Action =>
  chain(
    errors('Reddit login()')(
      goToLogin,
      click(FORM_AUTH_USERNAME_INPUT_SELECTOR),
      type(username),
      click(FORM_AUTH_PASSWORD_INPUT_SELECTOR),
      type(password),
      click(FORM_AUTH_SUBMIT_BUTTON_SELECTOR),
      waitForNavigation,
      log('Login Complete')
    )
  )

/**
 * @param page
 */
export const logout: Action = pipe<InjectBrowserPage>()(
  getCookies(),
  deleteCookies(),
  reload()
)

/**
 * @param page
 * @param injects
 */
export const isGuest: Action = pipe<InjectBrowserPage>()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'reddit_session') ? false : true)
)

/**
 * @param page
 * @param injects
 */
export const isLoggedIn: Action = pipe<InjectBrowserPage>()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'reddit_session') ? true : false)
)

