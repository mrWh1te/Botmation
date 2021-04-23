import {
  clickText,
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
  log
} from '@botmation/core'

import { FORM_AUTH_PASSWORD_INPUT_SELECTOR, FORM_AUTH_USERNAME_INPUT_SELECTOR } from '../constants/selectors'
import { goToLogin, goToLogout } from './navigation'

/**
 * @description  BotAction that attempts the login flow for Twitter
 * @param {username, password} destructured
 */
export const login = ({username, password}: {username: string, password: string}): BotAction =>
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
export const logout: BotAction = chain(
  goToLogout,
  clickText('Log out'),
  waitForNavigation
)

/**
 * @param page
 * @param injects
 */
export const isGuest: ConditionalBotAction = pipe()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'auth_token') ? false : true)
)

/**
 * @param page
 * @param injects
 */
export const isLoggedIn: ConditionalBotAction = pipe()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'auth_token') ? true : false)
)

