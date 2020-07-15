/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

// General BotAction's
import { log } from 'botmation/actions/console'
import { givenThat, wait, clearPipe, pipe } from 'botmation/actions/utilities'
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
import { BotActionsPipeFactory5 as Bot } from 'botmation/factories/bot-actions-pipe.factory'
import { setIndexDBStoreDataKeyValue, getIndexDBStoreDataKeyValue, indexedDBStore, setIKeyVal3, getIKeyVal3 } from 'botmation/actions/indexed-db'
import { files } from 'botmation/actions/files'

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
      pipe({id: 5, name: 'Michael'}),
      log('Test #1 Complete'),
      clearPipe,
      // end test

      log('Test #2 Commence'),
      setIndexDBStoreDataKeyValue('testDB5', 1, 'testStore2', 'testKey2', 'It WORKS!'), // works
      getIndexDBStoreDataKeyValue('testDB5', 1, 'testStore2', 'testKey2'), // works
      log('Test #2 Results, include piped value?'),
      // end 2nd test

      clearPipe,

      // test 3
      log('Test #3 start'),
      setIKeyVal3('key-3test', 'value-3test', 'zzzStore2', 'testDB5', 2), // broken, only different store names..... is it 1 store per app? o.O
      getIKeyVal3('key-3test', 'zzzStore2', 'testDB5', 2),
      log('Test #3 results piped:'),

      clearPipe,

      // test 5, higher order func
      // log('Starting Test #5 indexedDBStore()()'),


      // TODO: get indexedDBStore working
      indexedDBStore('testDB5', 3, 'zzzStore5')( // accessing a store in a database we did not create, causes error?
        log('going to set, get, then log a value from IndexedDB'),
        setIKeyVal3('some-key-test5', 'some-value-test5'),
        getIKeyVal3('some-key-test5'),
        log('Results of Test #5 are piped:')
      ),

      clearPipe,


      // Takes the name of the file to load cookies from
      // Match this value with the same used in saveCookies()
      files()(
        loadCookies('instagram'),
      ),

      // inline, hackish
      // async(page) => {
      //
      // },
      
      // Special action that resolves a Promise for TRUE
      // only on TRUE, does it run the chain of actions
      givenThat(isGuest) (
        goTo(getInstagramLoginUrl()),
        login({username: 'lagmahol', password: 'malu.l4ge'}),
        files()(
          saveCookies('instagram'), // the Bot will skip login, on next run, by loading cookies 
        ),
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
      screenshot('test4534'),
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