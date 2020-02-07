import { Page } from 'puppeteer';
import { BotOptions } from 'botmation/interfaces/bot-options.interfaces';
export declare const isLoggedIn: (page: Page, options: BotOptions) => Promise<boolean>;
export declare const isGuest: (page: Page, options: BotOptions) => Promise<boolean>;
