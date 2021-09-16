import { Browser, Page } from "puppeteer"

import { FileOptions } from "../interfaces/file-options"

export type InjectBrowser = {browser: Browser}
export type InjectBrowserPage = {page: Page}

export type InjectHtmlParser = {htmlParser: Function}

export type InjectFileOptions = {fileOptions: FileOptions}
