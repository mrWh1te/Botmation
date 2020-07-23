import { Page } from 'puppeteer'

import { enrichGoToPageOptions } from 'botmation/helpers/navigation'
import { fileExist, deleteFile, getFileUrl } from 'botmation/helpers/files'
import { saveCookies, loadCookies } from 'botmation/actions/cookies'
import { BotFileOptions } from 'botmation/interfaces/bot-file-options'

import { BASE_URL } from 'tests/urls'
import { wrapValueInPipe } from 'botmation/helpers/pipe'

/**
 * @description   Cookies BotAction's
 *                The factory methods here return BotAction's for the bots to manage Puppeteer Page Cookies
 * @note          The order of the tests in this suite ARE IMPORTANT! run the saveCookies() test before the loadCookies(), else refactor!
 * @note          The testing strategy focuses on unit-testing the file-system part of saving/loading cookies (writing/reading a JSON file)
 *                  then does a integration test in calling the correct Puppeteer methods in injecting or reading cookies from a Page
 */
describe('[Botmation] actions/cookies', () => {
  const BOT_FILE_OPTIONS = {
    parent_output_directory: 'assets',
    cookies_directory: 'cookies'
  } as any as BotFileOptions

  const COOKIES_FILENAME = 'test-cookies-1'
  const COOKIES_JSON = [
    {
      "name": "sessionid",
      "value": "example sessionid value",
      "domain": ".test.com",
      "path": "/",
      "expires": 1611543414.963932,
      "size": 40,
      "httpOnly": true,
      "secure": true,
      "session": false
    }
  ]

  let mockPage: Page = {
    cookies: jest.fn(() => COOKIES_JSON),
    setCookie: jest.fn()
  } as any as Page

  beforeAll(async() => {
    await page.goto(BASE_URL, enrichGoToPageOptions())
  })

  //
  // saveCookies() Unit/Integration Test
  it('should call puppeteer\'s page cookies() method then create a JSON file of that data in the Cookies directory', async() => {
    await saveCookies(COOKIES_FILENAME)(mockPage, BOT_FILE_OPTIONS, wrapValueInPipe())

    expect(mockPage.cookies).toBeCalled()
    await expect(fileExist(getFileUrl(BOT_FILE_OPTIONS.cookies_directory, BOT_FILE_OPTIONS) + '/test-cookies-1.json')).resolves.toEqual(true)
  })

  //
  // loadCookies() Unit/Integration Test
  it('should loadCookies() from filename provided by injecting that data from the file into the Puppeteer Page', async() => {
    await loadCookies(COOKIES_FILENAME)(mockPage, BOT_FILE_OPTIONS, wrapValueInPipe())

    expect(mockPage.setCookie).toHaveBeenNthCalledWith(1, {
      "name": "sessionid",
      "value": "example sessionid value",
      "domain": ".test.com",
      "path": "/",
      "expires": 1611543414.963932,
      "size": 40,
      "httpOnly": true,
      "secure": true,
      "session": false
    })
  })

  //
  // Clean up
  afterAll(async() => {
    // The saveCookies() unit-test creates a specific file, let's delete it, to prevent future false positive's
    const cookiesFileUrl = getFileUrl(BOT_FILE_OPTIONS.cookies_directory, BOT_FILE_OPTIONS) +  COOKIES_FILENAME + '.json'

    const TEST_COOKIES_FILE_EXISTS = await fileExist(cookiesFileUrl)
    if (TEST_COOKIES_FILE_EXISTS) {
      await deleteFile(cookiesFileUrl)
    }
  })
})
