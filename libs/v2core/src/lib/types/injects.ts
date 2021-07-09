import { Browser } from "puppeteer"
import { PipeValue } from "./pipe-value"

export type injects = {}

export type injectsValue = injects & {value: PipeValue}
