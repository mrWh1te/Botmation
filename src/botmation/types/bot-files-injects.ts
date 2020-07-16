import { BotFileOptions } from "../interfaces/bot-file-options.interfaces"
import { PipeValue } from "./pipe"

/**
 * @description    Output BotActions injects always includes the BotFileOptions for saving/reading files locally in HD
 */
export type BotFilesInjects<P = undefined> = [Partial<BotFileOptions>, PipeValue<P>]