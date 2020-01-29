import { screenshot } from "@mationbot/actions/output"

describe('Testing Demo HTTP-Server used for Testing', () => {

  beforeAll(async () => {    
    await page.goto('http://localhost:8080')
  })

  it('should saveCookies(fileName) from page', async () => {
    // example of running a BotAction, without a MationBot instance
    // they are de-coupled :)
    await screenshot('what-is-this-2')(page)

    await expect(page.title()).resolves.toMatch('Example Testing Page')
  })
})
