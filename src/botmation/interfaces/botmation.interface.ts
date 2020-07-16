import { Page } from 'puppeteer'
import { BotAction5 } from './bot-actions.interfaces'

/**
 * @description   Base public interface for a Botmation instance
 *                This is the expected public interface of methods
 *                  in case anyone wants to create a more specific Botmation "class" without using inheritance
 */
export interface BotmationInterface {
  // Main
  actions(...actions: BotAction5[]): Promise<void>
  // Page
  setPage(page: Page): void
  getPage(): Page
  // Injects
  setInjects(...injects: any[]): void
}