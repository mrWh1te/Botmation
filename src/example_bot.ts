/**
 * @description  Simple Example Script
 */
import 'module-alias/register'
import puppeteer from 'puppeteer'

import { MationBot } from '@mationbot'

import { ACCOUNT_USERNAME, ACCOUNT_PASSWORD } from '@config'

// General BotAction's
import { log, logError } from '@mationbot/actions/console'
import { givenThat, wait, forAll } from '@mationbot/actions/utilities'
import { loadCookies } from '@mationbot/actions/cookies'
import { goTo } from '@mationbot/actions/navigation'

// Instagram specific BotAction's
import { favoriteAllFrom } from '@bots/instagram/actions/feed'
import { login } from '@bots/instagram/actions/auth'
import { closeTurnOnNotificationsModal } from '@bots/instagram/actions/modals'

// Instagram helpers
import { getInstagramBaseUrl, getInstagramLoginUrl } from '@bots/instagram/helpers/urls'
import { isGuest } from '@bots/instagram/helpers/auth'
import { isTurnOnNotificationsModalActive } from '@bots/instagram/helpers/modals'
import { screenshot, screenshotAll } from '@mationbot/actions/output'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  // mini side project, to scrape and harvest data of news sites over years
  // then run the data against NLP scripts, etc. to look for interesting patterns
  // https://www.w3newspapers.com/newssites/
  const newsSites = [
    'cnn.com',
    'nytimes.com',
    'foxnews.com',
    'wsj.com',
    // 'reuters.com',
    // 'bloomberg.com',
    'forbes.com',
    'global.chinadaily.com.cn',
    'timesofindia.indiatimes.com'
  ]

  // Wrap in try/catch, because the bot will throw on Errors requiring dev attention
  try {
    // Launch Puppeteer to grab the Browser it manages
    browser = await puppeteer.launch({headless: false})

    // Start up the Instagram bot to run in the Puppeteer Browser
    const instagramBot = await MationBot.asyncConstructor(browser)

    // Actions run in sequence
    await instagramBot.actions(
      log('MationBot running'),

      // script to take screenshots of popular news sites
      // forAll(newsSites)(
      //   (siteName) => ([
      //     goTo('http://'+siteName),
      //     screenshot(siteName+'-homepage')
      //   ])
      // ),
      // screenshotAll(...newsSites),


      // example forAll using 1 BotAction instead of an array
      // forAll(['twitter.com', 'facebook.com'])((siteName) => goTo('http://' + siteName)),

      // example forAll on a Dictionary with key->value pairs
      // forAll({id: 'twitter.com', id2: 'apple.com', id4: 'google.com'})(
      //   (key: string, value: any) => ([
      //     goTo('http://'+value),
      //     screenshot(key+value+'---homepage')
      //   ])
      // ),

      loadCookies('instagram'),

      // TODO: localstorage
      // TODO: IndexedDB
      
      // special BotAction for running a chain of BotAction's, if the condition's promise == TRUE

      givenThat(isGuest) (
        goTo(getInstagramLoginUrl()),
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
  
})();