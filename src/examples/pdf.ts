/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

import { chain } from 'botmation/actions/assembly-lines'
import { log } from 'botmation/actions/console'
import { goTo } from 'botmation/actions/navigation'
import { savePDF } from 'botmation/actions/files'

import { logError } from 'botmation/helpers/console'

/**
 * @description   Example on how to use savePDF()
 * 
 * @note          Launching the browser without headless (headless: false) breaks the saving of PDF functionality
 *                See https://github.com/puppeteer/puppeteer/issues/1829
 */

(async () => {
  try {
    let browser: puppeteer.Browser

    browser = await puppeteer.launch({headless: true}) // headless: false breaks PDF saving!!! see https://github.com/puppeteer/puppeteer/issues/1829
    const page = await browser.newPage()

    // Bot's automations
    await chain(
      log('Botmation running'),
     
      //  with special note about headless requirements
      log('Lets save a PDF of Github Homepage'),
      goTo('https://github.com/'),
      savePDF('github-homepage'),
      log('PDF saved')
    )(page)
    
    await browser.close()
  } catch(error) {
    logError(error)
  }
})();