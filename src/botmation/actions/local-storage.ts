import { BotAction } from "botmation/interfaces"
import { getInjectsPipeValue } from "botmation/helpers/pipe"

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
      const pipedValue = getInjectsPipeValue(injects)

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
 * @description     Set a `value` by 1 `key` in Local Storage
 *                  It supports piping the key and value where the Pipe's value is an object like {key: 'username', value: 'sam'}
 *                  Also, the Pipe's value can simply be the value you want to set locally ie Pipe = {brand: 'piped', value: 'sam'} or wrapped again in an object like above, then have the key set in the BotAction's param
 * @param key 
 * @param value 
 */
export const setLocalStorageValue = 
  (key?: string, value?: string): BotAction => 
    async(page, ...injects) => {
      const pipedValue = getInjectsPipeValue(injects)

      if (!value) {
        if (pipedValue) {
          // idea here is that the piped value is anothe object with keys {key: '', value: ''} -> to map as what we are setting in the DB
          if (pipedValue.value) {
            value = pipedValue.value
          } else {
            // with potential fallback that the Pipe's value IS the value to set, and we'll get the key from the BotAction's higher order `key` param
            value = pipedValue
          }
        }
      }

      await page.evaluate(
        setLocalStorageKeyValue,
        key ? key : 'missing-key',
        value ? value : 'missing-value'
      )
    }

/**
 * @description     Get a `value` by 1 `key` from Local Storage
 *                  It supports piping the key where the Pipe's value is an object like {key: 'username'} or the Pipe's value is simply the key ie {brand: 'piped', value: 'username'}
 *                  If the higher order `key` param is used, then the pipe's value is ignored.
 * @param key 
 */
export const getLocalStorageValue = 
  (key?: string): BotAction<string|null> => 
    async(page, ...injects) => {
      const pipedValue = getInjectsPipeValue(injects)

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

