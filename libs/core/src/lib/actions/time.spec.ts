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

  const mockSleepHelper = require('../helpers/time').sleep

  // Date stubbing
  const realDateNow = Date.now.bind(global.Date);
  const nowStart = realDateNow()
  const dateNowStub = jest.fn(() => nowStart);
  global.Date.now = dateNowStub;

  // date testing
  const twoHoursInMilliSeconds = 2 * 60 * 60 * 1000;
  const futureDate = new Date(nowStart)
  futureDate.setTime(futureDate.getTime() + twoHoursInMilliSeconds) // 2 hours into the future

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
  // schedule()
  it('schedule() should call sleep() with the correct value then run the actions to return the final value', async() => {
    const result1 = await schedule(futureDate)(action1, actionFinal)(mockPage)

    expect(result1).toEqual('last one')
    expect(mockSleepHelper).toHaveBeenNthCalledWith(2, twoHoursInMilliSeconds)
    expect(action1).toHaveBeenCalledTimes(1)
    expect(actionFinal).toHaveBeenCalledTimes(1)
  })

  it('schedule() should take 2 assembled lines to fully abort with pipe value returned', async() => {
    // fully abort out of schedule takes at least 2 assembled lines:
    //    1. break the actions pipe
    //    2. break the scheduler itself
    // while it could be simpler with 1 assembled lines for one-time scheduling
    //   this keeps the aborting assembledLines consistent for either input types (cronjob or Date | interval vs one-time)
    const result2 = await schedule(futureDate)(action1, abort(2, 'test52'), actionFinal)(mockPage)

    expect(action1).toHaveBeenCalledTimes(2)
    expect(mockSleepHelper).toHaveBeenNthCalledWith(3, twoHoursInMilliSeconds)
    expect(actionFinal).toHaveBeenCalledTimes(1)
    expect(result2).toEqual('test52')
  })

  // todo test the cronjob scheduling & aborting


  // clean up
  afterAll(async() => {
    jest.unmock('../helpers/time')
    global.Date.now = realDateNow
  })
})
