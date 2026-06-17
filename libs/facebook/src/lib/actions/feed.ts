import {
  Action,
  chain,
  wait,
} from "@botmation/v2core";

import {
  click,
  clickText,
  InjectBrowserPage,
  type,
  waitForNavigation
} from '@botmation/puppeteer'

import { FEED_WHATS_ON_YOUR_MIND_INPUT } from "../constants/selectors";
import { goToHome } from "./navigation";

export const createAPost = (post: string) => chain<InjectBrowserPage>(
  goToHome,
  click(FEED_WHATS_ON_YOUR_MIND_INPUT),
  wait(2000),
  type(post),
  clickText('Post'),
  waitForNavigation
)
