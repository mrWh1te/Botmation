import { Browser } from "puppeteer"

export type injects = {}
export type injectsBrowser = injects & {browser: Browser}
