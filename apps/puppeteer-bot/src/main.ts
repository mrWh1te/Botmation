import { sleep } from '@botmation/core'

import {
  browserPage,
  browser
} from '@botmation/puppeteer'


(async () => {
  try {
    // Inject Puppeteer browser instance
    const bot = browser({headless: false})(
      // Inject Puppeteer browser page instance
      browserPage()(
        // has inject `page` (& 'browser') for assembled Actions that rely on Puppeteer.page
        async({page}) => {
          await page.goto('https://duckduckgo.com')
          await sleep(10000)
        }
      )
    )

    await bot()

  } catch (error) {
    console.error(error)
  }

})()
