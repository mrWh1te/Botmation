import { BotFileOptions, BotAction } from "botmation/interfaces"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"
import { enrichBotFileOptionsWithDefaults } from "botmation/helpers/file-options"
import { injects } from "./injects"

/**
 * @description    Higher-order to inject "BotFileOptions"
 */
export const files = (fileOptions?: Partial<BotFileOptions>) =>
  (...actions: BotAction[]): BotAction =>
    injects(enrichBotFileOptionsWithDefaults(fileOptions))(...actions)