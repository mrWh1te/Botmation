import {
  BotAction,
  click,
  clickText,
  isString,
  chain,
  pipe,
  pipeCase,
  type,
  waitForNavigation
} from "@botmation/core";

import { FORM_CREATEAPOST_CHOOSEACOMMUNITY_INPUT, FORM_CREATEAPOST_TEXT_TEXTAREA, FORM_CREATEAPOST_TITLE_INPUT } from "../constants/selectors";
import { goToCreateAPost } from "./navigation";

/**
 *
 * @param community ie `AskReddit`
 * @param title ie `Example Title`
 * @param text ie `Example Text
 *                  can by a multi-line Template literal`
 */
export const createATextPost = (community: string, title: string, text?: string): BotAction => chain(
  goToCreateAPost,
  click(FORM_CREATEAPOST_CHOOSEACOMMUNITY_INPUT),
  type(community),
  click('body'),
  click(FORM_CREATEAPOST_TITLE_INPUT),
  type(title),
  pipe(text)(
    pipeCase(isString)(
      click(FORM_CREATEAPOST_TEXT_TEXTAREA),
      type(text)
    ),
  ),
  clickText('Post'),
  waitForNavigation
)
