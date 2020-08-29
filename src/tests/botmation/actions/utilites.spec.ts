import { Page } from 'puppeteer'

import { enrichGoToPageOptions } from 'botmation/helpers/navigation'
import { givenThat, forAll, doWhile, forAsLong } from 'botmation/actions/utilities'
import { click, type } from 'botmation/actions/input'
import { goTo } from 'botmation/actions/navigation'

import { BASE_URL } from 'tests/urls'
import { BotAction } from 'botmation/interfaces'
import { Dictionary } from 'botmation'

jest.mock('botmation/helpers/console', () => {
  return {
    logWarning: jest.fn(() => {})
  }
})

/**
 * @description   Utility BotAction's
 *                The factory methods here return BotAction's for the bots to handle more complex functional flows
 */
describe('[Botmation] actions/utilities', () => {

  let mockPage: Page

  beforeAll(async() => {
    await page.goto(BASE_URL, enrichGoToPageOptions())
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
  // givenThat() Unit Test
  it('should resolve the condition and ONLY run the chain of actions if the resolved condition equals TRUE', async() => {
    const conditionResolvingTRUE:BotAction<boolean> = async() => new Promise(resolve => resolve(true))
    const conditionResolvingFALSE:BotAction<boolean> = async() => new Promise(resolve => resolve(false))

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

    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'example selector 1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, 'example copy 1')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(2, 'example selector 2')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(2, 'example copy 2')
  })

  //
  // forAll() Unit Tests
  it('should call the list of Actions for each item in the array provided through either higher-order param or Pipe object value', async() => {
    const urls = ['example.html', 'example2.html', 'success.html']

    await forAll(urls)(
      (webPage) => ([
        goTo('http://localhost:8080/' + webPage)
      ])
    )(mockPage)

    // Note given the mock, these url's don't have to be real
    expect(mockPage.url).toHaveBeenNthCalledWith(3) // called 3 times
    expect(mockPage.goto).toHaveBeenNthCalledWith(1, 'http://localhost:8080/example.html', enrichGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(2, 'http://localhost:8080/example2.html', enrichGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(3, 'http://localhost:8080/success.html', enrichGoToPageOptions())

    // reset mockPage to run same tests again except with Piping the collection
    mockPage = {
      url: jest.fn(() => ''),
      goto: jest.fn()
    } as any as Page

    await forAll()(
      (webPage) => ([
        goTo('http://localhost:8080/' + webPage)
      ])
    )(mockPage, {brand: 'Pipe', value: urls})

    // Note given the mock, these url's don't have to be real
    expect(mockPage.url).toHaveBeenNthCalledWith(3) // called 3 times
    expect(mockPage.goto).toHaveBeenNthCalledWith(1, 'http://localhost:8080/example.html', enrichGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(2, 'http://localhost:8080/example2.html', enrichGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(3, 'http://localhost:8080/success.html', enrichGoToPageOptions())

    // reset mockPage to run same tests again except with Piping the collection
    mockPage = {
      url: jest.fn(() => ''),
      goto: jest.fn()
    } as any as Page

    const {logWarning: mocklogWarning} = require('botmation/helpers/console')

    await forAll()(
      (webPage) => ([
        goTo('http://localhost:8080/' + webPage)
      ])
    )(mockPage)
    
    expect(mocklogWarning).toHaveBeenCalledTimes(1)
    expect(mocklogWarning).toHaveBeenNthCalledWith(1, 'Utilities forAll() missing collection')
    expect(mockPage.url).toHaveBeenCalledTimes(0)
    expect(mockPage.goto).toHaveBeenCalledTimes(0)
  })

  it('should call the list of Actions for each key->value pair in the object provided', async() => {
    const keyValuePairs: Dictionary = {
      'form input[name="username"]': 'example username',
      'form input[name="password"]': 'example password'
    }

    // idea of this test is for a particular use-case where provided collection is an object, 
    // whose keys are html selectors for form inputs, and the values are strings to type in
    // so it would be one data structure for doing form input[type=text], in one succinct format
    await forAll(keyValuePairs)(
      (copyToType, elementSelector) => ([
        click(elementSelector),
        type(copyToType)
      ])
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'form input[name="username"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, 'example username')

    expect(mockPage.click).toHaveBeenNthCalledWith(2, 'form input[name="password"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, 'example password')

    // reset mockPage to run same tests again except with Piping the collection
    mockPage = {
      click: jest.fn(),
      keyboard: {
        type: jest.fn()
      }
    } as any as Page

    await forAll()(
      (copyToType, elementSelector) => ([
        click(elementSelector),
        type(copyToType)
      ])
    )(mockPage, {brand:'Pipe', value: keyValuePairs})
    
    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'form input[name="username"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, 'example username')

    expect(mockPage.click).toHaveBeenNthCalledWith(2, 'form input[name="password"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, 'example password')
  })

  it('should recognize null is an object not to iterate', async() => {
    await forAll()(
      (iteratedPiece) => ([
        click(iteratedPiece),
        type(iteratedPiece)
      ])
    )(mockPage, {brand:'Pipe', value: null})
    
    expect(mockPage.click).toHaveBeenCalledTimes(0)
    expect(mockPage.keyboard.type).toHaveBeenCalledTimes(0)
  })

  //
  // doWhile() Unit Test
  it('should run the actions then check the condition to run the actions in a loop until the condition rejects or resolves FALSE', async() => {
    const conditionResolvingFALSE:BotAction<boolean> = async() => new Promise(resolve => resolve(false))

    // Main test
    let conditionResolvingCount = 0;
    const conditionResolvesTrueUntil3rdResolveAsFalse = async() =>
      new Promise<boolean>(resolve => {
        // let it resolve True twice, then resolve False
        if (conditionResolvingCount > 1) {
          return resolve(false)
        }

        conditionResolvingCount++
        return resolve(true)
      })

    // These actions should run 3 times, then stop
    // 1st time because doWhile always runs the actions at least once without checking the condition
    // 2nd time is the first time the condition resolves True
    // 3rd time is the second time the condition resolves True
    // 4th time is when condition finally resolves False
    await doWhile(conditionResolvesTrueUntil3rdResolveAsFalse)(
      click('1'),
      type('1')
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(1, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, '1')

    expect(mockPage.click).toHaveBeenNthCalledWith(2, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, '1')

    expect(mockPage.click).toHaveBeenNthCalledWith(3, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(3, '1')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(4, '1')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(4, '1')

    // These actions should run only once
    await doWhile(conditionResolvingFALSE)(
      click('2'),
      type('2')
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(4, '2')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(4, '2')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(5, '2')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(5, '2')
  })

  //
  // forAsLong() Unit Test
  it('should check the condition before running the actions in a loop until the condition rejects or resolves FALSE', async() => {
    const conditionResolvingFALSE:BotAction<boolean> = async() => new Promise(resolve => resolve(false))

    // Main test
    let conditionResolvingCount = 0;
    const conditionResolvesTrueUntil3rdResolveAsFalse = async() =>
      new Promise<boolean>(resolve => {
        // let it resolve True twice, then resolve False
        if (conditionResolvingCount > 1) {
          return resolve(false)
        }

        conditionResolvingCount++
        return resolve(true)
      })

    // These actions should run 2 times, then stop
    // 1st time because condition resolves True
    // 2nd time because the condition resolves True
    // 3rd time is when condition finally resolves False
    await forAsLong(conditionResolvesTrueUntil3rdResolveAsFalse)(
      click('1'),
      type('1')
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(1, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, '1')

    expect(mockPage.click).toHaveBeenNthCalledWith(2, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, '1')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(3, '1')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(3, '1')

    // These actions should not run
    await forAsLong(conditionResolvingFALSE)(
      click('2'),
      type('2')
    )(mockPage)

    expect(mockPage.click).not.toHaveBeenNthCalledWith(3, '2')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(3, '2')
  })

  afterAll(() => {
    jest.unmock('botmation/helpers/console')
  })
})
