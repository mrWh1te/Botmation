import { BotAction } from "../interfaces"
import { getInjectsPipeValue } from "../helpers/pipe"

import {
  getLocalStorageKeyValue,
  setLocalStorageKeyValue,
  removeLocalStorageKeyValue,
  clearLocalStorage
} from "../helpers/local-storage"

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
export const removeLocalStorageItem =
  (key?: string): BotAction =>
    async(page, ...injects) => {
      const pipeValue = getInjectsPipeValue(injects)

      key ??= pipeValue && pipeValue.key ? pipeValue.key : pipeValue

      await page.evaluate(
        removeLocalStorageKeyValue,
        key ?? 'missing-key'
      )
    }

/**
 * @description     Set a `value` by 1 `key` in Local Storage
 *                  It supports piping the key and value where the Pipe's value is an object like {key: 'username', value: 'sam'}
 *                  Also, the Pipe's value can simply be the value you want to set locally ie Pipe = {brand: 'piped', value: 'sam'} or wrapped again in an object like above, then have the key set in the BotAction's param
 * @param key
 * @param value
 */
export const setLocalStorageItem =
  (key?: string, value?: string): BotAction =>
    async(page, ...injects) => {
      const pipeValue = getInjectsPipeValue(injects)

      // todo throw an error , don't error silently
      value ??= pipeValue ? pipeValue.value ? pipeValue.value : pipeValue : 'missing-value'
      key ??= pipeValue && pipeValue.key ? pipeValue.key : 'missing-key'

      await page.evaluate(
        setLocalStorageKeyValue,
        key,
        value
      )
    }

/**
 * @description     Get a `value` by 1 `key` from Local Storage
 *                  It supports piping the key where the Pipe's value is an object like {key: 'username'} or the Pipe's value is simply the key ie {brand: 'piped', value: 'username'}
 *                  If the higher order `key` param is used, then the pipe's value is ignored.
 * @param key
 */
export const getLocalStorageItem =
  (key?: string): BotAction<string|null> =>
    async(page, ...injects) => {
      const pipeValue = getInjectsPipeValue(injects)

      key ??= pipeValue && pipeValue.key ? pipeValue.key : pipeValue

      return page.evaluate(
        getLocalStorageKeyValue,
        key ?? 'missing-key'
      )
    }

