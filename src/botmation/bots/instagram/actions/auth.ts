import { Page } from 'puppeteer'

import { BotAction } from '../../../interfaces/bot-actions.interfaces'

import { goTo, waitForNavigation } from '../../../actions/navigation'
import { log } from '../../../actions/console'

import { getInstagramLoginUrl } from '../helpers/urls'
import { 
  FORM_AUTH_USERNAME_INPUT_SELECTOR,
  FORM_AUTH_PASSWORD_INPUT_SELECTOR,
  FORM_AUTH_SUBMIT_BUTTON_SELECTOR
} from '../selectors'
import { click, type } from '../../../actions/input'
import { chain } from 'botmation/actions/assembly-line'



/**
 * @description  BotAction that attempts the login flow for Instagram
 *               This BotAction is a great example of how 1 Action can wrap a whole other list of Action's, while using the same actions() code design
 * @param {username, password} destructured from BotAuthOptions 
 */
export const login = ({username, password}: {username: string, password: string}): BotAction => async(page: Page, ...injects) =>
  // This is how a single BotAction can run its own sequence of BotAction's prior to the next call of the original bot.actions() sequence
  await chain(
    goTo(getInstagramLoginUrl()),
    click(FORM_AUTH_USERNAME_INPUT_SELECTOR),
    type(username),
    click(FORM_AUTH_PASSWORD_INPUT_SELECTOR),
    type(password),
    click(FORM_AUTH_SUBMIT_BUTTON_SELECTOR),
    waitForNavigation,
    log('Login Complete')
  )(page, ...injects)
  