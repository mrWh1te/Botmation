/**
 * @description     The possible return types of a pipeable BotAction
 */
export type AllPossiblePipeValuesType = boolean|number|string|object|Function|Array<any>|null|undefined|any

/**
 * @description     Clean Pipe Value Type with Generic for more specific use-cases
 *                  The type extends AllPossiblePipeValuesType to restrict from cases such as void and never
 */
export type PipeValue<V extends AllPossiblePipeValuesType = AllPossiblePipeValuesType> = V
