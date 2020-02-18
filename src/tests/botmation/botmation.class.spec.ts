import { Page } from 'puppeteer'

import { getDefaultGoToPageOptions } from 'botmation/helpers/navigation'
import { click, type } from 'botmation/actions/input'
import { goTo } from 'botmation/actions/navigation'
import { Botmation } from 'botmation/class'
import { BotActionsChainFactory } from 'botmation/factories/bot-actions-chain.factory'

import { BASE_URL, EXAMPLE_URL, EXAMPLE_URL2 } from '../urls'
import { FORM_TEXT_INPUT_SELECTOR, FORM_SUBMIT_BUTTON_SELECTOR } from '../selectors'
import { BotOptions } from 'botmation/interfaces'
import { getDefaultBotOptions } from 'botmation/helpers/bot-options'

/**
 * @description   Test the Botmation class methods specific to the Class
 */
describe('[Botmation] Class Specific', () => {

  beforeEach(async() => {
    await page.goto(BASE_URL, getDefaultGoToPageOptions())
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
  // set options
  it('should have a mutator method for setting the options injected into the bot actions (also verifies default bot option values)', async() => {
    const mockPage = {
        url: jest.fn(() => ''),
        goto: jest.fn()
    } as any as Page
    const bot = new Botmation(mockPage) // has default options

    const botOptionsOverload: Partial<BotOptions> = {
        cookies_directory: 'cookies_test_directory',
        screenshots_directory: 'screenshots_test_directory',
        parent_output_directory: 'parent_test_directory'
    }

    // what we are testing
    bot.setOptions(botOptionsOverload) 

    // Let's double-check the default values of bot options
    let botOptions = getDefaultBotOptions()
    expect(botOptions.parent_output_directory).toEqual(undefined)
    expect(botOptions.cookies_directory).toEqual('')
    expect(botOptions.screenshots_directory).toEqual('')

    await bot.actions(
        (page: Page, options: BotOptions) => new Promise<void>(resolve => {
            botOptions = options
            return resolve()
        })
    )

    // now let's see if setOptions changed the injected options
    expect(botOptionsOverload.parent_output_directory).toEqual('parent_test_directory')
    expect(botOptions.cookies_directory).toEqual('cookies_test_directory')
    expect(botOptions.screenshots_directory).toEqual('screenshots_test_directory')
  })

  //
  // update options
  it('should have a mutator method for overloading pieces of the options injected into the bot actions', async() => {
    const mockPage = {
        url: jest.fn(() => ''),
        goto: jest.fn()
    } as any as Page
    const bot = new Botmation(mockPage) // has default options

    const botOptionsOverload: Partial<BotOptions> = {
        parent_output_directory: 'parent_test_directory'
    }

    bot.updateOptions(botOptionsOverload) // has now parent_output_directory

    let newParentOutputDirectoryValue = undefined

    await bot.actions(
        (page: Page, options: BotOptions) => new Promise<void>(resolve => {
            newParentOutputDirectoryValue = options.parent_output_directory
            return resolve()
        })
    )

    expect(newParentOutputDirectoryValue).toEqual('parent_test_directory')
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
        (page: Page, options: BotOptions, ...injects: any[]) => new Promise<void>(resolve => {
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
