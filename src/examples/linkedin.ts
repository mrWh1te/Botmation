import puppeteer from 'puppeteer'

// General BotAction's
import { log } from 'botmation/actions/console'
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/files'

// More advanced BotAction's
import { chain } from 'botmation/actions/assembly-lines'
import { login } from 'botmation/sites/linkedin/actions/auth'

// Helper for creating filenames that sort naturally
const generateTimeStamp = (): string => {
  let x = new Date();

  // Title the screenshot file with a timestamp
  // "year-month-date-hours-minutes" ie "2020-8-21-13-20"
  return x.getFullYear() + '-' + 
       ( x.getMonth() + 1 ) + '-' + 
         x.getDate() + '-' + 
         x.getHours() + '-' + 
         x.getMinutes();
}

// Main Script
(async () => {
 let browser: puppeteer.Browser

 try {
   browser = await puppeteer.launch({headless: false})
   const pages = await browser.pages()
   const page = pages.length === 0 ? await browser.newPage() : pages[0]
   
   await chain(
    log('Botmation running'),

    login('linked-in-email@example.com', 'linkedin-password'),

    goTo('https://www.linkedin.com/feed/'),
    screenshot(generateTimeStamp()) // filename ie "2020-8-21-13-20.png"
   
   )(page)

 } catch(error) {
   console.error(error)
 }
 
})()