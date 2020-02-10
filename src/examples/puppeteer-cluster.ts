require("module-alias/register")

import { Cluster } from 'puppeteer-cluster'
import { Page } from 'puppeteer'

// Actions
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/output'
import { logError, log } from 'botmation/actions/console'

// Class for injecting the page
import { Botmation } from 'botmation/class'

// Purely functional approach
import { BotActionsChainFactory as Bot } from 'botmation/factories/bot-actions-chain.factory'

(async () => {
    try {
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_BROWSER, // browser / page, Incognito mode
            maxConcurrency: 3 // max number of bots
        })
    
        // We don't define a task and instead use Task functions
        const nodeJsBot = async ({ page, data: url }: {page: Page, data: any}) => 
            // Functional
            await Bot(page)(
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_')),
                log('screenshot of ' + url + ' saved')
            )
        
    
        const githubBot = async ({ page, data: url }: {page: Page, data: any}) => {
            // Imperative OO
            const bot = new Botmation(page)
    
            await bot.actions(
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_')),
                log('screenshot of ' + url + ' saved')
            )
        }
    
        const typescriptBot = async ({ page, data: url }: {page: Page, data: any}) => 
            // Imperative OO, 1 line
            await (new Botmation(page)).actions( // if you're not doing the above functional way, you could rename Botmation to Bot in the import using 'as'
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_')),
                log('screenshot of ' + url + ' saved')
            )
    
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