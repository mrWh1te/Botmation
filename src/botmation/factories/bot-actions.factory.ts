import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { BotOptions } from '../interfaces/bot-options.interfaces'
import { getDefaultBotOptions } from '../helpers/bot-options'

/**
 * @description   Pipeable Botactions, where the existance of a resolved value is passed in to the next BotAction as an inject, the first in the `injects` queue of the called nextAction()
 * 
 * @param page    Puppeteer.Page
 */
export const BotActionsFactory = 
  (page: Page, overloadOptions: Partial<BotOptions> = {}, ...injects: any[]) => 
    async (...actions: BotAction<any, any>[]): Promise<any|void> => {
      let previousActionResolvedValue // valued to be piped

      for(const action of actions) {
        // let nextActionInjects

        // if (previousActionResolvedValue) {
        //   nextActionInjects = [previousActionResolvedValue, ...injects]
        // } else {
        //   nextActionInjects = [...injects]
        // }

        previousActionResolvedValue = await action(page, previousActionResolvedValue, getDefaultBotOptions(overloadOptions), ...injects)
      }

      if (previousActionResolvedValue) {
          return previousActionResolvedValue
      }
    }