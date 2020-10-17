/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

// General BotAction's
import { chain } from 'botmation/actions/assembly-lines'
import { click, type } from 'botmation/actions/input'
import { log } from 'botmation/actions/console'
import { goTo, waitForNavigation } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/files'

import { logError } from 'botmation/helpers/console'

class ExampleSiteBot {
  private page: puppeteer.Page;
  constructor(page: puppeteer.Page) {
    this.page = page;
  }
  public async login(username: string, password: string) {
    await chain(
      goTo('http://example.com/login.html'),
      click('form input[name="username"]'),
      type(username),
      click('form input[name="password"]'),
      type(password),
      click('form button[type="submit"]'),
      waitForNavigation,
      log('Login Complete')
    )(this.page);
  }
  public async takeAPhoto(fileName: string) {
    await screenshot(fileName)(this.page);
  }
}

(async () => {
  let browser: puppeteer.Browser

  try {
    // Get the browser from Puppeteer
    browser = await puppeteer.launch({headless: false}) // {headless: false} shows the browser, {headless: true} hides the browser during execution
    const page = await browser.newPage()

    const bot = new ExampleSiteBot(page)

    // Run the bot
    await bot.login('username', 'password')
    await bot.takeAPhoto('home-page')
    
    // close the page when you're done
    await page.close()

    
    // Done
    await browser.close()
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})()