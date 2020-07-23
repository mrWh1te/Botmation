import { BotFileOptions, BotAction } from "botmation/interfaces"
import { enrichBotFileOptionsWithDefaults } from "botmation/helpers/files"
import { injects } from "./injects"

/**
 * @description    Higher-order BotAction to inject an enriched "BotFileOptions" from an optional provided Partial of one
 *                 Cookies & Output BotFilesAction's support files()() wrapping for injecting their enriched BotFileOptions
 *                 It's possible to use files()() to set botFileOptions for all those BotFilesAction's ran inside, AND each one of those Actions can
 *                    overwride the botFileOptions through their own function params
 */
export const files = (fileOptions?: Partial<BotFileOptions>) =>
  (...actions: BotAction[]): BotAction =>
    injects(
      enrichBotFileOptionsWithDefaults(fileOptions)
    )(...actions)