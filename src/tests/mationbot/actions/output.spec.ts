import { Page } from 'puppeteer'

import { getDefaultGoToPageOptions } from '@mationbot/helpers/navigation'

import { BASE_URL } from '@tests/urls'
import { screenshot, screenshotAll } from '@mationbot/actions/output'
import { getScreenshotLocalFilePath } from '@helpers/assets'
import { fileExist, deleteFile } from '@helpers/files'

/**
 * @description   Output Action Factory
 *                The factory methods here return BotAction's for the bots to output to Disk, and potentially more in the future
 *                    The idea of input vs output factory methods came from I/O
 *                    So this can be screenshots, maybe logging information to a file, etc
 */
describe('[MationBot:Action Factory] Output', () => {
  const SCREENSHOT_FILENAME = 'test-screenshot-1'

  let mockPage: Page

  beforeAll(async() => {
    await page.goto(BASE_URL, getDefaultGoToPageOptions())
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
    await screenshot(SCREENSHOT_FILENAME)(mockPage as any as Page)

    expect(mockPage.screenshot).toBeCalledWith({path: getScreenshotLocalFilePath('test-screenshot-1.png')})
  })

  //
  // screenshot() Unit Test
  it('should create a PNG file in the screenshots directory with the provided filename', async() => {
    await screenshot(SCREENSHOT_FILENAME)(page)

    await expect(fileExist(getScreenshotLocalFilePath('test-screenshot-1.png'))).resolves.toEqual(true)
  })

  //
  // screenshotAll() Integration test
  it('should screenshotAll(...) sites by calling goTo then screenshot, on each one', async() => {
    await screenshotAll('google.com', 'twitter.com')(mockPage as any as Page)

    expect(mockPage.goto).toHaveBeenNthCalledWith(1, 'https://google.com', getDefaultGoToPageOptions())
    expect(mockPage.screenshot).toHaveBeenNthCalledWith(1, {path: getScreenshotLocalFilePath('google.com.png')})

    expect(mockPage.goto).toHaveBeenLastCalledWith('https://twitter.com', getDefaultGoToPageOptions())
    expect(mockPage.screenshot).toHaveBeenLastCalledWith({path: getScreenshotLocalFilePath('twitter.com.png')})
  })

  //
  // Clean up
  afterAll(async() => {
    // The screenshot() unit-test creates a specific file, let's delete it, to prevent future false positive's
    const TEST_SCREENSHOT_FILE_EXISTS = await fileExist(getScreenshotLocalFilePath(SCREENSHOT_FILENAME+'.png'))
    if (TEST_SCREENSHOT_FILE_EXISTS) {
      await deleteFile(getScreenshotLocalFilePath(SCREENSHOT_FILENAME+'.png'))
    }
  })
})
