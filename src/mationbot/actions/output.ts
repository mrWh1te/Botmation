import puppeteer from 'puppeteer'

import { BotAction } from "@mationbot/interfaces/bot-action.interfaces"
import { getPageScreenshotLocalFileUrl } from '@helpers/assets'

import { forAll } from '@mationbot/actions/utilities'
import { BotActionsChainFactory } from '@mationbot/factories/bot-actions-chain.factory'
import { goTo } from '@mationbot/actions/navigation'

/**
 * @description   Take a PNG screenshot of the current page
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string): BotAction => async(tab: puppeteer.Page) => {
  await tab.screenshot({path: getPageScreenshotLocalFileUrl(`${fileName}.png`)})
}

/**
 * @description    
 * @param sites ['example.com', 'whatever.com']
 */
export const screenshotAll = (...sites: string[]): BotAction => async(tab: puppeteer.Page) =>
  await forAll(sites)( // await needed?
    (siteName) => ([
      goTo('http://' + siteName),
      screenshot(siteName+'-homepage')
    ])
  )(tab) 

  // Either use the Factory to inject the tab, with the advantage of providing a list of actions
  // or do above, inject the tab yourself, and skip the factory since you do not need a chain to run 1 forAll() action
  // BotActionsChainFactory(tab)(
  //   forAll(sites)(
  //     (siteName) => ([
  //       goTo('http://' + siteName),
  //       screenshot(siteName+'-homepage')
  //     ])
  //   ) 
  // )