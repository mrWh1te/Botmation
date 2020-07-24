import { Page } from 'puppeteer'
import { promises as fs } from 'fs'

import { enrichGoToPageOptions } from 'botmation/helpers/navigation'

import { BASE_URL } from 'tests/urls'
import { botFileOptions } from 'tests/mocks/bot-file-options.mock'

import { screenshot, screenshotAll } from 'botmation/actions/output'
import { fileExist, getFileUrl } from 'botmation/helpers/files'

/**
 * @description   Output BotAction's
 *                The factory methods here return BotAction's for the bots to output to Disk, and potentially more in the future
 *                    The idea of input vs output factory methods came from I/O
 *                    So this can be screenshots, maybe logging information to a file, etc
 */
describe('[Botmation] actions/output', () => {
  const SCREENSHOT_FILENAME = 'test-screenshot-1'

  let mockPage: Page

  beforeAll(async() => {
    await page.goto(BASE_URL, enrichGoToPageOptions())
  })

  beforeEach(() => {
    mockPage = {
      screenshot: jest.fn(),
      url: jest.fn(() => ''),
      goto: jest.fn()
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

    await expect(fileExist(getFileUrl(botFileOptions.screenshots_directory, botFileOptions) + '/test-screenshot-1.png')).resolves.toEqual(true)
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
  // Clean up
  afterAll(async() => {
    // The screenshot() unit-test creates a specific file, let's delete it, to prevent future false positive's
    const fileUrl = getFileUrl(botFileOptions.screenshots_directory, botFileOptions, SCREENSHOT_FILENAME) + '.png'

    const TEST_SCREENSHOT_FILE_EXISTS = await fs.stat(fileUrl)
    if (TEST_SCREENSHOT_FILE_EXISTS) {
      await fs.unlink(fileUrl)
    }
  })
})
