import { BotOptions } from "../interfaces/bot-options.interfaces"

/**
 * @description    
 * @param options 
 * @future  TODO: Support the Puppeteer Page options
 */
export const getDefaultBotOptions = (options: Partial<BotOptions>): BotOptions => ({
  screenshots_directory: '',
  cookies_directory: '',
  ...options
})