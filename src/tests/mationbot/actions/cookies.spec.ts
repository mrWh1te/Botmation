import { saveCookies } from "@mationbot/actions/cookies";

describe("MationBot Actions: Cookies", async() => {
  await test("saveCookies() should grab the page's cookies then save them as JSON to a file", async() => {
    const fileName = 'mrcookies'

    // test setup, page with a cookie(s) to save (expect against/asset against)

    saveCookies(fileName)


    expect(filterByTerm(input, "link")).toEqual(output);
  })
})



// export const saveCookies = (fileName: string): BotAction => async(page: puppeteer.Page) => {
//   try {
//     const cookies = await page.cookies()
//     await fs.writeFile(`${createURL('.', ROOT_ASSETS_DIRECTORY, ASSETS_COOKIES_DIRECTORY)}${fileName}.json`, JSON.stringify(cookies, null, 2))
//   } catch(error) {
//     logError('[BotAction:saveCookies] ' + error)
//   }
// }