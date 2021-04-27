import {
  ConditionalBotAction,
  getCookies,
  BotAction,
  chain,
  errors,
  pipe,
  waitForNavigation,
  click,
  type,
  map,
  log,
  deleteCookies,
  reload
} from '@botmation/core'

import { FORM_AUTH_PASSWORD_INPUT_SELECTOR, FORM_AUTH_SUBMIT_BUTTON_SELECTOR, FORM_AUTH_USERNAME_INPUT_SELECTOR } from '../constants/selectors'
import { goToLogin } from './navigation'

/**
 * @description  BotAction that attempts the login flow for Reddit
 * @param {username, password} destructured
 */
export const login = (username: string, password: string): BotAction =>
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
export const logout: BotAction = pipe()(
  getCookies(),
  deleteCookies(),
  reload()
)

/**
 * @param page
 * @param injects
 */
export const isGuest: ConditionalBotAction = pipe()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'reddit_session') ? false : true)
)

/**
 * @param page
 * @param injects
 */
export const isLoggedIn: ConditionalBotAction = pipe()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'reddit_session') ? true : false)
)

