/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'
import { Botmation } from 'botmation'

// General BotAction's
import { log } from 'botmation/actions/console'
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/output'
import { logError } from 'botmation/helpers/console'

(async () => {
  let browser: puppeteer.Browser

  try {
    // Get the browser from Puppeteer
    browser = await puppeteer.launch({headless: false}) // {headless: false} shows the browser, run in headless if you don't care to see

    // We can use Botmation's static asyncConstructor method to grab a page, from the provided browser, for the bot
    const bot = await Botmation.asyncConstructor(browser)

    // Run the chain of actions
    await bot.actions(
      log('Bot running'),
      goTo('https://google.com'),
      screenshot('google-homepage'),
      log('Screenshot (Google) taken')
    )
    
    // close the page when you're done
    await bot.closePage()

    // Simple example on using the constructor, not the static async "constructor" method
    const page = await browser.newPage()

    const bot2 = new Botmation(page)

    await bot2.actions(
      log('Bot2 running'),
      goTo('https://apple.com'),
      screenshot('apple-homepage'),
      log('Screenshot (Apple) taken')
    )

    // Done
    await page.close()
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})()