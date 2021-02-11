

import { promises as fs, Stats } from 'fs'
import { files, screenshot, screenshotAll, savePDF } from "./files"
import { BotFileOptions } from "./../interfaces/bot-file-options"
import { getFileUrl, enrichBotFileOptionsWithDefaults } from './../helpers/files'
import { enrichGoToPageOptions } from './../helpers/navigation'

import { BASE_URL, botFileOptions } from '@botmation/test'

import { Page, Browser } from 'puppeteer'
const puppeteer = require('puppeteer');

// Mock the Injects Module so when files() imports it
// we can test how injects() is called within files()
// particularly interested in the first param, an enriched BotFileOptions
jest.mock('./inject', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('./inject')

  return {
    ...originalModule,
    inject: jest.fn(() => () => () => {})
  }
})

/**
 * @description   Files BotAction
 */
describe('[Botmation] actions/files', () => {
  let browser: Browser
  let page: Page

  const SCREENSHOT_FILENAME = 'test-screenshot-1'
  const PDF_FILENAME = 'test-pdf-1'

  let mockPage: Page

  beforeEach(() => {
    mockPage = {
      screenshot: jest.fn(),
      url: jest.fn(() => ''),
      goto: jest.fn(),
      pdf: jest.fn()
    } as any as Page
  })

  beforeAll(async() => {
    browser = await puppeteer.launch()
  })

  beforeEach(async() => {
    page = await browser.newPage()
    await page.goto(BASE_URL, enrichGoToPageOptions())
  })

  afterEach(async () => {
    if (page) {
      await page.close()
    }
  })

  //
  // Basic Unit Tests
  it('should set the 1st inject as an enriched BotFileOptions object with overloaded values based on whats passed in files()', async () => {
    // no BotFileOptions
    await files()()(mockPage)

    // partial botFileOptions - 1 key/value pair
    await files({screenshots_directory: 'screenshots'})()(mockPage)
    await files({cookies_directory: 'cookies'})()(mockPage)

    // full botFileOptions
    const botfileOptions: BotFileOptions = {
      parent_output_directory: 'parent',
      screenshots_directory: 's',
      cookies_directory: 'c',
      pdfs_directory: 'p'
    }
    await files(botfileOptions)()(mockPage)

    const {inject: mockInjectMethod} = require('./inject')

    expect(mockInjectMethod).toHaveBeenNthCalledWith(1, {
      screenshots_directory: '',
      cookies_directory: '',
      pdfs_directory: ''
    })
    expect(mockInjectMethod).toHaveBeenNthCalledWith(2, {
      screenshots_directory: 'screenshots',
      cookies_directory: '',
      pdfs_directory: ''
    })
    expect(mockInjectMethod).toHaveBeenNthCalledWith(3, {
      screenshots_directory: '',
      cookies_directory: 'cookies',
      pdfs_directory: ''
    })
    expect(mockInjectMethod).toHaveBeenNthCalledWith(4, {
      parent_output_directory: 'parent',
      screenshots_directory: 's',
      cookies_directory: 'c',
      pdfs_directory: 'p'
    })
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
    await browser.close()

    // unmock the module for other tests
    jest.unmock('./inject')

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
