/**
 * Functions that help with piping: pipe()() / Pipe
 */

import { InjectValue } from "../types"
import { PipeValue } from "../types/pipe-value"

/**
 * @description    Gets the Pipe value from provided `injects`, but if injects are missing a Pipe, this returns undefined instead, as if the injects had an empty Pipe (safe fallback)
 * @param injects
 */
export const getInjectsPipeValue = ({value}: Partial<InjectValue>): PipeValue =>
  value


