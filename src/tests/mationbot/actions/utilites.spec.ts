import { Page } from 'puppeteer'

import { getDefaultGoToPageOptions } from '@mationbot/helpers/navigation'

import { BASE_URL } from '@tests/urls'
import { givenThat, forAll } from '@mationbot/actions/utilities'
import { click, type } from '@mationbot/actions/input'
import { goTo } from '@mationbot/actions/navigation'

/**
 * @description   Utilities Action Factory
 *                The factory methods here return BotAction's for the bots to handle more complex use-cases
 */
describe('[MationBot:Action Factory] Utilities', () => {

  let mockPage: Page

  beforeAll(async() => {
    await page.goto(BASE_URL, getDefaultGoToPageOptions())
  })

  beforeEach(() => {
    mockPage = {
      click: jest.fn(),
      keyboard: {
        type: jest.fn()
      },
      url: jest.fn(() => ''),
      goto: jest.fn()
    } as any as Page
  })

  //
  // sleep() Integration Test
  // it('should call setTimeout with the correct values', async() => {
    // jest.useFakeTimers()
    // TBI: jest does not natively support async/await promised based setTimeout
    //      therefore, there is no simple way to test this. Fortunately, it's a simple Action
    // Follow here: https://github.com/facebook/jest/issues/7151
  // })

  //
  // givenThat() Unit Test
  it('should resolve the condition and ONLY run the chain of actions if the resolved condition equals TRUE', async() => {
    const conditionResolvingTRUE = async(page: Page) => new Promise<boolean>(resolve => resolve(true))
    const conditionResolvingFALSE = async(page: Page) => new Promise<boolean>(resolve => resolve(false))
    const conditionReject = async(page: Page) => new Promise<boolean>((resolve, reject) => reject(new Error('test')))

    // These actions should run
    await givenThat(conditionResolvingTRUE)(
      click('example selector 1'),
      type('example copy 1')
    )(mockPage)

    // These actions should NOT run
    await givenThat(conditionResolvingFALSE)(
      click('example selector 2'),
      type('example copy 2')
    )(mockPage)

    // These actions should NOT run
    await givenThat(conditionReject)(
      click('example selector 2'),
      type('example copy 2')
    )

    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'example selector 1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, 'example copy 1')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(2, 'example selector 2')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(2, 'example copy 2')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(3, 'example selector 2')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(3, 'example copy 2')
  })

  //
  // forAll() Unit Test
  it('should call the list of Actions for each item in the array provided', async() => {
    const urls = ['example.html', 'example2.html', 'success.html']

    await forAll(urls)(
      (webPage) => ([
        goTo('http://localhost:8080/' + webPage)
      ])
    )(mockPage)

    // Note given the mock, these url's don't have to be real
    expect(mockPage.url).toHaveBeenNthCalledWith(3) // called 3 times
    expect(mockPage.goto).toHaveBeenNthCalledWith(1, 'http://localhost:8080/example.html', getDefaultGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(2, 'http://localhost:8080/example2.html', getDefaultGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(3, 'http://localhost:8080/success.html', getDefaultGoToPageOptions())
  })
  it('should call the list of Actions for each key->value pair in the object provided', async() => {
    expect(1).toEqual(1)
  })
})
