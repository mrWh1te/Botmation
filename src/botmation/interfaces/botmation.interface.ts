import { BotAction } from './bot-action.interfaces'

/**
 * @description   Base public interface for a Botmation instance
 */
export interface BotmationInterface {
  actions(...actions: BotAction[]): Promise<void>
  closePage(): Promise<void>
}