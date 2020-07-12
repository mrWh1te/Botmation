import { Page } from 'puppeteer'

import { BotOptions } from '../../../interfaces/bot-options.interfaces'
import { ConditionalBotAction } from '../../../interfaces/bot-actions.interfaces'

import { BotActionsPipeFactory } from 'botmation/factories/bot-actions-pipe.factory'
import { getIndexDBStoreDataKeyValue } from 'botmation/actions/indexed-db'
import { map } from 'botmation/actions/utilities'

/**
 * @description    async condition function that resolves TRUE/FALSE depending on user auth
 *                 Used in higher order Bot Action's like givenThat()() or doWhile()()
 * @param page 
 * @param options 
 */
export const isGuest: ConditionalBotAction = async(page: Page, options: BotOptions, ...injects: any[]): Promise<boolean> =>
  await BotActionsPipeFactory<boolean>(page, undefined, options, ...injects)(
    getIndexDBStoreDataKeyValue('redux', 1, 'paths', 'users.viewerId'),
    map(viewerId => viewerId ? false : true), // viewerId is a string representing auth user id, else undefined
  )

