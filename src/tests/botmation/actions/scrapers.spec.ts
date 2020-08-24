import { Page } from 'puppeteer'

import { BASE_URL } from 'tests/urls'
import { $, $$, htmlParser } from 'botmation/actions/scrapers'

// Mock inject()()
jest.mock('botmation/actions/inject', () => {
  const originalModule = jest.requireActual('botmation/actions/inject')

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
    querySelectorAll: mockQuerySelectorAll()
  }
})

/**
 * @description   Scraping BotAction's
 */
describe('[Botmation] actions/scraping', () => {
  let mockPage: Page

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

    const result = await $('5', (d: any) => 10)(mockPage, (d: any) => d)

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 'test-1')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(2, expect.any(Function), 'test-1-1')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(3, expect.any(Function), '5')
    expect(result).toEqual(10)
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
    const {inject: mockInjectMethod} = require('botmation/actions/inject')
    
    expect(mockInjectMethod).toHaveBeenNthCalledWith(1, expect.any(Function))
  })

  //
  // Unit-Tests
  it('Should scrape joke (2 paragraph elements) and 1 home link (anchor element) and grab their text', async() => {
    // setup test
    await page.goto(BASE_URL)

    // run tests
    const homeLink = await $('.home-link')(page)
    const jokeLines = await $$('section p')(page)

    // verify results
    expect(jokeLines.length).toEqual(2)
    expect(jokeLines[0]('p').text()).toEqual('A DB admin walks into a bar, and sees his friends split across two tables.')
    expect(jokeLines[1]('p').text()).toEqual('So he walks up to the tables, and asks, "May I join you?"')

    expect(homeLink('a').text()).toEqual('Home Link')
  })

  afterAll(() => {
    jest.unmock('botmation/actions/inject')
  })
})
