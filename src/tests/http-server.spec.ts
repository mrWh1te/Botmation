import puppeteer from 'puppeteer'

/**
 * @description   Botmation's Jest Testing is configured to use `http-server` in launching a static file server based in the `/server` directory
 *                as a sandbox website to run controlled tests locally against, when needed
 */
describe('Checking HTTP-Server used in Testing', () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  beforeAll(async() => {
    browser = await puppeteer.launch()
  })

  beforeEach(async() => {
    page = await browser.newPage()
  })

  afterEach(async() => {
    await page.close()
  })

  afterAll(async() => {
    await browser.close()
  })

  it('should load on port 8080, the main index.html file found in the ./src/tests/server/ directory', async () => {
    await page.goto('http://localhost:8080')
    await expect(page.title()).resolves.toMatch('Example Testing Page')
  })
  
})
