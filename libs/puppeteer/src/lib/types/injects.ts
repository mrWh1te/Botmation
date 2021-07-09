import { Browser, Page } from "puppeteer"

import { injects } from "@botmation/v2core"
import { FileOptions } from "../interfaces/file-options"

export type injectsBrowser = injects & {browser: Browser}
export type injectsPage = injects & {page: Page}

export type injectsHtmlParser = injects & {htmlParser: Function}

export type injectsFileOptions = injects & {fileOptions: FileOptions}
