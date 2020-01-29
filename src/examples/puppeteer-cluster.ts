require("module-alias/register");
import { Cluster } from 'puppeteer-cluster'
import puppeteer from 'puppeteer'

import { MationBot } from '@mationbot'
import { goTo } from '@mationbot/actions/navigation'
import { screenshot } from '@mationbot/actions/output'
import { logError } from '@mationbot/actions/console';

(async () => {
    try {
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_BROWSER, // browser / page, Incognito mode
            maxConcurrency: 2 // max number of bots
        })
    
        // We don't define a task and instead use own functions
        const nodeJsBot = async ({ page, data: url }: {page: puppeteer.Page, data: any}) => {
            const bot = new MationBot(page);
    
            await bot.actions(
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_'))
            )
        }
    
        const githubBot = async ({ page, data: url }: {page: puppeteer.Page, data: any}) => {
            const bot = new MationBot(page);
    
            await bot.actions(
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_'))
            )
        }
    
        const typescriptBot = async ({ page, data: url }: {page: puppeteer.Page, data: any}) => {
            const bot = new MationBot(page);
    
            await bot.actions(
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_'))
            )
        }
    
        // Run the bots
        cluster.queue('https://nodejs.org/', nodeJsBot)
        cluster.queue('https://github.com/', githubBot)
        cluster.queue('https://www.typescriptlang.org/', typescriptBot)
    
        await cluster.idle()
        await cluster.close()
    } catch(error) {
        logError(error)
    }
})();