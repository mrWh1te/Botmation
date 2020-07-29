import { isObjectWithKey, isObjectWithValue } from 'botmation/types/objects'

/**
 * @description   Generic Object Types to Help
 */
describe('[Botmation] types/objects', () => {

/**
 * @description    Type Gaurd for Piped values (values branded as `Pipe`)
 * @param value 
 */

  //
  // Unit Tests
  it('isObjectWithKey() returns boolean if the provided param is an Object with a property `key` whose value\'s type is string', () => {
    const objectWithKeyString = {key: 'hi'}
    const objectWithKeyEmptyString = {key: ''}

    const objectWithKeyNumber = {key: 5}
    const objectWithoutKey = {hi: 'World'}
    const notObject = 'hello'
    const undefinedValue = undefined

    expect(isObjectWithKey(objectWithKeyString)).toEqual(true)
    expect(isObjectWithKey(objectWithKeyEmptyString)).toEqual(true)

    expect(isObjectWithKey(objectWithKeyNumber)).toEqual(false)
    expect(isObjectWithKey(objectWithoutKey)).toEqual(false)
    expect(isObjectWithKey(notObject)).toEqual(false)
    expect(isObjectWithKey(undefinedValue)).toEqual(false)
  })

  it('isObjectWithValue() returns boolean if the provided param is an Object with a property `value` (type any)', () => {
    const objectWithValueString = {value: 'hi'}
    const objectWithValueEmptyString = {value: ''}

    const objectWithoutValue = {hi: 'World'}
    const notObject = 'hello'
    const undefinedValue = undefined

    expect(isObjectWithValue(objectWithValueString)).toEqual(true)
    expect(isObjectWithValue(objectWithValueEmptyString)).toEqual(true)

    expect(isObjectWithValue(objectWithoutValue)).toEqual(false)
    expect(isObjectWithValue(notObject)).toEqual(false)
    expect(isObjectWithValue(undefinedValue)).toEqual(false)
  })

})
