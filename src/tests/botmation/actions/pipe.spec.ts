import { Page } from 'puppeteer'

import { click, type } from 'botmation/actions/input'

import { FORM_SUBMIT_BUTTON_SELECTOR, FORM_TEXT_INPUT_SELECTOR } from 'tests/selectors'
import { BASE_URL } from 'tests/urls'
import { map, pipeValue, emptyPipe } from 'botmation/actions/pipe'
import { pipe } from 'botmation'

/**
 * @description   Pipe BotAction's
 */
describe('[Botmation] actions/pipe', () => {

  // Basic Unit Tests
  it('map() should run a function against the Pipe value then return the new value', async() => {
    const testMapFunction = jest.fn()
    await map(testMapFunction)(page, {brand: 'Pipe'})
    expect(testMapFunction).toHaveBeenCalledTimes(1)

    // example with number value
    const multiplyNumberByTwo = (x: number) => x*2

    await expect(map<number>(multiplyNumberByTwo)({} as Page, {brand: 'Pipe', value: 5})).resolves.toEqual(10)
    await expect(map<number>(multiplyNumberByTwo)({} as Page, {brand: 'Pipe'})).resolves.toEqual(NaN)
    await expect(map<number>(multiplyNumberByTwo)({} as Page)).resolves.toEqual(NaN)
  })

  it('pipeValue() should return the value given', async() => {
    await expect(pipeValue(22)({} as Page)).resolves.toEqual(22)
    await expect(pipeValue(undefined)({} as Page)).resolves.toEqual(undefined)
  })
  
  it('emptyPipe() returns undefined', async() => {
    await expect(emptyPipe({} as Page)).resolves.toEqual(undefined)
  })
})
