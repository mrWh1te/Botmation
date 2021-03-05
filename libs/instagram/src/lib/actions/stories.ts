/**
 * BotActions related to the main feed Stories feature
 */

import { BotAction, click, forAsLong, wait, elementExists, givenThat, log } from "@botmation/core";
import { FIRST_STORY, STORIES_VIEWER_NEXT_STORY_ICON } from "../selectors";

/**
 *
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

