import { BotOptions } from "../interfaces/bot-options.interfaces"

/**
 * @description   Options in configuring the bot actions
 *                This value, options, is provided to every bot action that needs it
 *                ie screenshot(), saveCookies() rely on BotOptions for determining URL 
 * @param options 
 */
export const getDefaultBotOptions = (options: Partial<BotOptions>): BotOptions => ({
  screenshots_directory: '',
  cookies_directory: '',
  ...options
})