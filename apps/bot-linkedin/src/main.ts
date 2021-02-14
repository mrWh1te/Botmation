import puppeteer from 'puppeteer'

import {
  log,
  screenshot,
  loadCookies,
  pipe,
  saveCookies,
  wait,
  errors,
  givenThat
} from '@botmation/core'

import {
  goHome,
  goToFeed,
  login,
  isGuest,
  isLoggedIn,
  toggleMessagingOverlay,
  likeUserPostsFrom
} from '@botmation/linkedin'
import { generateTimeStamp } from './helper/timestamp'

// Main Script
(async () => {
 let browser: puppeteer.Browser

 try {
   browser = await puppeteer.launch({headless: false})
   const pages = await browser.pages()
   const page = pages.length === 0 ? await browser.newPage() : pages[0]

   const linkedin_bot = pipe()(
    log('Botmation running'),

    errors('load LinkedIn cookies')(
      loadCookies('linkedin')
    ),

    goHome,

    givenThat(isGuest)(
      login('account-email', 'account-password'), // <-- put in bot's LinkedIn email & password
      wait(500),
      saveCookies('linkedin')
    ),

    wait(5000), // tons of stuff loads... no rush

    givenThat(isLoggedIn)(
      goToFeed,

      toggleMessagingOverlay, // by default, Messaging Overlay loads in open state
      screenshot(generateTimeStamp()), // filename ie "2020-8-21-13-20.png"

      likeUserPostsFrom('Peter Parker', 'Harry Potter')
    )
   )

   // run the bot
   await linkedin_bot(page)

 } catch(error) {
   console.error(error)
 }

})()
