import { Page } from 'puppeteer'

import { getDefaultGoToPageOptions } from '../../../botmation/helpers/navigation'

import { BASE_URL } from '../../urls'
import { botOptions } from '../../mocks/bot-options.mock'

import { screenshot, screenshotAll } from '../../../botmation/actions/output'
import { fileExist, deleteFile } from '../../../botmation/helpers/files'
import { getFileUrl } from '../../../botmation/helpers/assets'

/**
 * @description   Output Action Factory
 *                The factory methods here return BotAction's for the bots to output to Disk, and potentially more in the future
 *                    The idea of input vs output factory methods came from I/O
 *                    So this can be screenshots, maybe logging information to a file, etc
 */
describe('[Botmation:Action Factory] Output', () => {
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
    await screenshot(SCREENSHOT_FILENAME)(mockPage, botOptions)

    expect(mockPage.screenshot).toBeCalledWith({path: getFileUrl(botOptions.screenshots_directory, botOptions) + '/test-screenshot-1.png'})
  })

  //
  // screenshot() Unit Test
  it('should create a PNG file in the screenshots directory with the provided filename', async() => {
    await screenshot(SCREENSHOT_FILENAME)(page, botOptions)

    await expect(fileExist(getFileUrl(botOptions.screenshots_directory, botOptions) + '/test-screenshot-1.png')).resolves.toEqual(true)
  })

  //
  // screenshotAll() Integration test
  it('should screenshotAll(...) sites by calling goTo then screenshot, on each one', async() => {
    await screenshotAll('google.com', 'twitter.com')(mockPage, botOptions)

    expect(mockPage.goto).toHaveBeenNthCalledWith(1, 'https://google.com', getDefaultGoToPageOptions())
    expect(mockPage.screenshot).toHaveBeenNthCalledWith(1, {path: getFileUrl(botOptions.screenshots_directory, botOptions) + '/google.com.png'})

    expect(mockPage.goto).toHaveBeenLastCalledWith('https://twitter.com', getDefaultGoToPageOptions())
    expect(mockPage.screenshot).toHaveBeenLastCalledWith({path: getFileUrl(botOptions.screenshots_directory, botOptions) + '/twitter.com.png'})
  })

  //
  // Clean up
  afterAll(async() => {
    // The screenshot() unit-test creates a specific file, let's delete it, to prevent future false positive's
    const fileUrl = getFileUrl(botOptions.screenshots_directory, botOptions, SCREENSHOT_FILENAME) + '.png'

    const TEST_SCREENSHOT_FILE_EXISTS = await fileExist(fileUrl)
    if (TEST_SCREENSHOT_FILE_EXISTS) {
      await deleteFile(fileUrl)
    }
  })
})
