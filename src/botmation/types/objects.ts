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

  if (typeof data.key === 'string') {
    return true
  }

  return false
}

/**
 * @description    Is data provided an Object with `key` & `value` properties
 *                 ie setting data in a DB
 * @param data 
 */
export const isObjectWithKeyValue = (data: any): data is {key: string, value: any} => {
  if (!data) {
    return false
  }

  if (typeof data.key === 'string' && data.value) {
    return true
  }

  return false
}