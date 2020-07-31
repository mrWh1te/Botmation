import 'expect-puppeteer'
import { Page, Browser } from 'puppeteer'

import { enrichGoToPageOptions } from 'botmation/helpers/navigation'
import { click } from 'botmation/actions/input'
import { goTo } from 'botmation/actions/navigation'
import { Botmation } from 'botmation/class'

/**
 * @description   Test the Botmation class
 */
describe('[Botmation] class', () => {

  //
  // Create Class Instance with Static Async Method
  it('should create a Botmation instance using the static asyncConstructor() and create a new page when the browser has none automatically', async() => {
    /// this mocked use-case is for when the browser provided has no tabs open
    const mockPage = {
      click: jest.fn(),
      goto: jest.fn(),
      url: () => 'some-url'
    } as any as Page
    const mockPages = [] as any // no pages 
    // the async constructor method's purpose is to get the page (tab) from the browser
    // so if none, it needs to create it, then use it
    const mockBrowser = {
      pages: jest.fn(() => mockPages),
      newPage: jest.fn(() => mockPage)
    } as any as Browser
    
    // when browser has no pages, it creates one to use
    const bot = await Botmation.asyncConstructor(mockBrowser)

    await bot.actions(
      click('example html selector'),
      goTo('example-url')
    )

    expect(mockBrowser.pages).toHaveBeenCalled()
    expect(mockBrowser.newPage).toHaveBeenCalled()
    expect(mockPage.click).toHaveBeenCalledWith('example html selector')
    expect(mockPage.goto).toHaveBeenCalledWith('example-url', enrichGoToPageOptions())

    // When browser has pages, it uses the first one
    const mockBrowserHasPages = {
      pages: jest.fn(() => ['page1', 'page2', 'page3'])
    } as any as Browser
    const bot2 = await Botmation.asyncConstructor(mockBrowserHasPages)
    expect(bot2.getPage()).toEqual('page1')
  })

  //
  // set page
  it('should have a mutator/accessor methods for changing the page instance and getting the instance', async() => {
    // Create bot with actual page
    const bot = new Botmation({} as any as Page)

    // Change bot's page with mock page
    const mockPage = {
        click: jest.fn()
    } as any as Page
    
    // what we are testing
    bot.setPage(mockPage)

    // do these actions run on the mock page or the initial page?
    await bot.actions(
      click('mock selector')
    )

    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'mock selector')

    // test the get
    bot.setPage(1337 as any as Page)
    expect(bot.getPage()).toEqual(1337)
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
      await bot.closePage()

      expect(mockPage.close).toHaveBeenCalled()

      // we only run close if the page is defined
      bot.setPage(undefined as any as Page)
      await bot.closePage()

      expect(mockPage.close).not.toHaveBeenNthCalledWith(2)
  })
})
