import { BotFileOptions } from "../interfaces/bot-file-options.interfaces"
import { PipedValue } from "./piped"

/**
 * @description    Output BotActions injects always includes the BotFileOptions for saving/reading files locally in HD
 */
export type BotFilesInjects<P = undefined> = [Partial<BotFileOptions>, PipedValue<P>]