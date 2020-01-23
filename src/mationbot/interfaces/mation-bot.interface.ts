import puppeteer from 'puppeteer'

import { BotOptions } from './bot-options.interfaces'

/**
 * Base public interface for a MationBot instance
 */
export interface MationBotInterface {
  setup(browser: puppeteer.Browser, options: BotOptions): Promise<void>
  destroy(): Promise<void>
}