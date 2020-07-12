import { BotFilesConfig } from "../interfaces/bot-options.interfaces"
import { Piped } from "./piped"

/**
 * @description    Output BotActions injects always includes the BotFilesConfig for saving/reading files locally in HD
 */
export type BotFilesInjects<P = undefined> = [BotFilesConfig, Piped<P>]