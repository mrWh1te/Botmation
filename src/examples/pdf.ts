/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

import { Botmation } from 'botmation'

// General BotAction's
import { log } from 'botmation/actions/console'
import { goTo } from 'botmation/actions/navigation'
import { savePDF } from 'botmation/actions/output'

/**
 * @description   Example on how to use savePDF()
 * 
 * @note          Launching the browser without headless (headless: false) breaks the saving of PDF functionality
 *                See https://github.com/puppeteer/puppeteer/issues/1829
 */

(async () => {
  let browser: puppeteer.Browser

    browser = await puppeteer.launch({headless: true}) // headless: false breaks PDF saving!!! see https://github.com/puppeteer/puppeteer/issues/1829
    const bot = await Botmation.asyncConstructor(browser)

    // Bot's automations
    await bot.actions(
      log('Botmation running'),
     
      //  with special note about headless requirements
      log('Lets save a PDF of Github Homepage'),
      goTo('https://github.com/'),
      savePDF('github-homepage'),
      log('PDF saved')
    )
    
  }
  
)();