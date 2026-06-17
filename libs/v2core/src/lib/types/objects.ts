/**
 * Generic Object Typing to Help
 *    Dictionaries, key/value pairs, or just a key
 */

/**
 * @description    Is data provided an Object with a `key` property that holds a `string` value
 *                 ie getting data in a DB
 * @param data
 */
export const isObjectWithKey = (data: any): data is {key: string} => {
  if (!data) {
    return false
  }

  return typeof data.key === 'string'
}

/**
 * @description   Is data provided an Object with a `value` property
 * @param data
 */
export const isObjectWithValue = (data: any): data is {value: any} => {
  if (!data) {
    return false
  }

  return typeof data === 'object' && data.value !== undefined
}

/**
 * Basic Hash-Map type
 */
export type Dictionary<V = any> = {
  [key: string]: V
}

/**
 * Dictionaries are non-null objects with at least one key/value
 * @param value
 */
export const isDictionary = <V = any>(value: any): value is Dictionary<V> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).every(key => typeof key === 'string')

/**
 * Array or Dictionary
 */
export type Collection<V = any> = Array<V>|Dictionary<V>

export const isCollection = (value: any): value is Collection =>
  Array.isArray(value) || typeof value === 'object' && value !== null && Object.keys(value).every(k => typeof k === 'string')
