import { BotAction } from "../interfaces"
import { PipeValue } from "../types/pipe-value"
import { getInjectsPipeValue } from "../helpers/pipe"

//
// BotAction's Focused on Piping
//   They are not intended for use in a chain()()
//

/**
 * @description    Mapper function for Mapping Piped Values to whatever you want through a function
 *                 If the Pipe is missing from the `injects`, undefined will be past into the mapFunction, like an empty Pipe
 * @param mapFunction pure function to change the piped value to something else
 */
export const map = <R extends PipeValue = PipeValue>(mapFunction: (pipedValue: any) => R): BotAction<R> => 
  async (page, ...injects) => 
    mapFunction(getInjectsPipeValue(injects))
    

/**
 * @description   Sets the Pipe's value for the next BotAction
 * @param valueToPipe 
 */
export const pipeValue = <R extends PipeValue = PipeValue>(valueToPipe: R|undefined): BotAction<R|undefined> => async () => valueToPipe

/**
 * @description   Empty the Pipe, which sets the Pipe's value to undefined
 */
export const emptyPipe: BotAction = async () => undefined