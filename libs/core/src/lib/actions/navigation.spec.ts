import { goTo, waitForNavigation, goBack, goForward, reload, scrollTo } from './navigation'
import { enrichGoToPageOptions } from './../helpers/navigation'
import { click } from './input'

import { BASE_URL, EXAMPLE_URL, FORM_SUBMIT_BUTTON_SELECTOR } from './../mocks'

import { Page, Browser } from 'puppeteer'
const puppeteer = require('puppeteer');

jest.mock('../helpers/navigation', () => {
  const originalModule = jest.requireActual('../helpers/navigation')

  return {
    ...originalModule,
    scrollToElement: jest.fn(() => {})
  }
})

jest.mock('../helpers/time', () => {
  const originalModule = jest.requireActual('../helpers/time')

  return {
    ...originalModule,
    sleep: jest.fn(() => Promise.resolve()),
  }
})

/**
 * @description   Navigation BotAction's
 *                The factory methods here return BotAction's for the bots to input into the page as User
 */
describe('[Botmation] actions/navigation', () => {

  let page: Page

  let mockPage: Page

  beforeEach(() => {
    mockPage = {
      goto: jest.fn(),
      url: jest.fn(() => BASE_URL),
      waitForNavigation: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      reload: jest.fn(),
      evaluate: jest.fn((fn, ...params) => {
        fn(...params)
        return Promise.resolve()
      })
    } as any as Page
  })

  //
  // Basic Integration Tests
  it('should call puppeteer\'s page goto() method with the provided options', async() => {
    await goTo(EXAMPLE_URL)(mockPage)

    expect(mockPage.url).toBeCalled() // are we checking the URL before requesting to go to it to prevent unnecessary requests?
    expect(mockPage.goto).toBeCalledWith('http://localhost:8080/example.html', enrichGoToPageOptions()) // are we providing default options, is the action relaying the correct url
  })

  it('should call puppeteer\'s page goto() method only if the URL requested is different', async() => {
    // mockPage.url() returns BASE_URL, so same URL in all 3 tests:
    await goTo(BASE_URL)(mockPage)
    await goTo(BASE_URL)(mockPage)
    await goTo(BASE_URL)(mockPage)

    expect(mockPage.goto).toBeCalledTimes(0)
  })

  it('should call puppeteer\'s waitForNavigation method', async() => {
    await waitForNavigation(mockPage)

    expect(mockPage.waitForNavigation).toBeCalled()
  })

  it('should call Puppeteer Page goBack()', async() => {
    await goBack()(mockPage)

    expect(mockPage.goBack).toBeCalled()
  })

  it('should call Puppeteer Page goForward()', async() => {
    await goForward()(mockPage)

    expect(mockPage.goForward).toBeCalled()
  })

  it('should call Puppeteer Page reload()', async() => {
    await reload()(mockPage)

    expect(mockPage.reload).toBeCalled()
  })

  //
  // scrollTo() integration
  it('scrollTo() should call scrollToElement() inside the puppeteer page based on a html selector', async() => {
    await scrollTo('some-element-far-away')(mockPage)

    const {
      scrollToElement: mockScrollToElement
    } = require('../helpers/navigation')

    const {
      sleep: mockSleep
    } = require('../helpers/time')

    expect(mockScrollToElement).toHaveBeenNthCalledWith(1, 'some-element-far-away')
    expect(mockSleep).toHaveBeenNthCalledWith(1, 2500)

    await scrollTo('some-element-far-far-away', 5000)(mockPage)

    expect(mockScrollToElement).toHaveBeenNthCalledWith(2, 'some-element-far-far-away')
    expect(mockSleep).toHaveBeenNthCalledWith(2, 5000)
  })

  //
  // Unit test for both actions. Moving forward, we can rely more in Integration tests for some of these
  it('should go to example page, submit form, wait for navigation, then be on the success page', async() => {
    const browser: Browser = await puppeteer.launch()

    page = await browser.newPage()
    await page.goto(BASE_URL, enrichGoToPageOptions())

    await goTo(EXAMPLE_URL)(page)

    // do both at the same time, so we wait for navigation to complete based on the form,
    // and not after it's already done, which was stalling the test
    await Promise.all([
      click(FORM_SUBMIT_BUTTON_SELECTOR)(page),
      waitForNavigation(page)
    ])

    const pageTitle = await page.title()
    expect(pageTitle).toMatch('Testing: Form Submit Success')

    await page.close()
    await browser.close()
  })

  // clean up
  afterAll(async() => {
    jest.unmock('../helpers/navigation')
    jest.unmock('../helpers/time')
  })
})
