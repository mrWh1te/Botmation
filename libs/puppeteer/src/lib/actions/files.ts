import { Action } from '@botmation/v2core'
import { inject, errors, forAll } from "@botmation/v2core"

import { goTo } from "./navigation"
import { FileOptions } from "../interfaces/file-options"
import { enrichFileOptionsWithDefaults, getFileUrl } from "../helpers/files"
import { InjectFileOptions, InjectBrowserPage } from '../types/injects'

/**
 * @description    Higher-order Action to inject an enriched "fileOptions" from an optional provided Partial of one
 *                 Cookies & Output Action's support files()() wrapping for injecting their enriched fileOptions
 *                 It's possible to use files()() to set fileOptions for all those Action's ran inside, AND each one of those Actions can
 *                    overwride the fileOptions through their own function params
 */
export const files = (fileOptions?: Partial<FileOptions>) =>
  (...actions: Action<InjectBrowserPage>[]): Action<InjectBrowserPage> =>
    inject({fileOptions: enrichFileOptionsWithDefaults(fileOptions)})(
      errors('files()()')(...actions)
    )

/**
 * @description   Take a PNG screenshot of the current page view
 *                It relies on fileOptions, to determine the local directory as to where to save the file
 * @param fileName name of the file to save the PNG as
 */
export const screenshot = (fileName: string, fileOptions: Partial<FileOptions> = {}): Action<InjectBrowserPage & Partial<InjectFileOptions>> =>
  async ({page, fileOptions: injectedFileOptions}) => {

    // fileOptions is higher order param that overwrites injected options
    const hydratedOptions = enrichFileOptionsWithDefaults({...injectedFileOptions, ...fileOptions})

    const fileUrl = getFileUrl(hydratedOptions.screenshots_directory, hydratedOptions, fileName) + '.png'
    await page.screenshot({path: fileUrl})
  }


/**
 * @description    Visits every url in the array, takes a screenshot, and saves it locally with a name based on the url in a directory determined by the fileOptions
 * @param urls ['https://example.com', 'http://whatever.com']
 * @example   screenshotAll(['https://google.com', 'https://twitter.com'], {screenshots_directory: 'site-pictures'})
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
export const screenshotAll = (urls: string[], fileOptions?: Partial<FileOptions>): Action =>
  forAll(urls)(
    url => ([
      goTo(url),
      screenshot(url.replace(/[^a-zA-Z]/g, '_'), fileOptions) // filenames are created from urls by replacing nonsafe characters with underscores
    ])
  )


/**
 * @description    Save webpage as PDF
 * @param fileName
 * @beta  should we add ability to customize options of pdf() ie `format`, `printBackground` see Puppeteer.PDFOptions (typed)
 * @note          Launching the browser without headless (headless: false) breaks this
 *                See https://github.com/puppeteer/puppeteer/issues/1829
 */
export const savePDF = (fileName: string, fileOptions: Partial<FileOptions> = {}): Action<InjectBrowserPage & Partial<InjectFileOptions>> =>
  async({page, fileOptions: injectedFileOptions}) => {
    const hydratedOptions = enrichFileOptionsWithDefaults({...injectedFileOptions, ...fileOptions})
    const fileUrl = getFileUrl(hydratedOptions.pdfs_directory, hydratedOptions, fileName) + '.pdf'

    await page.pdf({path: fileUrl, format: 'a4'})
  }
