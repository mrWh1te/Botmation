import { BotFileOptions, BotAction } from "../interfaces"
import { enrichBotFileOptionsWithDefaults } from "../helpers/files"
import { inject } from "./inject"

/**
 * @description    Higher-order BotAction to inject an enriched "BotFileOptions" from an optional provided Partial of one
 *                 Cookies & Output BotFilesAction's support files()() wrapping for injecting their enriched BotFileOptions
 *                 It's possible to use files()() to set botFileOptions for all those BotFilesAction's ran inside, AND each one of those Actions can
 *                    overwride the botFileOptions through their own function params
 */
export const files = (fileOptions?: Partial<BotFileOptions>) =>
  (...actions: BotAction[]): BotAction =>
    inject(
      enrichBotFileOptionsWithDefaults(fileOptions)
    )(...actions)