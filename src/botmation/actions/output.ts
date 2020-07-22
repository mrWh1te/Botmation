import { BotFilesAction } from "../interfaces/bot-actions"

import { forAll } from './utilities'
import { goTo } from './navigation'
import { enrichBotFileOptionsWithDefaults } from 'botmation/helpers/file-options'
import { BotFileOptions } from 'botmation/interfaces'
import { getFileUrl } from "botmation/helpers/files"

/**
 * @description   Take a PNG screenshot of the current page
 *                It relies on `options`, BotOptions, to determine the URL to save the asset in
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction => 
  async (page, options) => {
    // botFileOptions' values overwrite injected ones in `options`
    const hydratedOptions = enrichBotFileOptionsWithDefaults({...options, ...botFileOptions})

    const fileUrl = getFileUrl(hydratedOptions.screenshots_directory, hydratedOptions, fileName) + '.png'
    await page.screenshot({path: fileUrl})
  }


/**
 * @description    given a list of websites, the bot will visit each, wait for them to load, then take a screenshot to save in the escreenshot directory
 * @param urls ['https://example.com', 'http://whatever.com']
 * @example   screenshotAll('https://google.com', 'https://twitter.com')
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
export const screenshotAll = (urls: string[], botFileOptions?: Partial<BotFileOptions>): BotFilesAction => 
  async(page, options) => {
    // botFileOptions' values overwrite injected ones in `options`
    const hydratedOptions = enrichBotFileOptionsWithDefaults({...options, ...botFileOptions})

    await forAll(urls)(
      url => ([
        goTo(url),
        screenshot(url.replace(/[^a-zA-Z]/g, '_')) // filenames are created from urls by replacing nonsafe characters with underscores
      ])
    )(page, hydratedOptions)
  }


/**
 * @description    save webpage as PDF
 * @param fileName 
 * @alpha  should we add ability to customize options of pdf() ie `format`, `printBackground` see Puppeteer.PDFOptions (typed)
 * @note          Launching the browser without headless (headless: false) breaks the saving of PDF functionality
 *                See https://github.com/puppeteer/puppeteer/issues/1829
 */
export const savePDF = (fileName: string, botFileOptions?: BotFileOptions): BotFilesAction => async(page, options) => {
  const hydratedOptions = enrichBotFileOptionsWithDefaults({...options, ...botFileOptions})

  const fileUrl = getFileUrl(hydratedOptions.pdfs_directory, hydratedOptions, fileName) + '.pdf'

  await page.pdf({path: fileUrl})
}