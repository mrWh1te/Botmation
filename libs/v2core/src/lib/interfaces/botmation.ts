import { Page } from 'puppeteer'
import { Action } from './actions'

/**
 * @description   Base public interface for a Botmation instance
 */
export interface BotmationInterface {
  // Main
  actions(...actions: Action<any>[]): Promise<void>
  // Page
  setPage(page: Page): void
  getPage(): Page
  // Injects
  setInjects(...injects: any[]): void
}
