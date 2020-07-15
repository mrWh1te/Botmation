import { PDFOptions } from 'puppeteer'

import { BotAction, BotFilesAction, BotAction5 } from "../interfaces/bot-actions.interfaces"

import { forAll } from './utilities'
import { goTo } from './navigation'
import { getFileUrl } from '../helpers/assets'
import { getDefaultBotFileOptions } from 'botmation/helpers/file-options'

/**
 * @description   Take a PNG screenshot of the current page
 *                It relies on `options`, BotOptions, to determine the URL to save the asset in
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string): BotFilesAction<void> => 
  async (page, options) => {
    const hydratedOptions = getDefaultBotFileOptions(options)

    const fileUrl = getFileUrl(hydratedOptions.screenshots_directory, hydratedOptions, fileName) + '.png'
  
    await page.screenshot({path: fileUrl})
  }


/**
 * @description    given a list of websites, the bot will visit each, wait for them to load, then take a screenshot to save in the escreenshot directory
 * @param urls ['https://example.com', 'http://whatever.com']
 * @example   screenshotAll('https://google.com', 'https://twitter.com')
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
// export const screenshotAll = (...urls: string[]): BotFilesAction => async(page, options, piped) =>
//   await forAll(urls)(
//     (url) => ([
//       goTo(url),
//       screenshot(url.replace(/[^a-zA-Z]/g, '_')) // filenames are created from urls by replacing nonsafe characters with underscores
//     ])
//   )(page, piped, options)

/**
 * @description    save webpage as PDF
 * @param fileName 
 * @alpha
 * @TODO verify working & add testing
 */
// export const savePDF = (fileName: string, pdfOptions: PDFOptions = {}): BotFilesAction => async(page, piped, options) => {
//   pdfOptions.path = getFileUrl(options.pdfs_directory, options, fileName) + '.pdf'

//   await page.pdf(pdfOptions)
// }