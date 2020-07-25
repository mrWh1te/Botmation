//
// The following functions are evaluated in a Puppeteer Page instance's browser context
//

/**
 * @description    Set a key/value pair in Local Storage
 * @param key 
 * @param value 
 */
/* istanbul ignore next */
export const setLocalStorageKeyValue = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

/**
 * @description    Get value by key in Local Storage
 * @note           Following Storage.getItem() return signature: string|null
 *                 Therefore, NOT mapping the return value
 * @param key 
 */
/* istanbul ignore next */
export const getLocalStorageKeyValue = (key: string): string|null => 
  localStorage.getItem(key)

/**
 * @description    Delete key/value pair in Local Storage
 * @param key 
 */
/* istanbul ignore next */
export const removeLocalStorageKeyValue = (key: string) => {
  localStorage.removeItem(key)
}

/**
 * @description    Care! Delete all key/value pairs in Local Storage
 */
/* istanbul ignore next */
export const clearLocalStorage = () => {
  localStorage.clear()
}