import {
  BotAction,
  chain,
  click,
  clickText,
  type,
  wait,
  waitForNavigation
} from "@botmation/core";

import { FEED_WHATS_ON_YOUR_MIND_INPUT } from "../constants/selectors";
import { goToHome } from "./navigation";

export const createAPost = (post: string): BotAction => chain(
  goToHome,
  click(FEED_WHATS_ON_YOUR_MIND_INPUT),
  wait(2000),
  type(post),
  clickText('Post'),
  waitForNavigation
)
