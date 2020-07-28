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

  return (typeof data === 'object' && data.value !== undefined)
}