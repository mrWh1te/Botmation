import puppeteer from 'puppeteer'

import {
  chain,
  log,
  goTo,
  savePDF,
  logError
} from '@botmation/core'

/**
 * @description   Example on how to use savePDF()
 *
 * @note          Launching the browser without headless (headless: false) breaks the saving of PDF functionality
 *                See https://github.com/puppeteer/puppeteer/issues/1829
 */

(async () => {
  try {
    let browser: puppeteer.Browser

    // headless: false breaks PDF saving; therefore it MUST be `true`
    // see https://github.com/puppeteer/puppeteer/issues/1829
    browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()

    await chain(
      log('Lets save a PDF of DuckDuckGo Homepage'),
      goTo('http://duckduckgo.com/'),
      savePDF('duckduckgo-homepage'),
      log('PDF saved')
    )(page)

    await browser.close()
  } catch(error) {
    logError(error)
  }
})();
