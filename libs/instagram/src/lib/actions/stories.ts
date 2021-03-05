/**
 * BotActions related to the main feed Stories feature
 */

import { BotAction, click, forAsLong, wait, elementExists, givenThat } from "@botmation/core";
import { FIRST_STORY, STORIES_VIEWER_NEXT_STORY_ICON } from "../selectors";

/**
 * When on the Home page, run this BotAction to cause the bot to open the Stories Theater Mode with the 1st Story then view them all until there are no more left
 * @param page
 * @param injects
 */
export const viewStories: BotAction =
  givenThat(elementExists(FIRST_STORY + ' button'))(
    click(FIRST_STORY + ' button'),
    wait(1000),
    forAsLong(elementExists(STORIES_VIEWER_NEXT_STORY_ICON))(
      click(STORIES_VIEWER_NEXT_STORY_ICON),
      wait(500)
    )
  )

