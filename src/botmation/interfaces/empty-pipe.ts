import { Pipe } from "botmation/types/pipe"

/**
 * @description    Programmatic expression of what an Empty Pipe looks like
 */
export interface EmptyPipe extends Pipe {
  value: undefined
}