import {
  BotAction,
  chain,
  click,
  clickText,
  isString,
  pipe,
  pipeCase,
  type,
  waitForNavigation
} from "@botmation/core";

import { goToCreateAPost } from "./navigation";

export const createATextPost = (community: string, title: string, text?: string): BotAction => chain(
  goToCreateAPost,
  click('input[placeholder="Choose a community"]'),
  type(community),
  click('body'),
  click('textarea[placeholder="Title"]'),
  type(title),
  pipe(text)(
    pipeCase(isString)(
      click('.DraftEditor-root'),
      type(text)
    )
  ),
  clickText('Post'),
  waitForNavigation
)
