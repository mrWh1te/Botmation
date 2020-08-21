/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

// General BotAction's
import { log } from 'botmation/actions/console'
import { givenThat } from 'botmation/actions/utilities'
import { loadCookies, saveCookies } from 'botmation/actions/cookies'
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/files'
import { logError } from 'botmation/helpers/console'

// Instagram specific BotAction's
import { login, isGuest, isLoggedIn } from 'botmation/sites/instagram/actions/auth'
import { closeTurnOnNotificationsModal, isTurnOnNotificationsModalActive } from 'botmation/sites/instagram/actions/modals'

// Instagram helpers
import { getInstagramBaseUrl } from 'botmation/sites/instagram/helpers/urls'

// More advanced BotAction's
import { chain } from 'botmation/actions/assembly-lines'
import { files } from 'botmation/actions/files'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  try {
    browser = await puppeteer.launch({headless: false})
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
      
      // inline, hackish but do-able if your doing something on the fly
      //  follow the rules, don't return a value in a chain
      // async(page) => {
      //
      // },
      
      // lets log in, if we are a guest
      log('checking Guest status'),
      givenThat(isGuest) (
        log('is guest so logging in'),
        login({username: 'account', password: 'password'}), // <- put your username and password here
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
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})()