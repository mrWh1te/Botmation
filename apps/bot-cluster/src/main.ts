import { Page } from 'puppeteer'
import { Cluster } from 'puppeteer-cluster'

// Actions
import {
  chain,
  goTo,
  screenshot,
  log,
  logError
} from '@botmation/core'

(async () => {
  try {
    // Setup bot(s) - reusing the same bot code, but can setup various bots
    const screenshotBot = async ({ page, data: url }: {page: Page, data: any}) =>
      await chain(
        goTo(url),
        screenshot(url.replace(/[^a-zA-Z]/g, '_')),
        log('screenshot of ' + url + ' saved')
      )(page)

    // Setup the Puppeteer-Cluster of Browsers / Pages for the bots to operate on
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER, // browser / page, Incognito mode
      maxConcurrency: 3 // max number of concurrent bots
    })

    // Run the bots
    cluster.queue('https://nodejs.org/', screenshotBot)
    cluster.queue('https://duckduckgo.com/', screenshotBot)
    cluster.queue('https://www.typescriptlang.org/', screenshotBot)

    // Wait for it to finish up
    await cluster.idle()
    await cluster.close()
  } catch(error) {
    logError(error)
  }
})()
