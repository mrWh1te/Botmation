import { BotFilesConfig } from "../interfaces/bot-options.interfaces"

/**
 * @description    Output BotActions injects always includes the BotFilesConfig for saving/reading files locally in HD
 */
export type BotFilesInjects = [BotFilesConfig, ...any[]]