/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

import { Botmation } from 'botmation'

// General BotAction's
import { log, warning } from 'botmation/actions/console'
import { wait } from 'botmation/actions/utilities'

// helpers
import { logError } from 'botmation/helpers/console'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  try {
    // Launch Puppeteer to grab the Browser it manages
    browser = await puppeteer.launch({headless: false})

    // Start up the Instagram bot to run in the Puppeteer Browser
    const instagramBot = await Botmation.asyncConstructor(browser)

    // Actions run in sequence
    await instagramBot.actions(
      log('Botmation running'),
      warning('Starting Test'),

      wait(1000),
      log('Test Complete'),
    )
    
    // close up
    await instagramBot.closePage()
    await browser.close()
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})()