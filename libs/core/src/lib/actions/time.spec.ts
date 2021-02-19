import { wait } from './time'

import { BASE_URL } from './../mocks'

import { Page } from 'puppeteer'

jest.mock('../helpers/time', () => {
  const originalModule = jest.requireActual('../helpers/time')

  return {
    ...originalModule,
    sleep: jest.fn(() => Promise.resolve()),
  }
})

/**
 * @description   Time BotActions
 */
describe('[Botmation] actions/time', () => {

  let mockPage: Page

  beforeEach(() => {
    mockPage = {
      goto: jest.fn(),
      url: jest.fn(() => BASE_URL),
      waitForNavigation: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      reload: jest.fn(),
      evaluate: jest.fn((fn, ...params) => {
        fn(...params)
        return Promise.resolve()
      })
    } as any as Page
  })

  //
  // sleep() Integration Test
  it('should call setTimeout with the correct values', async() => {
    await wait(5003234)(mockPage)

    const mockSleepHelper = require('../helpers/time').sleep

    expect(mockSleepHelper).toHaveBeenNthCalledWith(1, 5003234)
  })

  // clean up
  afterAll(async() => {
    jest.unmock('../helpers/time')
  })
})
