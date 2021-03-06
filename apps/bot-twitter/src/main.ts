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
} from '@botmation/core'

import {
  login,
  isGuest,
  isLoggedIn,
  goToHome,
  tweet,
} from '@botmation/twitter'

const tweetMessage = `This tweet was published by a Botmation bot!

https://botmation.dev/`;

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

      goToHome,

      // login if guest
      givenThat(isGuest)(
        login({username: 'account', password: 'password'}), // <- put your username and password here
        files()(
          saveCookies('twitter')
        ),
        wait(3000) // let things load
      ),

      log('login complete'),

      givenThat(isLoggedIn)(
        tweet(tweetMessage),
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
