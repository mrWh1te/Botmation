//
// Pipe Utilties
//

import { BotAction } from "botmation/interfaces"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"
import { wrapValueInPipe, injectsHavePipe, getInjectsPipeValue } from "botmation/helpers/pipe"

/**
 * @description    Higher Order BotAction for running a chain link as a pipe
 *                 It will try to inject the valueToPipe as the piped value unless that is undefined, then it will try to pipe the higher pipe's value from its injects otherwise undefined, an empty pipe
 * @param valueToPipe 
 */
export const pipe = 
    (valueToPipe?: any, ...newInjects: any[]) => 
      (...actions: BotAction[]): BotAction<any> => 
        async(page, ...injects) => {
          if (injectsHavePipe(injects)) {
            // injects only have a pipe when its ran inside a pipe, so lets return our value to flow with the pipe mechanics
            if (valueToPipe) {
              return await BotActionsPipe(page, ...newInjects, ...injects.splice(0,injects.length - 1), wrapValueInPipe(valueToPipe))(...actions)
            } else {
              return await BotActionsPipe(page, ...newInjects, ...injects)(...actions)
            }
          }

          // otherwise, we are not in a pipe, therefore we are in a chain and do no want to return the value, because chain links are isolated, no piping
          // also in a chain, we dont have a pipe as the last inject, so we don't need to splice our injects when overridding pipe values
          await BotActionsPipe(page, ...newInjects, ...injects, wrapValueInPipe(valueToPipe || getInjectsPipeValue(injects)))(...actions)
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