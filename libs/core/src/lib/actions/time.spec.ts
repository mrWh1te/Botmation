import { schedule, wait } from './time'

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
  const now = new Date()

  // Date stubbing
  const realDateNow = Date.now.bind(global.Date);
  const nowStart = realDateNow()
  const dateNowStub = jest.fn(() => nowStart);
  global.Date.now = dateNowStub;

  beforeEach(() => {
    mockPage = {} as any as Page
  })

  //
  // schedule() Date input testing
  it('should call sleep() with the correct value then run the actions to return the final value', async() => {
    const futureDate = new Date(nowStart)
    futureDate.setTime(futureDate.getTime() + (2*60*60*1000)) // 2 hours into the future

    const action1 = jest.fn(async() => Promise.resolve())
    const actionFinal = jest.fn(async() => Promise.resolve('last one'))

    const result1 = await schedule(futureDate)(action1, actionFinal)(mockPage)
    expect(result1).toEqual('last one')

    const mockSleepHelper = require('../helpers/time').sleep

    expect(mockSleepHelper).toHaveBeenNthCalledWith(1, 2*60*60*1000)
    expect(action1).toHaveBeenCalledTimes(1)
    expect(actionFinal).toHaveBeenCalledTimes(1)
  })

  //
  // sleep() Integration Test
  it('should call setTimeout with the correct values', async() => {
    await wait(5003234)(mockPage)

    const mockSleepHelper = require('../helpers/time').sleep

    expect(mockSleepHelper).toHaveBeenNthCalledWith(2, 5003234)
  })

  // clean up
  afterAll(async() => {
    jest.unmock('../helpers/time')
    global.Date.now = realDateNow
  })
})
