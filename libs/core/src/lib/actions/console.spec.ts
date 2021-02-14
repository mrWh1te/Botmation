import { log, warning, error } from './console'
import { Page, Browser } from 'puppeteer'
const puppeteer = require('puppeteer');

/**
 * @description   Console BotAction's
 *                The factory methods here return BotAction's for the bots to log themed console messages
 * @note          These messages are logged to the Node console, not the Puppeteer Page console, unless they are evaluated inside a Puppeteer Page (ie how IndexedDB is interacted with)
 */
describe('[Botmation] actions/console', () => {
  let browser: Browser
  let page: Page

  let logs: any[]
  const originalConsoleLog = console.log

  beforeAll(async() => {
    // We can do Integration instead, by jest.fn() the log, then checking we call it with params
    console.log = function() {
      logs.push([].slice.call(arguments))
    }

    browser = await puppeteer.launch()
  })

  beforeEach(async() => {
    logs = []

    page = await browser.newPage()
  })

  afterEach(async () => {
    await page.close()
  })

  //
  // Unit Tests
  it('should log a message to console only when given a message to log, otherwise a blank space', async () => {
    await log()(page)

    // Get around the Chalk styling
    expect(logs[0][0]).toEqual(expect.stringMatching('\n'))
  })

  it('should log a message to console', async () => {
    await log('example message')(page) // no injects, no pipe

    // Get around the Chalk styling
    expect(logs[0][0]).toEqual(expect.stringMatching('Log:'))
    expect(logs[0][0]).toEqual(expect.stringMatching('example message'))
    expect(logs[1][0]).toEqual(expect.stringMatching('\n'))
  })

  it('should log a message to console with Pipe value when there is a Pipe (no Pipe value is logged as Empty) and return Pipe value', async() => {
    const pipeValueReturned = await log('example 2 message')(page, {brand: 'Pipe'}) // Empty

    expect(logs[0][0]).toEqual(expect.stringMatching('Log:'))
    expect(logs[0][0]).toEqual(expect.stringMatching('example 2 message'))

    expect(logs[1][0]).toEqual(expect.stringMatching(' - pipe:'))
    expect(logs[1][0]).toEqual(expect.stringMatching('Empty'))

    expect(logs[2][0]).toEqual(expect.stringMatching('\n'))
    expect(pipeValueReturned).toBeUndefined()
  })

  it('should log a warning to console only when given a warning to log', async () => {
    await warning()(page)

    // Get around the Chalk styling
    expect(logs.length).toEqual(0)
  })

  it('should log a warning to console', async () => {
    await warning('example warning')(page)

    // Get around the Chalk styling
    expect(logs[0][0]).toEqual(expect.stringMatching('Warning:'))
    expect(logs[0][0]).toEqual(expect.stringMatching('example warning'))
  })

  it('should log a warning to console with Pipe value when there is a Pipe then return the Pipe value', async () => {
    const pipeValueReturned = await warning('example 2 warning')(page, {brand: 'Pipe', value: 22})

    // Get around the Chalk styling
    expect(logs[0][0]).toEqual(expect.stringMatching('Warning:'))
    expect(logs[0][0]).toEqual(expect.stringMatching('example 2 warning'))

    expect(logs[1][0]).toEqual(expect.stringMatching(' - pipe:'))
    expect(logs[1][0]).toEqual(expect.stringMatching('22'))

    expect(pipeValueReturned).toEqual(22)
  })

  it('should log an error to console only when given an error to log', async () => {
    await error()(page)

    // Get around the Chalk styling
    expect(logs.length).toEqual(0)
  })

  it('should log an error to console', async () => {
    await error('example error')(page)

    // Get around the Chalk styling
    expect(logs[0][0]).toEqual(expect.stringMatching('Error:'))
    expect(logs[0][0]).toEqual(expect.stringMatching('example error'))
  })

  it('should log an error to console with Pipe value when there is a Pipe then return the Pipe value', async () => {
    const pipeValueReturned = await error('example 2 error')(page, {brand: 'Pipe', value: 55})

    // Get around the Chalk styling
    expect(logs[0][0]).toEqual(expect.stringMatching('Error:'))
    expect(logs[0][0]).toEqual(expect.stringMatching('example 2 error'))

    expect(logs[1][0]).toEqual(expect.stringMatching(' - pipe:'))
    expect(logs[1][0]).toEqual(expect.stringMatching('55'))

    expect(pipeValueReturned).toEqual(55)
  })

  afterAll(async() => {
    console.log = originalConsoleLog

    await browser.close()
  })

})
