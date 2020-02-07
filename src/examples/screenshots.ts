/**
 * @description  Simple Example Script
 */
import 'module-alias/register'
import puppeteer from 'puppeteer'

import { Botmation } from 'botmation/botmation.class'

// General BotAction's
import { log, logError } from 'botmation/actions/console'
import { forAll } from 'botmation/actions/utilities'
import { goTo } from 'botmation/actions/navigation'
import { screenshot, screenshotAll } from 'botmation/actions/output'
import { getDefaultGoToPageOptions } from 'botmation/helpers/navigation'

(async () => {
  let browser: puppeteer.Browser

  // List of sites to screenshot
  const newsSites = [
    'cnn.com',
    'nytimes.com',
    'foxnews.com',
    'wsj.com',
    'forbes.com',
    'global.chinadaily.com.cn',
    'timesofindia.indiatimes.com'
  ]

  // Wrap in try/catch, because the bot will throw on Errors requiring dev attention
  try {
    browser = await puppeteer.launch({headless: false})
    const bot = await Botmation.asyncConstructor(browser)

    // Bot's automations
    await bot.actions(
      log('MationBot running'),

      // Taking screenshots of many sites 
      // filenames are the url's
      // This function does a lot underneath the hood, less customization though
      screenshotAll('facebook.com', 'twitter.com'),

      // use the screenshot() BotAction to specify the filename
      // but you must navigate to where you want to snapshot first
      goTo('http://google.com'),
      screenshot('google-homepage-yea-its-an-example'),

      // using a forAll() to take many screenshots while 
      // specifying the screenshot filename
      forAll(newsSites)(
        (siteName) => ([
          // 1) The bot visits the site
          goTo('https://' + siteName, getDefaultGoToPageOptions({waitUntil: 'domcontentloaded'})), // these sites sometimes have lingering network calls, could be ads, could be a service down
          // 2) The bot snaps a screenshot then saves it as:
          screenshot('news-' + siteName)
        ])
      ),
    
      log('Done taking screenshots'),
    )
    
    await bot.closePage()
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  } finally {
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})();