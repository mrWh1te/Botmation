/**
 * @description  Simple Example Script
 */
import 'module-alias/register'
import puppeteer from 'puppeteer'

import { MationBot } from '@mationbot'

import { ACCOUNT_USERNAME, ACCOUNT_PASSWORD } from '@config'

// General BotAction's
import { log, logError } from '@mationbot/actions/console'
import { screenshot, givenThat, wait } from '@mationbot/actions/utilities'
import { loadCookies } from '@mationbot/actions/cookies'
import { goTo } from '@mationbot/actions/navigation'

// Instagram specific BotAction's
import { favoriteAllFrom } from '@bots/instagram/actions/feed'
import { login } from '@bots/instagram/actions/auth'
import { closeTurnOnNotificationsModal } from '@bots/instagram/actions/modals'

// Instagram helpers
import { getInstagramBaseUrl } from '@bots/instagram/helpers/urls'
import { isGuest } from '@bots/instagram/helpers/auth'
import { isTurnOnNotificationsModalActive } from '@bots/instagram/helpers/modals'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  // Wrap in try/catch, because the bot will throw on Errors requiring dev attention
  try {
    // Launch Puppeteer to grab the Browser it manages
    browser = await puppeteer.launch({headless: false})

    // Start up the Instagram bot to run in the Puppeteer Browser
    const instagramBot = await MationBot.asyncConstructor(browser)

    // Actions run in sequence
    await instagramBot.actions(
      log('MationBot running'),
      loadCookies('instagram'),

      // TODO: localstorage
      
      givenThat(isGuest) (
        screenshot('login'),
        login({username: ACCOUNT_USERNAME, password: ACCOUNT_PASSWORD})
      ),

      // After initial load, Instagram sometimes prompts the User with a modal...
      // Deal with the "Turn On Notifications" Modal, if it shows up
      givenThat(isTurnOnNotificationsModalActive)(
        closeTurnOnNotificationsModal()
      ),

      goTo(getInstagramBaseUrl()),
      wait(5000),
      screenshot('feed'),

      favoriteAllFrom('user1', 'user2'), // TBI (to be implemented)
      log('Done with feed'),
    )
    //   viewAllStoriesFrom('user1', 'user2')
    
    await instagramBot.destroy() // closes the tab inside the browser that it was crawling/acting on
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})();