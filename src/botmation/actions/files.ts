import { BotFileOptions, BotAction, BotFilesAction } from "botmation/interfaces"
import { enrichBotFileOptionsWithDefaults } from "botmation/helpers/file-options"
import { injects } from "./injects"

/**
 * @description    Higher-order to inject an enriched "BotFileOptions" from a Partial
 *                 Cookies & Output BotFilesAction's support files()() wrapping for injecting their enriched BotFileOptions
 */
export const files = (fileOptions?: Partial<BotFileOptions>) =>
  (...actions: BotAction[]): BotAction =>
    injects(
      enrichBotFileOptionsWithDefaults(fileOptions)
    )(...actions)