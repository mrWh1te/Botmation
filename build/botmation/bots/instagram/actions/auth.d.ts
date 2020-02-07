import { BotAction } from '../../../interfaces/bot-action.interfaces';
/**
 * @description  BotAction that attempts the login flow for Instagram
 *               This BotAction is a great example of how 1 Action can wrap a whole other list of Action's, while using the same actions() code design
 * @param {username, password} destructured from BotAuthOptions
 */
export declare const login: ({ username, password }: {
    username: string;
    password: string;
}) => BotAction;
