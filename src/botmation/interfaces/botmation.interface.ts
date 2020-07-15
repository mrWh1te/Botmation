import { Page } from 'puppeteer'
import { BotAction } from './bot-actions.interfaces'
import { BotFileOptions } from './bot-file-options.interfaces'

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
  setOptions(options: Partial<BotFileOptions>): void
  updateOptions(options: Partial<BotFileOptions>): void
  // Injects are optional class code
  // closePage is optional TODO: add a closePage() bot action
}