import { saveCookies } from "@mationbot/actions/cookies"
import { MationBot } from "@mationbot"
import { goTo } from "@mationbot/actions/navigation"
import { screenshot } from "@mationbot/actions/output"

describe('MationBot Action Factory: Cookies', () => {
  let bot: MationBot

  beforeAll(async () => {
    bot = new MationBot(page)

    console.log(JSON.stringify(screenshot))

    // example of running a BotAction, without a MationBot instance
    // they are de-coupled :)
    await screenshot('what-is-this')(page)
    
  })

  it('should be titled "Google"', async () => {
    await page.goto('https://google.com')
    await expect(page.title()).resolves.toMatch('Google')
  })
})



// describe("MationBot Actions: Cookies", async() => {
//   await test("saveCookies() should grab the page's cookies then save them as JSON to a file", async() => {
//     const fileName = 'mrcookies'

//     // test setup, page with a cookie(s) to save (expect against/asset against)

//     await saveCookies(fileName)(page)


//     expect(filterByTerm(input, "link")).toEqual(output);
//   })
// })



// export const saveCookies = (fileName: string): BotAction => async(page: puppeteer.Page) => {
//   try {
//     const cookies = await page.cookies()
//     await fs.writeFile(`${createURL('.', ROOT_ASSETS_DIRECTORY, ASSETS_COOKIES_DIRECTORY)}${fileName}.json`, JSON.stringify(cookies, null, 2))
//   } catch(error) {
//     logError('[BotAction:saveCookies] ' + error)
//   }
// }