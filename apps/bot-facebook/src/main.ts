import puppeteer from 'puppeteer'

import {
  chain,
  files,
  log,
  givenThat,
  saveCookies,
  logError,
  wait,
  screenshot,
  click,
  loadCookies,
} from '@botmation/core'

import {
  login,
  isGuest,
  isLoggedIn,
  goToHome,
  logout
} from '@botmation/facebook'

(async () => {
  let browser: puppeteer.Browser

  try {
    browser = await puppeteer.launch({headless: false})
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    await chain(
      log('Botmation running'),

      goToHome,

      files()(
        loadCookies('facebook'),
      ),

      goToHome,

      // login if guest
      givenThat(isGuest)(
        login({username: 'email', password: 'password'}), // <- put your username and password here
        wait(3000),
        click('body'), // on 1st login, app prompts user for notifications which covers the app in a translucent white cover to click away
        files()(
          saveCookies('facebook')
        ),
        wait(3000) // let things load
      ),

      log('login complete'),

      givenThat(isLoggedIn)(
        screenshot('logged-in'),
        logout,
        wait(1000),
        screenshot('logged-out')
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
