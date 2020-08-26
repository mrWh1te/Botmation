import puppeteer from 'puppeteer'

// General BotAction's
import { log } from 'botmation/actions/console'
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/files'

// More advanced BotAction's
import { pipe, $$, saveCookies, loadCookies, wait } from 'botmation'
import { login } from 'botmation/sites/linkedin/actions/auth'
import { toggleMessagingOverlay } from 'botmation/sites/linkedin/actions/messaging'
import { likeAllFrom } from 'botmation/sites/linkedin/actions/feed'
import { goToFeed } from 'botmation/sites/linkedin/actions/navigation'

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
   
   await pipe()(
    log('Botmation running'),

    login('youremail@example.com', 'your-password'),
    // loadCookies('linkedin'),

    goToFeed,

    wait(5000), // tons of stuff loads... no rush
    toggleMessagingOverlay, // be default, loads in open state

    saveCookies('linkedin'),
    screenshot(generateTimeStamp()), // filename ie "2020-8-21-13-20.png"

    likeAllFrom('Peter Parker', 'Harry Potter'),
   
   )(page)

 } catch(error) {
   console.error(error)
 }
 
})()