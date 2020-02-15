/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

import { Botmation } from './botmation'

// General BotAction's
import { log, warning } from './botmation/actions/console'
import { givenThat, wait } from './botmation/actions/utilities'
import { loadCookies, saveCookies } from './botmation/actions/cookies'
import { goTo } from './botmation/actions/navigation'

// Instagram specific BotAction's
import { login } from './botmation/bots/instagram/actions/auth'
import { closeTurnOnNotificationsModal } from './botmation/bots/instagram/actions/modals'
import { screenshot } from './botmation/actions/output'

// Instagram helpers
import { getInstagramBaseUrl, getInstagramLoginUrl } from './botmation/bots/instagram/helpers/urls'
import { isGuest } from './botmation/bots/instagram/helpers/auth'
import { isTurnOnNotificationsModalActive } from './botmation/bots/instagram/helpers/modals'
import { logError } from 'botmation/helpers/console'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  // mini side project, to scrape and harvest data of news sites over years
  // then run the data against NLP scripts, etc. to look for interesting patterns
  // https://www.w3newspapers.com/newssites/
  // const newsSites = [
  //   'cnn.com',
  //   'nytimes.com',
  //   'foxnews.com',
  //   'wsj.com',
  //   // 'reuters.com',
  //   // 'bloomberg.com',
  //   'forbes.com',
  //   'global.chinadaily.com.cn',
  //   'timesofindia.indiatimes.com'
  // ]

  // Wrap in try/catch, because the bot will throw on Errors requiring dev attention
  try {
    // Launch Puppeteer to grab the Browser it manages
    browser = await puppeteer.launch({headless: false})

    // Start up the Instagram bot to run in the Puppeteer Browser
    const instagramBot = await Botmation.asyncConstructor(browser)

    // Actions run in sequence
    await instagramBot.actions(
      log('Botmation running'),
      warning('test'),

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
        login({username: '', password: ''}),
        saveCookies('instagram')
      ),

      // After initial load, Instagram sometimes prompts the User with a modal...
      // Deal with the "Turn On Notifications" Modal, if it shows up
      givenThat(isTurnOnNotificationsModalActive)(
        closeTurnOnNotificationsModal()
      ),

      goTo(getInstagramBaseUrl()),
      wait(5000),
      screenshot('feed'),

      log('Done with feed'),
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