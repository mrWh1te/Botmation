/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

// General BotAction's
import { log } from 'botmation/actions/console'
import { givenThat } from 'botmation/actions/utilities'
import { loadCookies, saveCookies } from 'botmation/actions/cookies'
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/output'

// Instagram specific BotAction's
// import { favoriteAllFrom } from 'botmation/bots/instagram/actions/feed'
import { login } from 'botmation/bots/instagram/actions/auth'
import { closeTurnOnNotificationsModal } from 'botmation/bots/instagram/actions/modals'

// Instagram helpers
import { getInstagramBaseUrl, getInstagramLoginUrl } from 'botmation/bots/instagram/helpers/urls'
import { isGuest, isLoggedIn } from 'botmation/bots/instagram/helpers/auth'
import { isTurnOnNotificationsModalActive } from 'botmation/bots/instagram/helpers/modals'
import { logError } from 'botmation/helpers/console'

// Expiremental Pipe
// import { BotActionsPipe as Bot } from 'botmation/factories/bot-actions-pipe' // what if rename to PipeActionsBot?
import { BotActionsChain as Bot } from 'botmation/factories/bot-actions-chain' // what if rename to ChainActionsBot?
import { indexedDBStore, setIndexedDBValue, getIndexedDBValue } from 'botmation/actions/indexed-db'
import { files } from 'botmation/actions/files'
import { pipe } from 'botmation/actions/pipe'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  try {
    browser = await puppeteer.launch({headless: false})
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    await Bot(page)(
      log('Botmation running'),
      // Takes the name of the file to load cookies from
      // Match this value with the same used in saveCookies()
      files({cookies_directory: 'simple'})(
        loadCookies('instagram'),
      ),

      goTo(getInstagramBaseUrl()),

      // test
      pipe({id: 10, newPipeTest: 'success'})(
        log('Test #1 Complete')
      ),
      // end test

      // test 3
      log('Test #3 start'),
      setIndexedDBValue('key-3test', 'value-3test', 'zzzStore2', 'testDB5', 2),
      pipe()(
        getIndexedDBValue('key-3test', 'zzzStore2', 'testDB5', 2),
        log('Test #3 results piped:'),
      ),

      // test 5, higher order func
      log('Starting Test #5 indexedDBStore()()'),
      indexedDBStore('testDB5', 3, 'zzzStore5')( // accessing a store in a database we did not create, causes error?
        log('going to set, get, then log a value from IndexedDB'),
        setIndexedDBValue('some-key-test5', 'some-value-test5'),
        getIndexedDBValue('some-key-test5'),
        log('Results of Test #5 are piped:')
      ),
      
      // inline, hackish but do-able
      // async(page) => {
      //
      // },
      
      // lets log in, if we are a guest
      log('checking is guest status'),
      givenThat(isGuest) (
        log('is guest so logging in'),
        goTo(getInstagramLoginUrl()),
        login({username: 'account', password: 'password'}),
        files({cookies_directory: 'simple'})(
          saveCookies('instagram'), // the Bot will skip login, on next run, by loading cookies 
        ),
        log('Saved Cookies')
      ),

      // in case that log in failed, lets check before we operate
      givenThat(isLoggedIn)(
        log('is logged in'),
        // After initial load, Instagram sometimes prompts the User with a modal...
        // Deal with the "Turn On Notifications" Modal, if it shows up
        givenThat(isTurnOnNotificationsModalActive)(
          closeTurnOnNotificationsModal
        ),
  
        // Go to the main homepage/feed
        // goTo(getInstagramBaseUrl()),
        // wait(50000),
        screenshot('test4534'),
        // favoriteAllFrom('user1', 'user2'), // TBI (to be implemented) // TODO: implement
      ),


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