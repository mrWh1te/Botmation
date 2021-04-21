import { BotAction, chain, click, clickText, log, type, wait, waitForNavigation } from "@botmation/core";
import { goToTweet } from "./navigation";

export const tweet = (message: string): BotAction => chain(
  goToTweet,
  log('tweet page'),
  wait(1200),
  click('.DraftEditor-root'),
  log('clicked form input'),
  type(message),
  log('message typed'),
  clickText('Tweet'),
  waitForNavigation
)
