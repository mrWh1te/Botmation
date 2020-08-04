/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

import { Botmation } from 'botmation'

// General BotAction's
import { log } from 'botmation/actions/console'
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/files'

// helpers
import { logError } from 'botmation/helpers/console'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  try {
    // Launch Puppeteer to grab the Browser it manages
    browser = await puppeteer.launch({headless: false})

    // Start up the Instagram bot to run in the Puppeteer Browser
    const googleBot = await Botmation.asyncConstructor(browser)

    // Actions run in sequence
    await googleBot.actions(
      log('Botmation running'),
      goTo('https://google.com'),
      screenshot('google-homepage'),
      log('Screenshot of Google.com saved')
    )
    
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})()