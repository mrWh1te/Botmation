import { BotFileOptions, BotAction, BotFilesAction } from "../interfaces"
import { enrichBotFileOptionsWithDefaults, getFileUrl } from "../helpers/files"
import { inject } from "./inject"
import { errors } from "./errors"
import { forAll } from "./utilities"
import { goTo } from "./navigation"
import { unpipeInjects } from "../helpers/pipe"
import { AbortLineSignal, PipeValue } from "../types"

/**
 * @description    Higher-order BotAction to inject an enriched "BotFileOptions" from an optional provided Partial of one
 *                 Cookies & Output BotFilesAction's support files()() wrapping for injecting their enriched BotFileOptions
 *                 It's possible to use files()() to set botFileOptions for all those BotFilesAction's ran inside, AND each one of those Actions can
 *                    overwride the botFileOptions through their own function params
 */
export const files = (fileOptions?: Partial<BotFileOptions>) =>
  (...actions: BotAction<PipeValue|AbortLineSignal|void>[]): BotAction<AbortLineSignal|void> =>
    inject(enrichBotFileOptionsWithDefaults(fileOptions))(
      errors('files()()')(...actions)
    )

/**
 * @description   Take a PNG screenshot of the current page view
 *                It relies on BotFileOptions, to determine the local directory as to where to save the file
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction => 
  async (page, ...injects) => {
    const [,injectedOptions] = unpipeInjects(injects, 1)

    // botFileOptions is higher order param that overwrites injected options
    const hydratedOptions = enrichBotFileOptionsWithDefaults({...injectedOptions, ...botFileOptions})

    const fileUrl = getFileUrl(hydratedOptions.screenshots_directory, hydratedOptions, fileName) + '.png'
    await page.screenshot({path: fileUrl})
  }


/**
 * @description    Visits every url in the array, takes a screenshot, and saves it locally with a name based on the url in a directory determined by the BotFileOptions
 * @param urls ['https://example.com', 'http://whatever.com']
 * @example   screenshotAll(['https://google.com', 'https://twitter.com'], {screenshots_directory: 'site-pictures'})
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
export const screenshotAll = (urls: string[], botFileOptions?: Partial<BotFileOptions>): BotFilesAction => 
  forAll(urls)(
    url => ([
      goTo(url),
      screenshot(url.replace(/[^a-zA-Z]/g, '_'), botFileOptions) // filenames are created from urls by replacing nonsafe characters with underscores
    ])
  )


/**
 * @description    Save webpage as PDF
 * @param fileName 
 * @beta  should we add ability to customize options of pdf() ie `format`, `printBackground` see Puppeteer.PDFOptions (typed)
 * @note          Launching the browser without headless (headless: false) breaks this
 *                See https://github.com/puppeteer/puppeteer/issues/1829
 */
export const savePDF = (fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction => 
  async(page, ...injects) => {
    const [,injectedOptions] = unpipeInjects(injects, 1)

    const hydratedOptions = enrichBotFileOptionsWithDefaults({...injectedOptions, ...botFileOptions})

    const fileUrl = getFileUrl(hydratedOptions.pdfs_directory, hydratedOptions, fileName) + '.pdf'

    await page.pdf({path: fileUrl, format: 'A4'})
  }