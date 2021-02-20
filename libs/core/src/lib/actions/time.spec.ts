import { schedule, wait } from './time'

import { BASE_URL } from './../mocks'

import { Page } from 'puppeteer'
import { abort } from './abort'
import { createAbortLineSignal } from '../helpers/abort'

// helper sleep mocking
jest.mock('../helpers/time', () => {
  const originalModule = jest.requireActual('../helpers/time')

  return {
    ...originalModule,
    sleep: jest.fn(() => Promise.resolve()),
  }
})

// Date stubbing
const realDateNow = Date.now.bind(global.Date);
const nowStart = realDateNow()
const dateNowStub = jest.fn(() => nowStart);
global.Date.now = dateNowStub;

// date testing
const twoHoursInMilliSeconds = 2 * 60 * 60 * 1000;
const futureDate = new Date(nowStart)
futureDate.setTime(futureDate.getTime() + twoHoursInMilliSeconds) // 2 hours into the future
const pastDate = new Date(nowStart)
pastDate.setTime(pastDate.getTime() - twoHoursInMilliSeconds) // 2 hours into the past

// cron schedule mocking
let count = 0;
jest.mock('cron-schedule', () => {
  const originalModule = jest.requireActual('cron-schedule')

  return {
    ...originalModule,
    parseCronExpression: jest.fn(() => ({
      getNextDate: () => {
        count++
        return futureDate // todo dynamically return incrementing (future) dates on each new call
      }
    }))
  }
})

/**
 * @description   Time BotActions
 */
describe('[Botmation] actions/time', () => {

  let mockPage: Page

  const mockSleepHelper = require('../helpers/time').sleep

  // action stubbing
  const action1 = jest.fn(async() => Promise.resolve())
  const actionFinal = jest.fn(async() => Promise.resolve('last one'))

  beforeEach(() => {
    mockPage = {} as any as Page
  })

  //
  // wait()
  it('wait() should call sleep with the correct values', async() => {
    await wait(5003234)(mockPage)

    expect(mockSleepHelper).toHaveBeenNthCalledWith(1, 5003234)
  })

  //
  // schedule() - 1 time event
  it('schedule() should call sleep() with the correct value then run the actions to return the final value', async() => {
    const result1 = await schedule(futureDate)(action1, actionFinal)(mockPage)

    expect(result1).toEqual('last one')
    expect(mockSleepHelper).toHaveBeenNthCalledWith(2, twoHoursInMilliSeconds)
    expect(action1).toHaveBeenCalledTimes(1)
    expect(actionFinal).toHaveBeenCalledTimes(1)
  })

  it('schedule() should take 2 assembled lines to fully abort with pipe value returned', async() => {
    const result2 = await schedule(futureDate)(action1, abort(2, 'test52'), actionFinal)(mockPage)

    expect(action1).toHaveBeenCalledTimes(2)
    expect(mockSleepHelper).toHaveBeenNthCalledWith(3, twoHoursInMilliSeconds)
    expect(actionFinal).toHaveBeenCalledTimes(1)
    expect(result2).toEqual(createAbortLineSignal(1, 'test52'))
  })

  it('schedule() should not call sleep() or run the actions when the input Date is in the now or in the past', async() => {
    const result1 = await schedule(pastDate)(action1, actionFinal)(mockPage)
    const result2 = await schedule(new Date(nowStart))(action1, actionFinal)(mockPage)

    expect(result1).toBeUndefined()
    expect(result2).toBeUndefined()

    expect(mockSleepHelper).toHaveBeenCalledTimes(3)
    expect(action1).toHaveBeenCalledTimes(2)
    expect(actionFinal).toHaveBeenCalledTimes(1)
  })

  //
  // schedule() = interval between events
  it('schedule() should call with correct time until aborted with 2 assembledLines or more', async() => {
    const dynamicAbort = async() => {
      if (count > 2) {
        return createAbortLineSignal(2, 'we were aborted')
      }
    }
    const resultCron = await schedule('* * * * *')(action1, actionFinal, dynamicAbort)(mockPage)

    expect(resultCron).toEqual('we were aborted')

    expect(mockSleepHelper).toHaveBeenNthCalledWith(4, twoHoursInMilliSeconds)
    expect(mockSleepHelper).toHaveBeenNthCalledWith(5, twoHoursInMilliSeconds)
    expect(mockSleepHelper).toHaveBeenNthCalledWith(6, twoHoursInMilliSeconds)
    expect(mockSleepHelper).toHaveBeenCalledTimes(6)

    expect(action1).toHaveBeenCalledTimes(5)
    expect(actionFinal).toHaveBeenCalledTimes(4)

    // todo test we get abortline signal if 3+ assembledLines ?
  })


  // clean up
  afterAll(() => {
    jest.unmock('../helpers/time')
    jest.unmock('cron-schedule')
    global.Date.now = realDateNow
  })
})
