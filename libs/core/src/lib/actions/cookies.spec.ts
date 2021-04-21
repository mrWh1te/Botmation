import * as puppeteer from 'puppeteer'

import { promises as fs, Stats } from 'fs'

import { getFileUrl } from './../helpers/files'
import { saveCookies, loadCookies, getCookies, deleteCookies } from './cookies'
import { BotFileOptions } from './../interfaces/bot-file-options'

import { wrapValueInPipe } from './../helpers/pipe'
import { COOKIES_URL } from '../mocks'
import { pipe } from './assembly-lines'

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

  let mockPage: puppeteer.Page

  beforeEach(() => {
    mockPage = {
      cookies: jest.fn(() => COOKIES_JSON),
      setCookie: jest.fn(),
      deleteCookie: jest.fn()
    } as any as puppeteer.Page
  })

  //
  // saveCookies() Unit/Integration Test
  it('should call puppeteer\'s page cookies() method then create a JSON file of that data in the Cookies directory', async() => {
    await saveCookies(COOKIES_FILENAME)(mockPage, BOT_FILE_OPTIONS, wrapValueInPipe())

    expect(mockPage.cookies).toBeCalled()
    await expect(fs.stat(getFileUrl(BOT_FILE_OPTIONS.cookies_directory, BOT_FILE_OPTIONS) + '/test-cookies-1.json')).resolves.toBeInstanceOf(Stats)
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
  // getCookies
  it('getCookies() should call Puppeteer page cookies() method with urls provided, with safe default of no urls provided', async() => {
    await getCookies()(mockPage)

    expect(mockPage.cookies).toHaveBeenCalledTimes(1)

    await getCookies('url 1')(mockPage)

    expect(mockPage.cookies).toHaveBeenNthCalledWith(2, 'url 1')

    await getCookies('url 5', 'url 25', 'url 54')(mockPage)

    expect(mockPage.cookies).toHaveBeenNthCalledWith(3, 'url 5', 'url 25', 'url 54')
  })

  //
  // deleteCookies
  it('deleteCookies() should call puppeteer page deleteCookies() method with cookies provided through HO param or fallback pipe value if value is an array', async() => {
    const cookies = ['a', 'b', 'c', 'd'] as any as puppeteer.Protocol.Network.Cookie[]
    const pipeCookies = ['5', '2', '3', '1'] as any as puppeteer.Protocol.Network.Cookie[]

    await deleteCookies(...cookies)(mockPage)

    expect(mockPage.deleteCookie).toHaveBeenCalledWith('a', 'b', 'c', 'd')
    expect(mockPage.deleteCookie).toHaveBeenCalledTimes(1)

    await deleteCookies()(mockPage, wrapValueInPipe(pipeCookies))

    expect(mockPage.deleteCookie).toHaveBeenNthCalledWith(2, '5', '2', '3', '1')
    expect(mockPage.deleteCookie).toHaveBeenCalledTimes(2)

    const higherOrderOverwritesPipeValue = ['blue', 'green', 'red'] as any as puppeteer.Protocol.Network.Cookie[]

    await deleteCookies(...higherOrderOverwritesPipeValue)(mockPage, wrapValueInPipe(pipeCookies))

    expect(mockPage.deleteCookie).toHaveBeenNthCalledWith(3, 'blue', 'green', 'red')
    expect(mockPage.deleteCookie).toHaveBeenCalledTimes(3)

    // no cookies specified to delete so no delete call
    const notCookies = {}

    await deleteCookies()(mockPage, wrapValueInPipe(notCookies))

    expect(mockPage.deleteCookie).toHaveBeenCalledTimes(3)

    await deleteCookies()(mockPage) // no HO, no injects (pipe value)

    expect(mockPage.deleteCookie).toHaveBeenCalledTimes(3)
  })

  // e2e
  it('can deleteCookies() based on piped value from getCookies()', async() => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(COOKIES_URL)
    const initialCookies = await page.cookies()

    expect(initialCookies.length).toEqual(2)

    await pipe()(
      getCookies(),
      // todo tap() BotAction? similar to map() BotAction but ignore cb return / auto return pipe value
      async(_, pipeObject) => {
        expect(pipeObject.value.length).toEqual(2)
        expect(pipeObject.value[0]).toEqual({"domain": "localhost", "expires": -1, "httpOnly": false, "name": "sessionId", "path": "/", "sameParty": false, "secure": false, "session": true, "size": 16, "sourcePort": 8080, "sourceScheme": "NonSecure", "value": "1235711"})
        expect(pipeObject.value[1]).toEqual({"domain": "localhost", "expires": -1, "httpOnly": false, "name": "username", "path": "/", "sameParty": false, "secure": false, "session": true, "size": 16, "sourcePort": 8080, "sourceScheme": "NonSecure", "value": "John Doe"})

        return pipeObject.value
      },
      deleteCookies()
    )(page)

    const finalCookies = await page.cookies()
    expect(finalCookies.length).toEqual(0)

    await page.close()
    await browser.close()
  })

  //
  // Clean up
  afterAll(async() => {
    // The saveCookies() unit-test creates a specific file, let's delete it, to prevent future false positive's
    const cookiesFileUrl = getFileUrl(BOT_FILE_OPTIONS.cookies_directory, BOT_FILE_OPTIONS) +  COOKIES_FILENAME + '.json'

    const TEST_COOKIES_FILE_EXISTS = await fs.stat(cookiesFileUrl)
    if (TEST_COOKIES_FILE_EXISTS) {
      await fs.unlink(cookiesFileUrl)
    }
  })
})
