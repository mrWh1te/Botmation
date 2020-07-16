//
// Pipe Utilties
//

import { BotAction } from "botmation/interfaces"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"
import { wrapValueInPipe, injectsHavePipe } from "botmation/helpers/pipe"

/**
 * @description    Higher Order BotAction for running a chain link as a pipe
 * @param valueToPipe 
 */
export const pipe = 
    (valueToPipe?: any, ...newInjects: any[]) => 
      (...actions: BotAction[]): BotAction<any> => 
        async(page, ...injects) => {
          if (injectsHavePipe(injects)) {
            // injects only have a pipe when its ran inside a pipe, so lets return our value to flow with the pipe mechanics
            return await BotActionsPipe(page, ...newInjects, ...injects, wrapValueInPipe(valueToPipe))(...actions)
          }

          // otherwise, we are not in a pipe, therefore we are in a chain and do no want to return the value, because chain links are isolated, no piping
          await BotActionsPipe(page, ...newInjects, ...injects, wrapValueInPipe(valueToPipe))(...actions)
        }

/**
 * @description    Mapper function for Mapping Piped Values to whatever you want through a function
 *                 Won't work in Chain! Action Pipes only
 * @param mapFunction pure function to change piped value to something else
 * pipeMap ?
 */
export const map = (mapFunction: (pipedValue: any) => any): BotAction => async (page, ...injects: any[]) => 
  injects.length > 0 ? mapFunction(injects[injects.length - 1].value) : mapFunction(undefined)

/**
 * @description   Overwrite the piped value
 * @param valueToPipe 
 */
export const pipeValue = (valueToPipe: any): BotAction => async () => valueToPipe

/**
 * @description   Empty the pipe = clear the pipe's value = sets piped value to undefined
 */
export const emptyPipe: BotAction = async () => undefined