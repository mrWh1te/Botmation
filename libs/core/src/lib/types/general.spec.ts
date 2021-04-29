import { isString } from './general'

/**
 * @description   General sync functions for various types
 */
describe('[Botmation] types/general', () => {

  //
  // Unit Test
  it('isString() returns boolean true if the provided param is a String', () => {
    // pass
    const string1 = 'hello world'
    const stringTemplateLiteral = `
      Wow! I'm on multiple
      lines.
    `
    const stringEmpty = ''

    // fails
    const object1 = {}
    const number1 = 5354
    const object2 = null
    const booleanTRUE = true
    const booleanFALSE = false

    // pass
    expect(isString(string1)).toEqual(true)
    expect(isString(stringTemplateLiteral)).toEqual(true)
    expect(isString(stringEmpty)).toEqual(true)

    // fail
    expect(isString(object1)).toEqual(false)
    expect(isString(number1)).toEqual(false)
    expect(isString(object2)).toEqual(false)
    expect(isString(booleanTRUE)).toEqual(false)
    expect(isString(booleanFALSE)).toEqual(false)
  })

})
