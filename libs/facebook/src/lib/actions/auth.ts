import {
  Action,
  chain,
  errors,
  pipe,
  map,
  log,
  wait,
} from '@botmation/v2core'

import {
  deleteCookies,
  clickText,
  getCookies,
  waitForNavigation,
  click,
  type,
  InjectBrowserPage,
} from '@botmation/puppeteer'

import { FORM_AUTH_PASSWORD_INPUT_SELECTOR, FORM_AUTH_SUBMIT_BUTTON_SELECTOR, FORM_AUTH_EMAIL_INPUT_SELECTOR, NAVIGATION_ACCOUNT_CONTROLS_AND_SETTINGS } from '../constants/selectors'
import { goToLogin } from './navigation'

/**
 * @description  Action that attempts the login flow for Facebook
 * @param {email, password} destructured
 */
export const login = ({email, password}: {email: string, password: string}): Action<InjectBrowserPage> =>
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
export const logout: Action = pipe<InjectBrowserPage>()(
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
export const isGuest: Action = pipe<InjectBrowserPage>()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'c_user') ? false : true)
)

/**
 * @param page
 * @param injects
 */
export const isLoggedIn: Action = pipe<InjectBrowserPage>()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'c_user') ? true : false)
)

