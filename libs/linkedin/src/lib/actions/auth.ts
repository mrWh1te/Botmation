import { BotAction, ConditionalBotAction } from '@botmation/core'
import {
  chain,
  pipe,
  goTo,
  waitForNavigation,
  click,
  type,
  log,
  getLocalStorageItem,
  map,
  errors
} from '@botmation/core'

/**
 * LinkedIn Auth
 *  - Few patterns noticed on 8/26/2020 that seem to be pretty consistent in regards to signaling AUTH
 *    1) there is some kind of key `oauth2_*` in Session Storage as a Guest, and nothing as a Logged In User
 *    2) local storage is empty as a new guest (incognito tab), and complete with multiple `voyager-web:*` keys pointing to what seems to be data belonging to web app features ie state slices
 *    3) cookies carries the same `JSESSIONID`, `b*cookie` through auth process, but adds new key/values such as `li_at`, `liap`, `sdsc`, `sl`, `UserMatchHistory` and `visit`
 *        In addition, `AMCV_*` and `AMCVS_*` carries an encoded value through
 *
 *     Wondering if maybe `C_C_M` key in Local Storage is related to `cp` in code, which seems auth/user related
 *
 *    Choice of signal is `voyager-web:badges` key in Local Storage since that feature of displaying UI Badge (Notifications counter) is part of the layout, existing in all relevant pages to the main web application, therefore seems reliable to query.
 */

/**
 * Tests the page for being a "guest" in LinkedIn (not logged in)
 */
 export const isGuest: ConditionalBotAction = pipe()(
  // data feature for user notifications
  getLocalStorageItem('voyager-web:badges'),
  map(value => value === null) // Local Storage returns null if not found
)

/**
 * Test page for being logged in LinkedIn
 */
export const isLoggedIn: ConditionalBotAction = pipe()(
  // data feature for user notifications
  getLocalStorageItem('voyager-web:badges'),
  map(value => typeof value === 'string') // Local Storage returns string value if found
)

/**
 * Login sequence for LinkedIn
 * @param emailOrPhone
 * @param password
 */
export const login = (emailOrPhone: string, password: string): BotAction =>
  chain(
    errors('LinkedIn login()')(
      goTo('https://www.linkedin.com/login'),
      click('form input[id="username"]'),
      type(emailOrPhone),
      click('form input[id="password"]'),
      type(password),
      click('form button[type="submit"]'),
      waitForNavigation,
      log('LinkedIn Login Complete')
    )
  )
