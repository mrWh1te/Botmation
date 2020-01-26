import puppeteer from 'puppeteer'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'
import { BotActionsChainFactory } from '@mationbot/factories/bot-actions-chain.factory'

import { goTo, waitForNavigation } from '@mationbot/actions/navigation'
import { log } from '@mationbot/actions/console'

import { getInstagramLoginUrl } from '@bots/instagram/helpers/urls'
import { BotAuthOptions } from '@mationbot/interfaces/bot-options.interfaces'
import { 
  FORM_AUTH_USERNAME_INPUT_SELECTOR,
  FORM_AUTH_PASSWORD_INPUT_SELECTOR,
  FORM_AUTH_SUBMIT_BUTTON_SELECTOR
} from '@bots/instagram/selectors'
import { saveCookies } from '@mationbot/actions/cookies'
import { click, type } from '@mationbot/actions/input'

/**
 * @description  BotAction that attempts the login flow for Instagram
 *               This BotAction is a great example of how 1 Action can wrap a whole other list of Action's, while using the same actions() code design
 * @param {username, password} destructured from BotAuthOptions 
 */
export const login = ({username, password}: BotAuthOptions): BotAction => async(tab: puppeteer.Page) =>
  // This is how a single BotAction can run its own sequence of BotAction's prior to the next call of the original bot.actions() sequence
  BotActionsChainFactory(tab)(
    goTo(getInstagramLoginUrl()),
    click(FORM_AUTH_USERNAME_INPUT_SELECTOR),
    type(username),
    click(FORM_AUTH_PASSWORD_INPUT_SELECTOR),
    type(password),
    click(FORM_AUTH_SUBMIT_BUTTON_SELECTOR),
    waitForNavigation(),
    log('Login Complete'),
    saveCookies('instagram')
  )
  