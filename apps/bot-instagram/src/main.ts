import puppeteer from 'puppeteer'

import {
  chain,
  files,
  log,
  givenThat,
  loadCookies,
  saveCookies,
  screenshot,
  logError,
  waitForNavigation,
  wait,
} from '@botmation/core'

import {
  login,
  isGuest,
  isLoggedIn,
  closeTurnOnNotificationsModal,
  isTurnOnNotificationsModalActive,
  goToHome,
  viewStories,
  isSaveYourLoginInfoActive,
  clickSaveYourLoginInfoNoButton,
  logout,
  goToExplore,
  goToMessaging,
  goToSettings
} from '@botmation/instagram'

(async () => {
  let browser: puppeteer.Browser

  try {
    browser = await puppeteer.launch({headless: false})
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    // Instagram BotActions were developed for the UI responsiveness in desktop widths
    // specifically, in mobile widths, the `viewStories` BotAction will open your story
    // instead of the presentation of stories
    await page.setViewport({
      width: 1000,
      height: 600,
      deviceScaleFactor: 1,
    });

    await chain(
      log('Botmation running'),

      // Sets up the injects for BotFileAction's (optional)
      files()(
        // Takes the name of the file to load cookies from
        // Match this value with the same used in saveCookies()
        loadCookies('instagram'),
      ),

      goToHome,

      // inline, hackish but do-able if your doing something on the fly
      //  follow the rules, don't return a value in a chain
      // async(page) => {
      //
      // },

      // lets log in, if we are a guest
      givenThat(isGuest) (
        login({username: 'lagmahol', password: 'jesu1t2007!'}), // <- put your username and password here
        files()(
          saveCookies('instagram'), // the Bot will skip login, on next run, by loading cookies
        ),

      ),

      // in case that log in failed, lets check before we operate as a logged in user
      givenThat(isLoggedIn)(

        givenThat(isSaveYourLoginInfoActive)(
          clickSaveYourLoginInfoNoButton,
          waitForNavigation,
          log('save ur login info closed')
        ),

        // Deal with the "Turn On Notifications" Modal, if it shows up
        givenThat(isTurnOnNotificationsModalActive)(
          closeTurnOnNotificationsModal
        ),

        screenshot('logged-in'),

        // viewStories,
        log('screenshot taken'),

        wait(12000),

        goToExplore,

        wait(2000),

        goToMessaging,

        wait(2000),

        goToSettings,


        wait(5000),

        // logout,

        // log('logout complete'),

        wait(15000)
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
