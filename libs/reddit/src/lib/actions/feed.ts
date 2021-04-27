import {
  BotAction,
  chain,
  click,
  clickText,
  type,
  wait,
  waitForNavigation
} from "@botmation/core";

import { goToCreateAPost } from "./navigation";

// todo complete
export const createAPost = (community: string, title: string, text?: string): BotAction => chain(
  goToCreateAPost,
  wait(2000),
  type(text),
  clickText('Post'),
  waitForNavigation
)
