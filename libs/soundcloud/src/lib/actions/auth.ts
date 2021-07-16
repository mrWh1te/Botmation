import { chain, errors, log, pipe, map, Action } from '@botmation/v2core'
import { click, type, waitForNavigation, getCookies, InjectPage } from '@botmation/puppeteer'

import { goToLogin, goToLogout } from './navigation'
import { FORM_AUTH_CONTINUE_BUTTON, FORM_AUTH_EMAILORPROFILEURL_INPUT, FORM_AUTH_PASSWORD_INPUT, FORM_AUTH_SIGNIN_BUTTON } from '../constants/selectors'

/**
 *
 * @param emailOrProfileUrl
 * @param password
 */
export const login = (emailOrProfileUrl: string, password: string) => chain(
  errors('Soundcloud login()')(
    goToLogin,
    click(FORM_AUTH_EMAILORPROFILEURL_INPUT),
    type(emailOrProfileUrl),
    click(FORM_AUTH_CONTINUE_BUTTON),
    waitForNavigation,
    click(FORM_AUTH_PASSWORD_INPUT),
    type(password),
    click(FORM_AUTH_SIGNIN_BUTTON),
    waitForNavigation,
    log('Login Complete')
  )
)

/**
 */
export const logout: Action = goToLogout

/**
 */
export const isGuest = pipe<InjectPage, boolean>()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'oauth_token') ? false : true)
)

/**
 */
export const isLoggedIn = pipe<InjectPage, boolean>()(
  getCookies(),
  map(cookies => cookies.find(cookie => cookie.name === 'oauth_token') ? true : false)
)
