import puppeteer from 'puppeteer'

import {
  chain,
  goTo,
  screenshot,
  log,
  logError
} from '@botmation/core'


(async () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  try {
    // Get a Browser instance from Puppeteer
    browser = await puppeteer.launch({headless: false}) // headless = false => shows the browser; true => runs the code without displaying the browser (headless mode)

    // Grab a Page from the Browser for the bot to operate in
    const pages = await browser.pages()
    page = pages.length === 0 ? await browser.newPage() : pages[0]

    // Compose the bot
    const bot = chain(
      log('Bot is running'),
      goTo('https://www.duckduckgo.com/'),
      screenshot('duckduckgo-homepage'),
      log('Screenshot taken')
    )

    // Run the bot on a page
    await bot(page)

    // Finish up
    await page.close()
  } catch (error) {
    logError(error)

    setTimeout(async() => {
      if (page) await page.close()
    })
  }

})()
