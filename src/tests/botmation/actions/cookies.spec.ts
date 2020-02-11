import { Page } from 'puppeteer'

import { getDefaultGoToPageOptions } from 'botmation/helpers/navigation'
import { fileExist, deleteFile } from 'botmation/helpers/files'
import { saveCookies, loadCookies } from 'botmation/actions/cookies'
import { BotOptions } from 'botmation/interfaces/bot-options.interfaces'
import { getFileUrl } from 'botmation/helpers/assets'

import { BASE_URL } from 'tests/urls'

/**
 * @description   Cookies Action Factory
 *                The factory methods here return BotAction's for the bots to manage Puppeteer Page Cookies
 * @note          The order of the tests in this suite IS IMPORTANT! run the saveCookies() test before the loadCookies()!
 * @note          The testing strategy focuses on unit-testing the file-system part of saving/loading cookies (writing/reading a JSON file)
 *                  then does a integration test in calling the correct Puppeteer methods in injecting or reading cookies from a Page
 */
describe('[Botmation:Action Factory] Cookies', () => {
  const BOT_OPTIONS = {
    parent_output_directory: 'assets',
    cookies_directory: 'cookies'
  } as any as BotOptions

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
    await page.goto(BASE_URL, getDefaultGoToPageOptions())
  })

  //
  // saveCookies() Unit/Integration Test
  it('should call puppeteer\'s page cookies() method then create a JSON file of that data in the Cookies directory', async() => {
    await saveCookies(COOKIES_FILENAME)(mockPage, BOT_OPTIONS)

    expect(mockPage.cookies).toBeCalled()
    await expect(fileExist(getFileUrl(BOT_OPTIONS.cookies_directory, BOT_OPTIONS) + '/test-cookies-1.json')).resolves.toEqual(true)
  })

  //
  // loadCookies() Unit/Integration Test
  it('should loadCookies() from filename provided by injecting that data from the file into the Puppeteer Page', async() => {
    await loadCookies(COOKIES_FILENAME)(mockPage, BOT_OPTIONS)

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
    const cookiesFileUrl = getFileUrl(BOT_OPTIONS.cookies_directory, BOT_OPTIONS) +  COOKIES_FILENAME + '.json'

    const TEST_COOKIES_FILE_EXISTS = await fileExist(cookiesFileUrl)
    if (TEST_COOKIES_FILE_EXISTS) {
      await deleteFile(cookiesFileUrl)
    }
  })
})
