/**
 * @description  Simple Example Script
 */
import 'module-alias/register'
import puppeteer from 'puppeteer'

import { MationBot } from '@mationbot/mation-bot.class'

import { ACCOUNT_USERNAME, ACCOUNT_PASSWORD } from '@config'

// General BotAction's
import { log, logError } from '@mationbot/actions/console'
import { givenThat, wait } from '@mationbot/actions/utilities'
import { loadCookies, saveCookies } from '@mationbot/actions/cookies'
import { goTo } from '@mationbot/actions/navigation'
import { screenshot } from '@mationbot/actions/output'

// Instagram specific BotAction's
import { favoriteAllFrom } from '@bots/instagram/actions/feed'
import { login } from '@bots/instagram/actions/auth'
import { closeTurnOnNotificationsModal } from '@bots/instagram/actions/modals'

// Instagram helpers
import { getInstagramBaseUrl, getInstagramLoginUrl } from '@bots/instagram/helpers/urls'
import { isGuest } from '@bots/instagram/helpers/auth'
import { isTurnOnNotificationsModalActive } from '@bots/instagram/helpers/modals'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  try {
    browser = await puppeteer.launch({headless: false})
    const instagramBot = await MationBot.asyncConstructor(browser)

    await instagramBot.actions(
      log('MationBot running'),

      // Takes the name of the file to load cookies from
      // Match this value with the same used in saveCookies()
      loadCookies('instagram'),

      // Special action that resolves a Promise for TRUE
      // only on TRUE, does it run the chain of actions
      givenThat(isGuest) (
        goTo(getInstagramLoginUrl()),
        login({username: ACCOUNT_USERNAME, password: ACCOUNT_PASSWORD}),
        saveCookies('instagram') // the Bot will skip login, on next run, by loading cookies 
      ),

      // After initial load, Instagram sometimes prompts the User with a modal...
      // Deal with the "Turn On Notifications" Modal, if it shows up
      givenThat(isTurnOnNotificationsModalActive)(
        closeTurnOnNotificationsModal()
      ),

      // Go to the main homepage/feed
      goTo(getInstagramBaseUrl()),
      wait(5000),
      screenshot('feed'),
      favoriteAllFrom('user1', 'user2'), // TBI (to be implemented) // TODO: implement

      log('Done with feed'),
      //   viewAllStoriesFrom('user1', 'user2') // TODO: implement
    )
    
    await instagramBot.closePage()
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  } finally {
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})()