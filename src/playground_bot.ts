/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

// General BotAction's
import { chain } from 'botmation/actions/assembly-lines'
import { log } from 'botmation/actions/console'
import { goTo } from 'botmation/actions/navigation'
// import { screenshot } from 'botmation/actions/files'

import { $$, pipe } from 'botmation';

// helpers
import { logError } from 'botmation/helpers/console'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  try {
    // Launch Puppeteer to grab the Browser it manages
    browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    // Actions run in sequence
    await chain(
      // log('Botmation running'),
      // goTo('https://google.com'),
      // screenshot('google-homepage'),
      // log('Screenshot of Google.com saved')
      goTo('http://localhost:8080'),
      pipe()(
        $$('section p'),
        log()
      )
    )(page)
    
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})()