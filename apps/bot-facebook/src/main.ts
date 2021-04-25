import puppeteer from 'puppeteer'

import {
  chain,
  files,
  log,
  givenThat,
  loadCookies,
  saveCookies,
  logError,
  wait,
  screenshot,
} from '@botmation/core'

import {
  login,
  isGuest,
  isLoggedIn,
  goToHome,
  createAPost,
  isPushNotificationsRequestVisible,
  closeModal
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
        login({email: 'email', password: 'password'}), // <- put your username and password here
        wait(2000),
        givenThat(isPushNotificationsRequestVisible)(
          closeModal
        ),
        files()(
          saveCookies('facebook')
        ),
      ),

      log('login complete'),

      givenThat(isLoggedIn)(
        createAPost('hello world'),
        wait(3000),
        goToHome,
        wait(1200),
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
