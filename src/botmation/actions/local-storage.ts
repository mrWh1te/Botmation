import { BotAction } from "botmation/interfaces"
import { getInjectsPipedValue } from "botmation/helpers/pipe"

import { 
  getLocalStorageKeyValue,
  setLocalStorageKeyValue,
  removeLocalStorageItem,
  clearLocalStorage
} from "botmation/helpers/local-storage"

/**
 * @description     Care! Clears all key/value pairs from Local Storage
 * @param page 
 */
export const clearAllLocalStorage: BotAction = 
  async (page) => {
    await page.evaluate(
      clearLocalStorage
    )
  }

/**
 * @description    Deletes one Key/Value pair from Local Storage
 * @param key 
 */
export const removeLocalStorageKey = 
  (key?: string): BotAction =>
    async(page, ...injects) => {
      // it works, the types of the Injects are known, but resolved to the end types so devs dont get to know more....
      let pipedValue = getInjectsPipedValue(injects)

      if (!key) {
        if (pipedValue) {
          if (pipedValue.key) {
            key = pipedValue.key
          } else {
            key = pipedValue
          }
        }
      }

      await page.evaluate(
        removeLocalStorageItem,
        key ? key : 'missing-key'
      )
    }

/**
 * @description     Sets the `value` of 1 `key` in Local Storage
 * @param key 
 * @param value 
 */
export const setLocalStorageValue = 
  (key?: string, value?: string): BotAction => 
    async(page, ...injects) => {
      // it works, the types of the Injects are known, but resolved to the end types so devs dont get to know more....
      let pipedValue = getInjectsPipedValue(injects)

      if (!value) {
        if (pipedValue) {
          // idea here is that the piped value is anothe object with keys {key: '', value: ''} -> to map as what we are setting in the DB
          if (pipedValue.value) {
            value = pipedValue.value
          } else {
            value = pipedValue
          }
        }
      }
      if (!key) {
        if (pipedValue && pipedValue.key) {
          key = pipedValue.key
        }
      }

      await page.evaluate(
        setLocalStorageKeyValue,
        key ? key : 'missing-key',
        value ? value : 'missing-value'
      )
    }

/**
 * @description     Gets the `value` of 1 `key` from Local Storage
 * @param key 
 */
export const getLocalStorageValue = 
  (key?: string): BotAction => 
    async(page, ...injects) => {
      // it works, the types of the Injects are known, but resolved to the end types so devs dont get to know more....
      let pipedValue = getInjectsPipedValue(injects)

      if (!key) {
        if (pipedValue) {
          if (pipedValue.key) {
            key = pipedValue.key
          } else {
            key = pipedValue
          }
        }
      }

      return await page.evaluate(
        getLocalStorageKeyValue,
        key ? key : 'missing-key'
      )
    }

