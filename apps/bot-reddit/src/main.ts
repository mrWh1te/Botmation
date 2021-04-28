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
  createAPost,
} from '@botmation/reddit'

const postText = `This tweet was published by a Botmation bot!

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
        loadCookies('reddit'),
      ),

      goToHome,

      // login if guest
      givenThat(isGuest)(
        login('account', 'password'), // <- put your username and password here
        files()(
          saveCookies('reddit')
        ),
        wait(3000) // let things load
      ),

      log('login complete'),

      givenThat(isLoggedIn)(
        createAPost('AskReddit', 'Example Title', postText),
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
