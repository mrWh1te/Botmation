import { ConditionalBotAction } from '../../../interfaces/bot-actions.interfaces'

import { getIndexedDBValue, indexedDBStore } from 'botmation/actions/indexed-db'
import { map } from 'botmation/actions/pipe'

/**
 * @description    async condition function that resolves TRUE/FALSE depending on user auth
 *                 Used in higher order Bot Action's like givenThat()() or doWhile()()
 * @param page 
 * @param options 
 */
export const isGuest: ConditionalBotAction = async(page, ...injects) =>
  await indexedDBStore('redux', 1, 'paths')(
    getIndexedDBValue('users.viewerId'),
    map(viewerId => viewerId ? false : true)
  )(page, ...injects)
