/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'

// General BotAction's
import { chain } from 'botmation/actions/assembly-lines'
import { log } from 'botmation/actions/console'
import { forAll } from 'botmation/actions/utilities'
import { goTo } from 'botmation/actions/navigation'
import { screenshot, screenshotAll } from 'botmation/actions/files'
import { enrichGoToPageOptions } from 'botmation/helpers/navigation'
import { logError } from 'botmation/helpers/console'
import { files } from 'botmation/actions/files'
import { errors } from 'botmation/actions/errors'

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
    const page = await browser.newPage()

    // Bot's automations
    await chain(
      log('Botmation running'),

      // Taking screenshots of many sites 
      // filenames are the url's
      // This function does a lot underneath the hood, less customization though
      files({screenshots_directory: 'screens'})(
        errors('Saving Screenshots in ./screens Directory')( // added in case "/screens" is missing
          screenshotAll(['http://facebook.com', 'http://twitter.com']),
        )
      ),

      // use the screenshot() BotAction to specify the filename
      // but you must navigate to where you want to snapshot first
      goTo('http://google.com'),
      screenshot('google-homepage-example'),

      // using a forAll() to take many screenshots while 
      // specifying the screenshot filename
      forAll(newsSites)(
        (siteName) => ([
          // 1) The bot visits the site
          goTo('https://' + siteName, enrichGoToPageOptions({waitUntil: 'domcontentloaded'})), // these sites sometimes have lingering network calls, could be ads, could be a service down
          // 2) The bot snaps a screenshot then saves it as:
          screenshot('news-' + siteName)
        ])
      ),
    
      log('Done taking screenshots'),

    )(page)
    
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