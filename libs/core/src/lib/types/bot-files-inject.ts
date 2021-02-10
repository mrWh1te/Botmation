import { BotFileOptions } from "../interfaces/bot-file-options"

/**
 * @description    BotActions ran inside files()() gets an enriched BotFileOptions object injected 1st
 */
export type BotFilesInjects = [BotFileOptions?, ...any[]]