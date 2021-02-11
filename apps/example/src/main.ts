/**
 * @description  Simple Example Script
 */
import * as puppeteer from 'puppeteer'
import { chain } from '@botmation/core'

// General BotAction's
import { log } from '@botmation/core'
import { goTo } from '@botmation/core'
import { screenshot } from '@botmation/core'
import { logError } from '@botmation/core'

import { login } from '@botmation/instagram'

(async () => {
  let browser: puppeteer.Browser

  try {
    // Get the Browser from Puppeteer
    browser = await puppeteer.launch({headless: false}) // {headless: false} shows the browser, run in headless if you don't care to see

    // Grab a Page from the Browser for the bot to operate in
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    // Run the chain of actions
    await chain(
      log('Bot running'),
      screenshot('before-login'),
      goTo('https://www.instagram.com/accounts/login/'),
      screenshot('insta-login'),
      login({username: 'instagram-username', password: 'instagram-password'}),
      screenshot('after-login'),
      log('Screenshot taken')
    )(page)

    await browser.close()
  } catch (error) {
    logError(error)

    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }

})()
