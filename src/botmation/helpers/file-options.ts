import { BotFileOptions } from "../interfaces/bot-file-options"

/**
 * @description   Options in configuring the bot actions
 *                This value, options, is provided to every bot action that needs it
 *                ie screenshot(), saveCookies() rely on BotOptions for determining URL 
 * @param options 
 */
export const enrichBotFileOptionsWithDefaults = (options: Partial<BotFileOptions> = {}): BotFileOptions => ({
  screenshots_directory: '',
  pdfs_directory: '',
  cookies_directory: '',
  ...options
})