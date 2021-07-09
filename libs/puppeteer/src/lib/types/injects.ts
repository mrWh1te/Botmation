import { Browser } from "puppeteer"

import { injects } from "@botmation/v2core"

export type injectsBrowser = injects & {browser: Browser}
