import { schedule, wait } from './time'

import { BASE_URL } from './../mocks'

import { Page } from 'puppeteer'
import { abort } from './abort'

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

  // Date stubbing
  const realDateNow = Date.now.bind(global.Date);
  const nowStart = realDateNow()
  const dateNowStub = jest.fn(() => nowStart);
  global.Date.now = dateNowStub;

  beforeEach(() => {
    mockPage = {} as any as Page
  })

  //
  // sleep() Integration Test
  it('should call setTimeout with the correct values', async() => {
    await wait(5003234)(mockPage)

    const mockSleepHelper = require('../helpers/time').sleep

    expect(mockSleepHelper).toHaveBeenNthCalledWith(1, 5003234)
  })

  //
  // schedule() Date input testing
  it('should call sleep() with the correct value then run the actions to return the final value', async() => {
    const futureDate = new Date(nowStart)
    const twoHoursInMilliSeconds = 2 * 60 * 60 * 1000;

    futureDate.setTime(futureDate.getTime() + twoHoursInMilliSeconds) // 2 hours into the future

    const action1 = jest.fn(async() => Promise.resolve())
    const actionFinal = jest.fn(async() => Promise.resolve('last one'))

    const result1 = await schedule(futureDate)(action1, actionFinal)(mockPage)
    expect(result1).toEqual('last one')

    const mockSleepHelper = require('../helpers/time').sleep

    expect(mockSleepHelper).toHaveBeenNthCalledWith(2, twoHoursInMilliSeconds)
    expect(action1).toHaveBeenCalledTimes(1)
    expect(actionFinal).toHaveBeenCalledTimes(1)

    // abort out of schedule takes 2: 1 to break the actions pipe, and 2nd to break the scheduler
    // while it could be simpler for one-time scheduling, this keeps the aborting consistent for either input types
    const result2 = await schedule(futureDate)(action1, abort(2, 'test52'), actionFinal)(mockPage)
    expect(action1).toHaveBeenCalledTimes(2)
    expect(mockSleepHelper).toHaveBeenNthCalledWith(3, twoHoursInMilliSeconds)
    expect(actionFinal).toHaveBeenCalledTimes(1)
    expect(result2).toEqual('test52')
  })



  // clean up
  afterAll(async() => {
    jest.unmock('../helpers/time')
    global.Date.now = realDateNow
  })
})
