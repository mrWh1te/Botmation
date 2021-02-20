/**
 * Date Type Gaurd
 * @param data
 */
export const isDate = (data: any): data is Date =>
  toString.call(data) === '[object Date]'
