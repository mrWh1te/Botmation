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
  log,
  wait,
  deleteCookies
} from '@botmation/core'

import { FORM_AUTH_PASSWORD_INPUT_SELECTOR, FORM_AUTH_SUBMIT_BUTTON_SELECTOR, FORM_AUTH_EMAIL_INPUT_SELECTOR, NAVIGATION_ACCOUNT_CONTROLS_AND_SETTINGS } from '../constants/selectors'
import { goToLogin } from './navigation'

/**
 * @description  BotAction that attempts the login flow for Facebook
 * @param {email, password} destructured
 */
export const login = ({email, password}: {email: string, password: string}): BotAction =>
  chain(
    errors('Facebook login()')(
      goToLogin,
      click(FORM_AUTH_EMAIL_INPUT_SELECTOR),
      type(email),
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
  click(NAVIGATION_ACCOUNT_CONTROLS_AND_SETTINGS + ' > span'),
  wait(1000),
  clickText('Log Out'),
  waitForNavigation,
  getCookies(),
  deleteCookies()
)

/**
 * @param page
 * @param injects
 */
export const isGuest: ConditionalBotAction = pipe()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'c_user') ? false : true)
)

/**
 * @param page
 * @param injects
 */
export const isLoggedIn: ConditionalBotAction = pipe()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'c_user') ? true : false)
)

