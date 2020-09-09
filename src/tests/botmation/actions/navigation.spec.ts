import { Page } from 'puppeteer'

import { goTo, waitForNavigation, goBack, goForward, reload, wait, scrollTo } from 'botmation/actions/navigation'
import { enrichGoToPageOptions, scrollToElement } from 'botmation/helpers/navigation'
import { click } from 'botmation/actions/input'

import { BASE_URL, EXAMPLE_URL } from 'tests/urls'
import { FORM_SUBMIT_BUTTON_SELECTOR } from 'tests/selectors'

jest.mock('botmation/helpers/navigation', () => {
  const originalModule = jest.requireActual('botmation/helpers/navigation')

  return {
    ...originalModule,
    sleep: jest.fn(() => Promise.resolve()),
    scrollToElement: jest.fn(() => {})
  }
})

/**
 * @description   Navigation BotAction's
 *                The factory methods here return BotAction's for the bots to input into the page as User
 */
describe('[Botmation] actions/navigation', () => {
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

  beforeAll(async() => {
    await page.goto(BASE_URL, enrichGoToPageOptions())
  })
  //
  // sleep() Integration Test
  it('should call setTimeout with the correct values', async() => {
    await wait(5003234)(mockPage)

    const mockSleepHelper = require('botmation/helpers/navigation').sleep

    expect(mockSleepHelper).toHaveBeenNthCalledWith(1, 5003234)
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
  // Unit test for both actions. Moving forward, we can rely more in Integration tests for some of these
  it('should go to example page, submit form, wait for navigation, then be on the success page', async() => {
    await goTo(EXAMPLE_URL)(page)

    // do both at the same time, so we wait for navigation to complete based on the form, 
    // and not after it's already done, which was stalling the test
    await Promise.all([
      click(FORM_SUBMIT_BUTTON_SELECTOR)(page),
      waitForNavigation(page)
    ])

    await expect(page.title()).resolves.toMatch('Testing: Form Submit Success')
  })

  //
  // scrollTo() integration
  it('scrollTo() should call scrollToElement() inside the puppeteer page based on a html selector', async() => {
    await scrollTo('some-element-far-away')(mockPage)

    const {
      scrollToElement: mockScrollToElement,
      sleep: mockSleep
    } = require('botmation/helpers/navigation')

    expect(mockScrollToElement).toHaveBeenNthCalledWith(1, 'some-element-far-away')
    expect(mockSleep).toHaveBeenNthCalledWith(2, 2500)
  })

  // clean up
  afterAll(() => {
    jest.unmock('botmation/helpers/navigation')
  })
})
