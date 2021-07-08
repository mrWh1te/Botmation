import { sleep } from '@botmation/core'

import {
  browserPage,
  browser
} from '@botmation/v2core'


(async () => {
  try {
    // // Get a Browser instance from Puppeteer
    // browser = await puppeteer.launch({headless: false}) // headless = false => shows the browser; true => runs the code without displaying the browser (headless mode)

    // // Grab a Page from the Browser for the bot to operate in
    // const pages = await browser.pages()
    // page = pages.length === 0 ? await browser.newPage() : pages[0]

    // // Compose the bot
    // const bot = chain(
    //   log('Bot is running'),
    //   goTo('https://www.duckduckgo.com/'),
    //   screenshot('duckduckgo-homepage'),
    //   log('Screenshot taken')
    // )

    // concept
    const bot = browser({headless: false})(
      browserPage()(
        // has inject `page` for BotActions that rely on Puppeteer.page working instance
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
