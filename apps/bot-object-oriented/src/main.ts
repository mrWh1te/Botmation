import puppeteer from 'puppeteer'

import { PhotoBot } from './bot.class'

import { logError } from '@botmation/core'

(async () => {
  let browser: puppeteer.Browser

  try {
    // Get the browser from Puppeteer
    browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    const bot = new PhotoBot(page)

    // Run the bot
    await bot.takeAPhoto('http://duckduckgo.com')
    await bot.takeAPhoto('http://google.com')
    await bot.takeAPhoto('http://bing.com')

    // close the page when done
    await bot.closePage()

    // Done
    await browser.close()
  } catch (error) {
    logError(error)

    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }

})()
