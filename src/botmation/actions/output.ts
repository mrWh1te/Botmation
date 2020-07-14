import { PDFOptions } from 'puppeteer'

import { BotAction, BotFilesAction, createBotActionFactory, BotAction5 } from "../interfaces/bot-actions.interfaces"

import { forAll } from './utilities'
import { goTo } from './navigation'
import { getFileUrl } from '../helpers/assets'
import { getDefaultBotFileOptions } from 'botmation/helpers/file-options'

/**
 * @description   Take a PNG screenshot of the current page
 *                It relies on `options`, BotOptions, to determine the URL to save the asset in
 * @param fileName name of the file to save the PNG as
 */

// export const screenshot_OG = (fileName: string): BotFilesAction => async(page, options) => {
//   const fileUrl = getFileUrl(options.screenshots_directory, options, fileName) + '.png'

//   await page.screenshot({path: fileUrl})
// }

// Working example of carrying factory argument types into usage (IDE auto-completes suggests fileName when using screenshot5())
// export const screenshot5 = createBotActionFactory(
//   (fileName: string) => createBotAction<void, BotFilesAction<void>>(
//     async(page, options) => {
//       const fileUrl = getFileUrl(options.screenshots_directory, options, fileName) + '.png'
    
//       await page.screenshot({path: fileUrl})
//     }
//   )
// ) 
// concept is you could have an Injects() botaction that would use a map of `type` to each injects, but seems like a lot of effort to make work..
  // instead going to have Injects()() as higher order botaction for wrapping a chain/pipe of actions that can set the injects for all those actions
  //    then have an ability to create custom Injects()() like IndexedDB()() for setting dbName, version, storename? etc
  // const action: BotAction5<string> = async(page, piped) => {
  //   return name
  // }
// export const pipeTest = createBotActionFactory(
//   () => createBotPipeAction<string, string>(
//     async(page, piped) => piped
//   )
// )
// pipeTest()()

export const screenshot = createBotActionFactory(
  (fileName: string): BotFilesAction<void> => async (page, options) => {
    options = getDefaultBotFileOptions(options)
    const fileUrl = getFileUrl(options.screenshots_directory, options, fileName) + '.png'
  
    await page.screenshot({path: fileUrl})
  }
)

// same typing, but more work... may revert back
// remove 'type', for instead an injects() BotAction
// screenshot5('file')()            // (page: Page, piped?: undefined, injects_0: BotFilesConfig, ...injects_1: any[]): Promise<void>
// screenshot5_Backup('filename')() // (page: Page, piped?: undefined, injects_0: BotFilesConfig, ...injects_1: any[]): Promise<void>

// screenshot5('file')(page, ) // IDE auto-completes all params :)

/**
 * @description    given a list of websites, the bot will visit each, wait for them to load, then take a screenshot to save in the escreenshot directory
 * @param urls ['https://example.com', 'http://whatever.com']
 * @example   screenshotAll('https://google.com', 'https://twitter.com')
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
// export const screenshotAll = (...urls: string[]): BotFilesAction => async(page, piped, options) =>
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