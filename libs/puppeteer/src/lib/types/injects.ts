import { Browser, Page } from "puppeteer"

import { injects } from "@botmation/v2core"

export type injectsBrowser = injects & {browser: Browser}
export type injectsPage = injects & {page: Page}

export type injectsHtmlParser = injects & {htmlParser: Function}
