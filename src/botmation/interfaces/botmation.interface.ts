import { Page } from 'puppeteer'
import { BotAction } from './bot-action.interfaces'
import { BotOptions } from './bot-options.interfaces'

/**
 * @description   Base public interface for a Botmation instance
 *                This is the expected public interface of methods
 *                  in case anyone wants to create a more specific Botmation "class" without using inheritance
 */
export interface BotmationInterface {
  // Main
  actions(...actions: BotAction<any|void>[]): Promise<void>
  // Page
  setPage(page: Page): void
  getPage(): Page
  // Options
  setOptions(options: Partial<BotOptions>): void
  updateOptions(options: Partial<BotOptions>): void
  // Injects are optional class code
  // closePage is optional TODO: add a closePage() bot action
}