import { Page, Browser } from 'puppeteer'
const puppeteer = require('puppeteer')

import { BASE_URL } from './../mocks'
import { $, $$, htmlParser, evaluate, elementExists, textExists } from './scrapers'

// Mock inject()()
jest.mock('../actions/inject', () => {
  const originalModule = jest.requireActual('../actions/inject')

  return {
    ...originalModule,
    inject: jest.fn(() => () => () => {})
  }
})

// Mock document factory methods
const mockQuerySelector = (timesRan = 0) => (d: any) => d

const mockQuerySelectorAll = (timesRan = 0) => (d: any) => {
  if (timesRan > 0) {
    return []
  }

  timesRan++;
  return [d]
}

// Setup document query selector methods
Object.defineProperty(global, 'document', {
  value: {
    querySelector: mockQuerySelector(),
    querySelectorAll: mockQuerySelectorAll(),
    addEventListener: () => {}
  }
})

/**
 * @description   Scraping BotAction's
 */
describe('[Botmation] actions/scraping', () => {
  let browser: Browser
  let page: Page

  let mockPage: Page

  beforeAll(async() => {
    browser = await puppeteer.launch()
  })

  beforeEach(() => {
    mockPage = {
      evaluate: jest.fn(() => []) // for $$ integration test
    } as any as Page
  })

  //
  // Basic Integration Tests
  it('$() should call Page.evaluate() with a helper function and the correct html selector', async() => {
    mockPage = {
      evaluate: jest.fn((f, i) => f(i))
    } as any as Page

    await $('test-1')(mockPage, (d:any) => d) // mock html parser
    await $('test-1-1', (d:any) => d)(mockPage)
    await $('5', (d: any) => 10)(mockPage, (d: any) => d)

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 'test-1')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(2, expect.any(Function), 'test-1-1')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(3, expect.any(Function), '5')
  })

  it('$$() should call Page.evaluate() with a helper function and the correct html selector', async() => {
    await $$('test-2')(mockPage, (d:any) => []) // mock html parser
    await $$('test-2-1', (d:any) => [])(mockPage)

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 'test-2')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(2, expect.any(Function), 'test-2-1')
  })

  it('should set the 1st inject as an enriched BotFileOptions object with overloaded values based on whats passed in files()', async () => {
    // no BotFileOptions
    await htmlParser(() => 22)(
      $('test-3')
    )(mockPage)

    // htmlParser is composed with inject, so we use the mocked code at the top
    // along with this next code to grab the mock to verify our integration of the inject BotAction
    const {inject: mockInjectMethod} = require('../actions/inject')

    expect(mockInjectMethod).toHaveBeenNthCalledWith(1, expect.any(Function))
  })

  it('evaluate() should call the function with the params provided via the Puppeteer page.evaluate() method', async() => {
    mockPage = {
      evaluate: jest.fn((fn, ...params) => fn(...params))
    } as any as Page

    const mockEvaluateFunction = jest.fn()
    const mockParams = [5, 'testing', {sunshine: true}]

    await evaluate(mockEvaluateFunction, ...mockParams)(mockPage)

    expect(mockEvaluateFunction).toHaveBeenNthCalledWith(1, 5, 'testing', {sunshine: true})
  })

  //
  // e2e
  it('Should scrape joke (2 paragraph elements) and 1 home link (anchor element) and grab their text', async() => {
    // setup test
    page = await browser.newPage()
    await page.goto(BASE_URL)

    // run tests
    const homeLink = await $('.home-link')(page)
    const jokeLines = await $$('section p')(page)

    // verify results
    expect(jokeLines.length).toEqual(2)
    expect(jokeLines[0]('p').text()).toEqual('A DB admin walks into a bar, and sees his friends split across two tables.')
    expect(jokeLines[1]('p').text()).toEqual('So he walks up to the tables, and asks, "May I join you?"')

    expect(homeLink('a').text()).toEqual('Home Link')

    await page.close()
  })

  it('$() should return undefined if it doesnt find the HTML node based on the selector', async() => {
    page = await browser.newPage()

    await page.goto(BASE_URL);

    const noResult = await $('does-not-exist')(page)

    expect(noResult).toBeUndefined
    await page.close()
  })

  it('elementExists should return TRUE if the selector is found in the DOM otherwise return FALSE', async() => {
    page = await browser.newPage()

    await page.goto(BASE_URL)

    const result = await elementExists('form input[name="answer"]')(page)
    const noResult = await elementExists('not-an-html-element')(page)

    expect(result).toEqual(true)
    expect(noResult).toEqual(false)

    await page.close()
  })

  it('textExists should return TRUE if the text is found in the DOM otherwise return FALSE', async() => {
    page = await browser.newPage()

    await page.goto(BASE_URL)

    const result = await textExists('Do you want to hear a joke?')(page)
    const partialResult = await textExists(' to hear a ')(page)

    const noResult = await textExists('The local neighborhood Spiderman is on vacation')(page)

    expect(result).toEqual(true)
    expect(partialResult).toEqual(true)

    expect(noResult).toEqual(false)

    await page.close()
  })

  // clean up
  afterAll(async() => {
    jest.unmock('../actions/inject')
    await browser.close()
  })
})
