import { Browser } from "puppeteer"
import { PipeValue } from "./pipe-value"

export type Injects = {}

export type InjectsValue = Injects & {value: PipeValue}
