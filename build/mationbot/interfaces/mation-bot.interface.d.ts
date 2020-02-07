import { BotAction } from './bot-action.interfaces';
/**
 * Base public interface for a MationBot instance
 */
export interface MationBotInterface {
    actions(...actions: BotAction[]): Promise<void>;
    closePage(): Promise<void>;
}
