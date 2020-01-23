/**
 * @description  Simple Example Script
 */
import 'module-alias/register'
import puppeteer from 'puppeteer'

import { MationBot } from '@botmation'

import { goTo } from '@botmation/actions/navigation'
import { favoriteAllFrom } from '@botmation/actions/feed'
import { warning, log } from '@botmation/actions/console'
import { wait } from '@botmation/actions/utilities'

// Main Script
(async () => {
  let browser: puppeteer.Browser

  // Wrap in try/catch, because the bot will throw on Errors requiring dev attention
  try {
    // Launch Puppeteer to grab the Browser it manages
    browser = await puppeteer.launch({headless: false})

    // Start up the Instagram bot to run in the Puppeteer Browser
    // Apart from setup, it handles logging in so your bot is ready to go
    const bot = await MationBot.asyncConstructor(browser)

    // Actions run in sequence
    await bot.actions(
      log('MationBot running'),
      warning('There must be a 5sec delay from seeing this warning and the next message'),
      wait(5000),
      // goTo('feed'), // TODO: figure out the url, and request it anyway, to be sure we're on the feed page since it won't navigate if already there
      favoriteAllFrom('user1', 'user2'),
      log('Done interacting with feed, now going to view stories'),
      warning('3 sec delay'),
      wait(3000)
    )
    //   viewAllStoriesFrom('user1', 'user2')
    
    await bot.destroy() // closes the tab inside the browser that it was crawling/acting on
  } catch (error) {
    console.error(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})();