import { createMockLocalStorage } from './../mocks'
import { setLocalStorageKeyValue, getLocalStorageKeyValue, removeLocalStorageKeyValue, clearLocalStorage } from './local-storage'

// Setup Mock Local Storage
Object.defineProperty(global, 'localStorage', { value: createMockLocalStorage() })

/**
 * @description   Local Storage Helpers
 */
describe('[Botmation] helpers/local-storage', () => {

  beforeEach(() => {
    localStorage.clear()
  })

  // Test setting value by key
  it('sets key/value pairs in Local Storage with setLocalStorageKeyValue()', () => {
    const key = 'some-key-1'
    const value = 'some-value-1'

    // run test code
    setLocalStorageKeyValue(key, value)

    // confirm results
    expect(localStorage.getItem('some-key-1')).toEqual('some-value-1')
  })

  // Test getting value by key
  it('gets value by key in Local Storage with getLocalStorageKeyValue()', () => {
    const key = 'some-key-2'
    const value = 'some-value-2'

    // setup test
    localStorage.setItem(key, value)

    // run test code
    const gotValue = getLocalStorageKeyValue('some-key-2')

    // confirm results
    expect(gotValue).toEqual('some-value-2')
  })

  // Test removing (deleting) key/value pair by key
  it('removes key/value pair by key in Local Storage with removeLocalStorageKeyValue()', () => {
    const key = 'some-key-3'
    const value = 'some-value-3'

    // setup test
    localStorage.setItem(key, value)

    // run test code
    removeLocalStorageKeyValue(key)

    // confirm results
    const gotValue = localStorage.getItem('some-key-3')
    expect(gotValue).toEqual(null)
  })

  // Test clearing all key/value pairs
  it('removes all key/value pairs from Local Storage with clearLocalStorage()', () => {
    const key = 'some-key-4'
    const value = 'some-value-4'

    const key5 = 'some-key-5'
    const value5 = 'some-value-5'

    // setup test
    localStorage.setItem(key, value)
    localStorage.setItem(key5, value5)

    // run test code
    clearLocalStorage()

    // confirm results
    const gotValue = localStorage.getItem('some-key-4')
    expect(gotValue).toEqual(null)
    const gotValue5 = localStorage.getItem('some-key-5')
    expect(gotValue5).toEqual(null)
  })

})
