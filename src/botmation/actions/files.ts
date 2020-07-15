import { BotFileOptions, BotAction5 } from "botmation/interfaces"
import { BotActionsPipeFactory5 } from "botmation/factories/bot-actions-pipe.factory"
import { getDefaultBotFileOptions } from "botmation/helpers/file-options"

/**
 * @description    Higher-order to inject "BotOptions" being updated into an Options/Config object for local file management
 */
export const files = (fileOptions?: Partial<BotFileOptions>) =>
  (...actions: BotAction5<any>[]): BotAction5<any> =>
    async(page, ...injects: any[]) =>
      await BotActionsPipeFactory5<any>(page, getDefaultBotFileOptions(fileOptions), ...injects)(...actions)