import 'expect-puppeteer'
import { Page, Browser } from 'puppeteer'

import { enrichGoToPageOptions } from 'botmation/helpers/navigation'
import { click, type } from 'botmation/actions/input'
import { goTo } from 'botmation/actions/navigation'
import { Botmation } from 'botmation/class'

import { BASE_URL, EXAMPLE_URL } from '../urls'
import { FORM_TEXT_INPUT_SELECTOR, FORM_SUBMIT_BUTTON_SELECTOR } from '../selectors'

/**
 * @description   Test the Botmation class methods specific to the Class
 */
describe('[Botmation] Class', () => {

  beforeEach(async() => {
    await page.goto(BASE_URL, enrichGoToPageOptions())
  })

  //
  // Async Class Instance
  it('should create a Botmation instance using the static asyncConstructor() then run the actions', async() => {
    const bot = await Botmation.asyncConstructor(browser) // <-- finicky test here

    await bot.actions(
      goTo(EXAMPLE_URL),
      click(FORM_TEXT_INPUT_SELECTOR),
      type('loremlipsumloremlipsum'),
      click(FORM_SUBMIT_BUTTON_SELECTOR)
    )

    expect(bot.getPage().url()).toEqual('http://localhost:8080/success.html?answer=loremlipsumloremlipsum')
  })
  it('should create a Botmation instance using the static asyncConstructor() and create a new page when the browser has none automatically', async() => {
    /// this mocked use-case is for when the browser provided has no tabs open
    const mockPage = {
      click: jest.fn()
    } as any as Page
    const mockPages = [] as any // no pages 
    // the async constructor method's purpose is to get the page (tab) from the browser
    // so if none, it needs to create it, then use it
    const mockBrowser = {
      pages: jest.fn(() => mockPages),
      newPage: jest.fn(() => mockPage)
    } as any as Browser
    
    const bot = await Botmation.asyncConstructor(mockBrowser)

    await bot.actions(
      click('example html selector')
    )

    expect(mockBrowser.pages).toHaveBeenCalled()
    expect(mockBrowser.newPage).toHaveBeenCalled()
    expect(mockPage.click).toHaveBeenCalledWith('example html selector')
  })

  //
  // Regular Class Instance
  it('should create a Botmation instance then run the actions', async() => {
    const bot = new Botmation(page)

    await bot.actions(
      goTo(EXAMPLE_URL),
      click(FORM_TEXT_INPUT_SELECTOR),
      type('loremlipsum'),
      click(FORM_SUBMIT_BUTTON_SELECTOR)
    )

    expect(page.url()).toEqual('http://localhost:8080/success.html?answer=loremlipsum')
  })

  //
  // set page
  it('should have a mutator method for changing the page instance', async() => {
    // Create bot with actual page
    const bot = new Botmation(page)

    // Change bot's page with mock page
    const mockPage = {
        click: jest.fn()
    } as any as Page
    
    // what we are testing:
    bot.setPage(mockPage)

    // do these actions run on the mock page or the initial page?
    await bot.actions(
      click('mock selector')
    )

    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'mock selector')
  })

  //
  // set injects
  it('should have a mutator method for setting the injects (optional stuff for devs to add for custom bot actions) that are injected into the bot actions', async() => {
    const mockPage = {} as any as Page
    const inject1 = jest.fn()

    const bot = new Botmation(mockPage)
    bot.setInjects(inject1)

    inject1()
    expect(inject1).toHaveBeenCalled()

    await bot.actions(
        (page: Page, ...injects: any[]) => new Promise<void>(resolve => {
            injects[0]()
            return resolve()
        })
    )

    expect(inject1).toHaveBeenNthCalledWith(2)
  })
  
  //
  // close page
  it('should have a method to close the page the bot is crawling on, which is the tab in the browser', async() => {
      const mockPage = {
          close: jest.fn()
      } as any as Page

      const bot = new Botmation(mockPage)

      // what we are testing
      bot.closePage()

      expect(mockPage.close).toHaveBeenCalled()

      // we only run close if the page is defined
      bot.setPage(undefined as any as Page)
      bot.closePage()

      expect(mockPage.close).not.toHaveBeenNthCalledWith(2)
  })
})
