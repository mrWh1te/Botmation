import { Page } from 'puppeteer'
import { BotAction } from './bot-actions'

/**
 * @description   Base public interface for a Botmation instance
 */
export interface BotmationInterface {
  // Main
  actions(...actions: BotAction<any>[]): Promise<void>
  // Page
  setPage(page: Page): void
  getPage(): Page
  // Injects
  setInjects(...injects: any[]): void
}