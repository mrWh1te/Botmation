import { Page } from 'puppeteer';
/**
 * @description   Returns a promise that resolves TRUE, if the "Turn on Notifications" modal is in view
 * @param page
 */
export declare const isTurnOnNotificationsModalActive: (page: Page) => Promise<boolean>;
