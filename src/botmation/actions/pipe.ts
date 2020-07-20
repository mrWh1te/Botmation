import { BotAction } from "botmation/interfaces"

//
// BotAction's Focused on Pipe
//

/**
 * @description    Mapper function for Mapping Piped Values to whatever you want through a function
 *                 Won't work in Chain! Action Pipes only
 * @param mapFunction pure function to change piped value to something else
 * pipeMap ?
 */
export const map = (mapFunction: (pipedValue: any) => any): BotAction => async (page, ...injects: any[]) => 
  injects.length > 0 ? mapFunction(injects[injects.length - 1].value) : mapFunction(undefined)

/**
 * @description   Overwrite the pipe value
 * @param valueToPipe 
 */
export const pipeValue = (valueToPipe: any): BotAction => async () => valueToPipe

/**
 * @description   Empty the pipe = clear the pipe's value = sets pipe value to undefined
 */
export const emptyPipe: BotAction = async () => undefined