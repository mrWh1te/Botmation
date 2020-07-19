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
import { login } from 'botmation/bots/instagram/actions/auth'
import { closeTurnOnNotificationsModal } from 'botmation/bots/instagram/actions/modals'

// Instagram helpers
import { getInstagramBaseUrl } from 'botmation/bots/instagram/helpers/urls'
import { isGuest, isLoggedIn } from 'botmation/bots/instagram/helpers/auth'
import { isTurnOnNotificationsModalActive } from 'botmation/bots/instagram/helpers/modals'
import { logError } from 'botmation/helpers/console'

// Expiremental Pipe
// import { BotActionsPipe as Bot } from 'botmation/factories/bot-actions-pipe' // what if rename to PipeActionsBot?
// import { BotActionsChain as Bot } from 'botmation/factories/bot-actions-chain' // what if rename to ChainActionsBot?
import { indexedDBStore, setIndexedDBValue, getIndexedDBValue } from 'botmation/actions/indexed-db'
import { files } from 'botmation/actions/files'
import { pipe } from 'botmation/actions/pipe'
import { chain } from 'botmation/actions/chain'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  try {
    browser = await puppeteer.launch({headless: true})
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    await chain(
      log('Botmation running'),
      
      // Sets up the injects for BotFileAction's (optional)
      files({cookies_directory: 'simple'})(
        // Takes the name of the file to load cookies from
        // Match this value with the same used in saveCookies()
        loadCookies('instagram'),
      ),

      goTo(getInstagramBaseUrl()),

      // Chain-link as a pipe example
      pipe({id: 10, newPipeTest: 'success'})(
        log('Test #1 Complete')
      ),

      // test 3
      log('Test #3 start'),
      // Pipeable functions that DON'T return values can be used within a chain!
      setIndexedDBValue('key-3test', 'value-3test', 'zzzStore2', 'testDB5', 2),
      pipe()(
        // But others rely on the pipe to return data to subsequent pipeable functions
        getIndexedDBValue('key-3test', 'zzzStore2', 'testDB5', 2),
        log('Test #3 results piped:'), // this will print the piped value, in this case `value-3test`
      ),

      // test 5, higher order func
      log('Starting Test #5 indexedDBStore()()'),
      // Sets up the injects for BotIndexedDBAction's (optional)
      indexedDBStore('testDB10', 1, 'zzzStore5')(
        log('going to set, get, then log a value from IndexedDB'),
        setIndexedDBValue('some-key-test5', 'some-value-test5'),
        getIndexedDBValue('some-key-test5'),
        log('Results of Test #5 are piped:')
      ),
      
      // inline, hackish but do-able if your doing something on the fly
      //  follow the rules, don't return a value in a chain
      // async(page) => {
      //
      // },
      
      // lets log in, if we are a guest
      log('checking is guest status'),
      givenThat(isGuest) (
        log('is guest so logging in'),
        login({username: 'account', password: 'password'}),
        files({cookies_directory: 'simple'})(
          saveCookies('instagram'), // the Bot will skip login, on next run, by loading cookies 
        ),
        log('Saved Cookies')
      ),

      // in case that log in failed, lets check before we operate as a logged in user
      givenThat(isLoggedIn)(
        log('is logged in'),
        // After initial load, Instagram sometimes prompts the User with a modal...
        // Deal with the "Turn On Notifications" Modal, if it shows up
        givenThat(isTurnOnNotificationsModalActive)(
          closeTurnOnNotificationsModal
        ),
  
        screenshot('logged-in'),
      ),


      log('Done'),
    )(page)

  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  } finally {
    // Uncomment this code to exit the program after the script completes:
    // setTimeout(async() => {
    //   if (browser) await browser.close()
    // })
  }
  
})()