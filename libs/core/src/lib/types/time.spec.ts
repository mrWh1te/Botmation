import { isDate } from './time'

/**
 * @description   Date Type guard function
 */
describe('[Botmation] types/time', () => {

  //
  // Unit Test
  it('isDate() returns true if the provided param is a Date instance', () => {
    // pass
    const date1 = new Date()
    const date2 = new Date()
    date2.setTime(new Date().getTime() + 123091203981230) // some future date

    // fails
    const fail1 = 673
    const fail2 = 'tsdfoinsdf'
    const fail3 = {}
    const fail4 = 'November 26, 2012'

    // pass
    expect(isDate(date1)).toEqual(true)
    expect(isDate(date2)).toEqual(true)

    // fail
    expect(isDate(fail1)).toEqual(false)
    expect(isDate(fail2)).toEqual(false)
    expect(isDate(fail3)).toEqual(false)
    expect(isDate(fail4)).toEqual(false)
  })

})
