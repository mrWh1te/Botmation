import { BotFileOptions } from "../interfaces/bot-file-options"
import { Pipe } from "./pipe"

/**
 * @description    Output BotActions injects always includes the BotFileOptions for saving/reading files locally in HD
 */
export type BotFilesInjects<V = undefined> = [Partial<BotFileOptions>, Pipe<V>]