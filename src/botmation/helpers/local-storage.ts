//
// The following 4 functions are evaluated in the page's browser context
//

/**
 * 
 * @param key 
 * @param value 
 */
export const setLocalStorageKeyValue = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

/**
 * @description    
 * @note: Following Storage.getItem() return signature: string|null
 *        Also, we're NOT mapping, in any way, simple as possible for greatest choice
 * @param key 
 */
export const getLocalStorageKeyValue = (key: string): string|null => 
  localStorage.getItem(key)

/**
 * 
 * @param key 
 */
export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key)
}

/**
 * @description    Care! Deletes all key/value pairs in Local Storage
 */
export const clearLocalStorage = () => {
  localStorage.clear()
}