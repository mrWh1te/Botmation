import { Browser, Page } from "puppeteer"

import { Injects } from "@botmation/v2core"
import { FileOptions } from "../interfaces/file-options"

export type injectsBrowser = Injects & {browser: Browser}
export type injectsPage = Injects & {page: Page}

export type injectsHtmlParser = Injects & {htmlParser: Function}

export type injectsFileOptions = Injects & {fileOptions: FileOptions}
