import puppeteer from 'puppeteer'

// General BotAction's
import { log } from 'botmation/actions/console'
import { screenshot } from 'botmation/actions/files'
import { loadCookies } from 'botmation/actions/cookies'

// More advanced BotAction's
import { pipe, saveCookies, wait, errors, givenThat } from 'botmation'
import { login, isGuest, isLoggedIn } from 'botmation/sites/linkedin/actions/auth'
import { toggleMessagingOverlay } from 'botmation/sites/linkedin/actions/messaging'
import { likeUserPostsFrom } from 'botmation/sites/linkedin/actions/feed'
import { goHome, goToFeed } from 'botmation/sites/linkedin/actions/navigation'

// Helper for creating filenames that sort naturally
const generateTimeStamp = (): string => {
  let x = new Date();

  // Title the screenshot file with a timestamp
  // "year-month-date-hours-minutes" ie "2020-8-21-13-20"
  return x.getFullYear() + '-' + 
       ( x.getMonth() + 1 ) + '-' + 
         x.getDate() + '-' + 
         x.getHours() + '-' + 
         x.getMinutes() + '-' + 
         x.getSeconds();
}

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