/**
 * Actions related to the main feed Stories feature
 */

import { Action, forAsLong, wait, givenThat } from "@botmation/v2core";
import { click, elementExists, InjectBrowserPage } from "@botmation/puppeteer"

import { FIRST_STORY, STORIES_VIEWER_NEXT_STORY_ICON } from "../constants/selectors";

/**
 * When on the Home page, run this Action to cause the bot to open the Stories Theater Mode with the 1st Story then view them all until there are no more left
 * @param page
 * @param injects
 */
export const viewStories: Action<InjectBrowserPage> =
  givenThat(elementExists(FIRST_STORY + ' button'))(
    click(FIRST_STORY + ' button'),
    wait(1000),
    forAsLong(elementExists(STORIES_VIEWER_NEXT_STORY_ICON))(
      click(STORIES_VIEWER_NEXT_STORY_ICON),
      wait(500)
    )
  )

