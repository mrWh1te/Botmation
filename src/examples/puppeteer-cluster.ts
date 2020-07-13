import { Cluster } from 'puppeteer-cluster'
import { Page } from 'puppeteer'

// Actions
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/output'
import { log } from 'botmation/actions/console'

// Class for injecting the page
import { Botmation } from 'botmation'

// Purely functional approach
import { BotActionsChainFactory as Bot } from 'botmation/factories/bot-actions-chain.factory'
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

        const githubBot = async ({ page, data: url }: {page: Page, data: any}) => {
            // Imperative OO approach
            const bot = new Botmation(page)
    
            await bot.actions(
                goTo(url),
                // screenshot(url.replace(/[^a-zA-Z]/g, '_')), // WIP @TODO complete this -- different botAction params
                log('screenshot of ' + url + ' saved')
            )
        }
    
        const typescriptBot = async ({ page, data: url }: {page: Page, data: any}) => 
            // Imperative OO approach, on 1 line
            await (new Botmation(page)).actions( // if you're not doing the above functional way, you could rename Botmation to Bot in the import using 'as'
                goTo(url),
                // screenshot(url.replace(/[^a-zA-Z]/g, '_')), // WIP @TODO complete this -- different botAction params
                log('screenshot of ' + url + ' saved')
            )
    
        const nodeJsBot = async ({ page, data: url }: {page: Page, data: any}) => 
            // Functional approach
            await Bot(page)(
                goTo(url),
                // screenshot(url.replace(/[^a-zA-Z]/g, '_')), // WIP @TODO complete this -- different botAction params
                log('screenshot of ' + url + ' saved')
            )

        //
        // You can use any approach with any one of these bots
        //
    
        // Run the bots
        cluster.queue('https://nodejs.org/', nodeJsBot)
        cluster.queue('https://github.com/', githubBot)
        cluster.queue('https://www.typescriptlang.org/', typescriptBot)
    
        // Wait for it to finish up
        await cluster.idle()
        await cluster.close()
    } catch(error) {
        logError(error)
    }
})()