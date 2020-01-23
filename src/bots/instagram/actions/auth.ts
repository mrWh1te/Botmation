import puppeteer from 'puppeteer'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'
import { BotActionsChainFactory } from '@mationbot/factories/bot-actions-chain.factory'

import { goTo, waitForNavigation } from '@mationbot/actions/navigation'
import { click, type, ifThen } from '@mationbot/actions/utilities'
import { log } from '@mationbot/actions/console'

import { getInstagramLoginUrl } from '@bots/instagram/helpers/urls'
import { BotAuthOptions } from '@mationbot/interfaces/bot-options.interfaces'
import { 
  FORM_AUTH_USERNAME_INPUT_SELECTOR,
  FORM_AUTH_PASSWORD_INPUT_SELECTOR,
  FORM_AUTH_SUBMIT_BUTTON_SELECTOR
} from '@bots/instagram/selectors'
import { isTurnOnNotificationsModalActive, closeTurnOnNotificationsModal } from './modals'

/**
 * @description   Single Higher Order Function for Page Changing
 * @param url
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
    // After initial login, Instagram usually prompts the User with a modal...
    // Deal with the "Turn On Notifications" Modal, if it shows up
    ifThen(isTurnOnNotificationsModalActive, closeTurnOnNotificationsModal()),
    log('If that modal was open, its closed now')
  )

//
// Helpers

// Future: Go into the data, directly, and grab from the database, IndexedDB (redux). There is no data if guest
export const isLoggedIn = async(tab: puppeteer.Page): Promise<boolean> => {
  // Go to the login page
  await goTo(getInstagramLoginUrl())(tab)
  
  // if you're logged in, Instagram would have redirected you to the feed
  // if you were a guest, logged out, you would be on the Instagram Login URL
  return tab.url() !== getInstagramLoginUrl()
}

export const isGuest = async(tab: puppeteer.Page): Promise<boolean> => {
  // Go to the login page
  await goTo(getInstagramLoginUrl())(tab)
  
  // if you're logged in, Instagram would have redirected you to the feed
  // if you were a guest, logged out, you would be on the Instagram Login URL
  return tab.url() === getInstagramLoginUrl()
}
