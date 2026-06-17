/**
 * @description   Many DB BotAction's support Piping the `key` for getting values from a DB's key/value pair
 *                When piping `key`, it can be the Pipe.value directly, or an object wrapped `key` property
 *                This allows for a more consistent DX across other DB functions that support further Piping like Set*()
 */
export type getQueryKey = {key: string} | string
export type getQueryKeyValue = {key: string, value: any} | string