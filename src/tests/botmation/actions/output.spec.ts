import { Page } from 'puppeteer'
import { promises as fs, Stats } from 'fs'

import { enrichGoToPageOptions } from 'botmation/helpers/navigation'

import { BASE_URL } from 'tests/urls'
import { botFileOptions } from 'tests/mocks/bot-file-options'

import { screenshot, screenshotAll, savePDF } from 'botmation/actions/output'
import { getFileUrl, enrichBotFileOptionsWithDefaults } from 'botmation/helpers/files'

/**
 * @description   Output BotAction's
 *                The factory methods here return BotAction's for the bots to output to Disk, and potentially more in the future
 *                    The idea of input vs output factory methods came from I/O
 *                    So this can be screenshots, maybe logging information to a file, etc
 */
describe('[Botmation] actions/output', () => {
  const SCREENSHOT_FILENAME = 'test-screenshot-1'
  const PDF_FILENAME = 'test-pdf-1'

  let mockPage: Page

  beforeAll(async() => {
    await page.goto(BASE_URL, enrichGoToPageOptions())
  })

  beforeEach(() => {
    mockPage = {
      screenshot: jest.fn(),
      url: jest.fn(() => ''),
      goto: jest.fn(),
      pdf: jest.fn()
    } as any as Page
  })

  //
  // screenshot() Integration Test
  it('should call puppeteer\'s page screenshot() method with the provided options', async() => {
    await screenshot(SCREENSHOT_FILENAME)(mockPage, botFileOptions)

    expect(mockPage.screenshot).toBeCalledWith({path: getFileUrl(botFileOptions.screenshots_directory, botFileOptions) + '/test-screenshot-1.png'})
  })

  //
  // screenshot() Unit Test
  it('should create a PNG file in the screenshots directory with the provided filename', async() => {
    await screenshot(SCREENSHOT_FILENAME)(page, botFileOptions)

    await expect(fs.stat(getFileUrl(botFileOptions.screenshots_directory, botFileOptions) + '/test-screenshot-1.png')).resolves.toBeInstanceOf(Stats) // rejects if file not found
  })

  //
  // screenshotAll() Integration test
  it('should screenshotAll(...) sites by calling goTo then screenshot, on each one', async() => {
    await screenshotAll(['https://google.com', 'https://twitter.com'])(mockPage, botFileOptions)

    expect(mockPage.goto).toHaveBeenNthCalledWith(1, 'https://google.com', {"waitUntil": "networkidle0"})
    expect(mockPage.screenshot).toHaveBeenNthCalledWith(1, {path: getFileUrl(botFileOptions.screenshots_directory, botFileOptions, 'https___google_com.png')})

    expect(mockPage.goto).toHaveBeenLastCalledWith('https://twitter.com', {"waitUntil": "networkidle0"})
    expect(mockPage.screenshot).toHaveBeenLastCalledWith({path: getFileUrl(botFileOptions.screenshots_directory, botFileOptions, 'https___twitter_com.png')})
  })

  //
  // savePDF() Integration
  it('should call Puppeteer Page.pdf() with correct params', async() => {
    await savePDF('example-pdf-filename')(mockPage, enrichBotFileOptionsWithDefaults({pdfs_directory: 'pdf'}))
    expect(mockPage.pdf).toHaveBeenNthCalledWith(1, {path: './pdf/example-pdf-filename.pdf', format: 'A4'})
  })

  //
  // savePDF() unit test
  it('should create a PDF in the pdfs directory with the provided filename', async() => {
    await savePDF(PDF_FILENAME)(page, botFileOptions)

    await expect(fs.stat(getFileUrl(botFileOptions.pdfs_directory, botFileOptions) + '/test-pdf-1.pdf')).resolves.toBeInstanceOf(Stats) // rejects if file not found
  })

  //
  // Clean up
  afterAll(async() => {
    // The screenshot() unit-test creates a specific file, let's delete it, to prevent future false positive's
    const screenshotFileUrl = getFileUrl(botFileOptions.screenshots_directory, botFileOptions, SCREENSHOT_FILENAME) + '.png'

    const TEST_SCREENSHOT_FILE_EXISTS = await fs.stat(screenshotFileUrl)
    if (TEST_SCREENSHOT_FILE_EXISTS) {
      await fs.unlink(screenshotFileUrl)
    }

    const pdfFileUrl = getFileUrl(botFileOptions.pdfs_directory, botFileOptions, PDF_FILENAME) + '.pdf'
    const TEST_PDF_FILE_EXISTS = await fs.stat(pdfFileUrl)
    if (TEST_PDF_FILE_EXISTS) {
      await fs.unlink(pdfFileUrl)
    }
  })
})
