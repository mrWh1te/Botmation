import { BotFileOptions, BotAction } from "botmation/interfaces"
import { BotActionsPipe } from "botmation/factories/bot-actions-pipe"
import { getDefaultBotFileOptions } from "botmation/helpers/file-options"

/**
 * @description    Higher-order to inject "BotOptions" being updated into an Options/Config object for local file management
 */
export const files = (fileOptions?: Partial<BotFileOptions>) =>
  (...actions: BotAction[]): BotAction =>
    async(page, ...injects: any[]) =>
      await BotActionsPipe<any>(page, getDefaultBotFileOptions(fileOptions), ...injects)(...actions)