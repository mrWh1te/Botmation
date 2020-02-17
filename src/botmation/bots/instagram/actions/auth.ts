import { Page } from 'puppeteer'

import { BotAction } from 'botmation/interfaces/bot-action.interfaces'
import { BotActionsChainFactory } from 'botmation/factories/bot-actions-chain.factory'

import { goTo, waitForNavigation } from 'botmation/actions/navigation'
import { log } from 'botmation/actions/console'

import { getInstagramLoginUrl } from 'botmation/bots/instagram/helpers/urls'
import { 
  FORM_AUTH_USERNAME_INPUT_SELECTOR,
  FORM_AUTH_PASSWORD_INPUT_SELECTOR,
  FORM_AUTH_SUBMIT_BUTTON_SELECTOR
} from '../selectors'
import { click, type } from 'botmation/actions/input'



/**
 * @description  BotAction that attempts the login flow for Instagram
 *               This BotAction is a great example of how 1 Action can wrap a whole other list of Action's, while using the same actions() code design
 * @param {username, password} destructured from BotAuthOptions 
 */
export const login = ({username, password}: {username: string, password: string}): BotAction => async(page: Page, options, ...injects) =>
  // This is how a single BotAction can run its own sequence of BotAction's prior to the next call of the original bot.actions() sequence
  BotActionsChainFactory(page, options, ...injects)(
    goTo(getInstagramLoginUrl()),
    click(FORM_AUTH_USERNAME_INPUT_SELECTOR),
    type(username),
    click(FORM_AUTH_PASSWORD_INPUT_SELECTOR),
    type(password),
    click(FORM_AUTH_SUBMIT_BUTTON_SELECTOR),
    waitForNavigation(),
    log('Login Complete')
  )
  