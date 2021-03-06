import {
  BotAction,
  chain,
  click,
  clickText,
  type,
  wait,
  waitForNavigation
} from "@botmation/core";

import { FORM_TWEET_TEXTAREA } from "../constants/selectors";
import { goToTweet } from "./navigation";

export const tweet = (message: string): BotAction => chain(
  goToTweet,
  wait(1200),
  click(FORM_TWEET_TEXTAREA),
  type(message),
  clickText('Tweet'),
  waitForNavigation
)
