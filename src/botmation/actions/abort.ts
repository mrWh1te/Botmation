import { PipeValue } from "../types"
import { BotAction } from "../interfaces"

export interface AbortSignal {
  brand: 'Abort_Signal',
  assembledLines: number,
  pipeValue?: PipeValue
}

export const createAbortSignal = (assembledLines = 1, pipeValue?: PipeValue): AbortSignal => ({
  brand: 'Abort_Signal',
  assembledLines,
  pipeValue
})

export const abort = (assembledLines = 1, pipeValue?: PipeValue): BotAction<AbortSignal> =>
  async() => createAbortSignal(assembledLines, pipeValue)