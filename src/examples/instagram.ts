/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

// General BotAction's
import { log } from 'botmation/actions/console'
import { givenThat, wait } from 'botmation/actions/utilities'
import { loadCookies, saveCookies } from 'botmation/actions/cookies'
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/output'

// Instagram specific BotAction's
// import { favoriteAllFrom } from 'botmation/bots/instagram/actions/feed'
import { login } from 'botmation/bots/instagram/actions/auth'
import { closeTurnOnNotificationsModal } from 'botmation/bots/instagram/actions/modals'

// Instagram helpers
import { getInstagramBaseUrl, getInstagramLoginUrl } from 'botmation/bots/instagram/helpers/urls'
import { isGuest } from 'botmation/bots/instagram/helpers/auth'
import { isTurnOnNotificationsModalActive } from 'botmation/bots/instagram/helpers/modals'
import { logError } from 'botmation/helpers/console'

// Expiremental Pipe
import { BotActionsPipeFactory as Bot } from 'botmation/factories/bot-actions-pipe.factory'
import { pipeTest, setIndexDBStoreDataKeyValue, getIndexDBStoreDataKeyValue } from 'botmation/actions/indexed-db'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  try {
    browser = await puppeteer.launch({headless: false})
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    await Bot(page)(
      log('Botmation running'),
      goTo(getInstagramBaseUrl()),

      // test
      pipeTest({id: 5, name: 'Michael'}),
      log(),
      log('Test #1 Complete'),
      // end test

      log('Test #2 Commence'),
      setIndexDBStoreDataKeyValue('testDB5', 1, 'testStore5', 'testKey5', 'It WORKS!'),
      getIndexDBStoreDataKeyValue('testDB5', 1, 'testStore5', 'testKey5'),
      log('Test #2 Results, include piped value?'),
      // end 2nd test


      // Takes the name of the file to load cookies from
      // Match this value with the same used in saveCookies()
      loadCookies('instagram'),
      
      // Special action that resolves a Promise for TRUE
      // only on TRUE, does it run the chain of actions
      givenThat(isGuest) (
        goTo(getInstagramLoginUrl()),
        login({username: 'account username', password: 'account password'}),
        saveCookies('instagram'), // the Bot will skip login, on next run, by loading cookies 
        log('Saved Cookies')
      ),

      // After initial load, Instagram sometimes prompts the User with a modal...
      // Deal with the "Turn On Notifications" Modal, if it shows up
      givenThat(isTurnOnNotificationsModalActive)(
        closeTurnOnNotificationsModal
      ),

      // Go to the main homepage/feed
      // goTo(getInstagramBaseUrl()),
      // wait(50000),
      // screenshot('test4534'),
      // favoriteAllFrom('user1', 'user2'), // TBI (to be implemented) // TODO: implement

      log('Done'),
      //   viewAllStoriesFrom('user1', 'user2') // TODO: implement
    )
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  } finally {
    // setTimeout(async() => {
    //   if (browser) await browser.close()
    // })
  }
  
})()