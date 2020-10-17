import { Cluster } from 'puppeteer-cluster'
import { Page } from 'puppeteer'

// Actions
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/files'
import { log } from 'botmation/actions/console'

// Purely functional approach
import { chain } from 'botmation/actions/assembly-lines'
import { logError } from 'botmation/helpers/console'

(async () => {
    try {
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_BROWSER, // browser / page, Incognito mode
            maxConcurrency: 3 // max number of bots
        })

        //
        // In this example, they are essentially doing the same thing each, which therefore could rewrite this better
        //    But, they each can do their own unique set of actions, navigating, interacting with their own sites
        // This library supports 2 approaches, Object Oriented 
        //
    
        const screenshotBot = async ({ page, data: url }: {page: Page, data: any}) => 
            await chain(
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_')),
                log('screenshot of ' + url + ' saved')
            )(page)

        //
        // You can use any approach with any one of these bots
        //
    
        // Run the bots
        cluster.queue('https://nodejs.org/', screenshotBot)
        cluster.queue('https://github.com/', screenshotBot)
        cluster.queue('https://www.typescriptlang.org/', screenshotBot)
    
        // Wait for it to finish up
        await cluster.idle()
        await cluster.close()
    } catch(error) {
        logError(error)
    }
})()