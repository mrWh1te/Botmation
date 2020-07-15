import { Page } from 'puppeteer'

import { BotFileOptions } from '../../../interfaces/bot-file-options.interfaces'
import { ConditionalBotAction } from '../../../interfaces/bot-actions.interfaces'

import { BotActionsPipeFactory } from 'botmation/factories/bot-actions-pipe.factory'
import { getIndexedDBValue } from 'botmation/actions/indexed-db'
import { map } from 'botmation/actions/pipe'

/**
 * @description    async condition function that resolves TRUE/FALSE depending on user auth
 *                 Used in higher order Bot Action's like givenThat()() or doWhile()()
 * @param page 
 * @param options 
 */
export const isGuest: ConditionalBotAction = async(page: Page, options: BotFileOptions, ...injects: any[]): Promise<boolean> =>
  await BotActionsPipeFactory<boolean>(page, undefined, options, ...injects)(
    getIndexedDBValue('users.viewerId', 'paths', 'redux', 1),
    map(viewerId => viewerId ? false : true), // viewerId is a string representing auth user id, else undefined
  )

