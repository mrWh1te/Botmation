import { wait } from '@botmation/v2core'

import {
  browserPage,
  browser,
  goTo,
  goBack
} from '@botmation/puppeteer'

(async () => {
  try {
    // Inject Puppeteer browser instance
    const bot = browser({headless: false})(
      // Inject Puppeteer browser page instance
      browserPage()(
        goTo('https://duckduckgo.com'),
        wait(1000),
        goTo('https://google.com'),
        wait(1000),
        goBack(),
        wait(10000)
      )
    )

    await bot()

  } catch (error) {
    console.error(error)
  }

})()
