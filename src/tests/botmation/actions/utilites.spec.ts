import { Page } from 'puppeteer'

import { getDefaultGoToPageOptions } from 'botmation/helpers/navigation'
import { givenThat, forAll, doWhile, forAsLong } from 'botmation/actions/utilities'
import { click, type } from 'botmation/actions/input'
import { goTo } from 'botmation/actions/navigation'

import { BASE_URL } from 'tests/urls'
import { BotAction } from 'botmation/interfaces'

/**
 * @description   Utilities Action Factory
 *                The factory methods here return BotAction's for the bots to handle more complex use-cases
 */
describe('[Botmation:Action Factory] Utilities', () => {

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
    const conditionResolvingTRUE:BotAction<boolean> = async() => new Promise(resolve => resolve(true))
    const conditionResolvingFALSE:BotAction<boolean> = async() => new Promise(resolve => resolve(false))
    // The support for rejecting a Promise in a BotConditionalAction is being dropped
    // You must return a boolean value. Reject will not be understood as FALSE. That's an Error that is handled now by errors()()
    // const conditionReject:BotAction<boolean> = async() => new Promise((resolve, reject) => reject(new Error('test')))

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
    // await givenThat(conditionReject)(
    //   click('example selector 2'),
    //   type('example copy 2')
    // )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'example selector 1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, 'example copy 1')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(2, 'example selector 2')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(2, 'example copy 2')

    // expect(mockPage.click).not.toHaveBeenNthCalledWith(3, 'example selector 2')
    // expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(3, 'example copy 2')
  })

  //
  // forAll() Unit Tests
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
    const keyValuePairs = {
      'form input[name="username"]': 'example username',
      'form input[name="password"]': 'example password'
    }

    // idea of this test is for a particular use-case where provided collection is an object, 
    // whose keys are html selectors for form inputs, and the values are things to type in them
    // so it would be one data structure for doing form input, in one succinct format
    await forAll(keyValuePairs)(
      (elementSelector, copyToType) => ([
        click(elementSelector),
        type(copyToType)
      ])
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'form input[name="username"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, 'example username')

    expect(mockPage.click).toHaveBeenNthCalledWith(2, 'form input[name="password"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, 'example password')
  })

  //
  // doWhile() Unit Test
  it('should run the actions then check the condition to run the actions in a loop until the condition rejects or resolves FALSE', async() => {
    const conditionResolvingFALSE:BotAction<boolean> = async() => new Promise(resolve => resolve(false))
    const conditionReject:BotAction<boolean> = async() => new Promise((resolve, reject) => reject(new Error('test')))

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

    // These actions should run only once
    await doWhile(conditionReject)(
      click('3'),
      type('3')
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(5, '3')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(5, '3')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(6, '3')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(6, '3')
  })

  //
  // forAsLong() Unit Test
  it('should check the condition before running the actions in a loop until the condition rejects or resolves FALSE', async() => {
    const conditionResolvingFALSE:BotAction<boolean> = async() => new Promise(resolve => resolve(false))
    const conditionReject:BotAction<boolean> = async() => new Promise((resolve, reject) => reject(new Error('test')))

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

    // These actions should not run
    await forAsLong(conditionReject)(
      click('3'),
      type('3')
    )(mockPage)

    expect(mockPage.click).not.toHaveBeenNthCalledWith(3, '3')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(3, '3')
  })
})
