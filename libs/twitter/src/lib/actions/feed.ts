import {
  Action,
  chain,
  wait
} from '@botmation/v2core'

import {
  click,
  clickText,
  type,
  waitForNavigation
} from "@botmation/puppeteer";

import { FORM_TWEET_TEXTAREA } from "../constants/selectors";
import { goToTweet } from "./navigation";

export const tweet = (message: string): Action => chain(
  goToTweet,
  wait(1200),
  click(FORM_TWEET_TEXTAREA),
  type(message),
  clickText('Tweet'),
  waitForNavigation
)
