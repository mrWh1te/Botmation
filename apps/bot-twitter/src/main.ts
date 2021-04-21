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
  wait,
} from '@botmation/core'

import {
  login,
  isGuest,
  isLoggedIn,
  goToHome,
  logout,
} from '@botmation/twitter'

(async () => {
  let browser: puppeteer.Browser

  try {
    browser = await puppeteer.launch({headless: false})
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    await chain(
      log('Botmation running'),

      files()(
        loadCookies('twitter'),
      ),

      log('cookies loaded'),

      goToHome,
      wait(3000),

      log('home navigated'),

      // login if guest
      givenThat(isGuest) (
        login({username: 'account', password: 'password'}), // <- put your username and password here
        files()(
          saveCookies('twitter')
        ),
        wait(3000) // let things load
      ),

      log('login complete'),

      givenThat(isLoggedIn)(
        log('is logged in check complete'),
        screenshot('logged-in'),
        log('screenshot taken'),
        logout,
        wait(2000),
        screenshot('logout')
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
