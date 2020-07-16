//
// Pipe Utilties
//

import { BotAction5 } from "botmation/interfaces"

/**
 * @description    Mapper function for Mapping Piped Values to whatever you want through a function
 *                 Won't work in Chain! Action Pipes only
 * @param mapFunction pure function to change piped value to something else
 * pipeMap ?
 */
export const map = (mapFunction: (pipedValue: any) => any): BotAction5 => async (page, ...injects: any[]) => 
  injects.length > 0 ? mapFunction(injects[injects.length - 1].value) : mapFunction(undefined)

/**
 * @description   Overwrite the piped value
 * @param valueToPipe 
 */
export const pipe = (valueToPipe: any): BotAction5 => async () => valueToPipe

/**
 * @description   Empty the pipe = clear the pipe's value = sets piped value to undefined
 */
export const emptyPipe: BotAction5 = async () => undefined