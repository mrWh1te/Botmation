import {
  Action,
  pipe,
  forAll,
  errors,
  map
} from '@botmation/v2core'
import { switchPipe } from '@botmation/v2core'
import { pipeCase, emptyPipe } from '@botmation/v2core'
import { abort } from '@botmation/v2core'

import { log } from '@botmation/v2core'

import { casesSignalToPipeValue } from '@botmation/core' // todo add to v2core

import {
  $$,
  $,
  scrollTo,
  click,
  InjectBrowserPage
} from '@botmation/puppeteer'

import { feedPostsSelector, feedPostAuthorSelector } from '../selectors'
import {
  postHasntFullyLoadedYet,
  postIsPromotion,
  postIsJobPostings,
  postIsUserInteraction,
  postIsUserPost,
  postIsAuthoredByAPerson
} from '../helpers/feed'


/**
 * Returns an array of CheerioStatic HTML elements representing the Feed's posts
 */
export const scrapeFeedPosts: Action<InjectBrowserPage, CheerioStatic[]> =
  $$(feedPostsSelector)

/**
 *
 * @param postDataId
 */
export const scrapeFeedPost = (postDataId: string): Action<InjectBrowserPage, CheerioStatic> =>
  $('.application-outlet .feed-outlet [role="main"] [data-id="'+ postDataId + '"]')

/**
 * If the post hasn't been populated (waits loading), then scroll to it to cause lazy loading then scrape it to return the hydrated version of it
 * @param post
 */
export const ifPostNotLoadedCauseLoadingThenScrape = (post: CheerioStatic): Action =>
  // linkedin lazily loads off screen posts, so check beforehand, and if not loaded, scroll to it, then scrape it again
  pipe<InjectBrowserPage, CheerioStatic>(post)(
    errors('LinkedIn causeLazyLoadingThenScrapePost()')(
      pipeCase(postHasntFullyLoadedYet)(
        scrollTo('.application-outlet .feed-outlet [role="main"] [data-id="'+ post('[data-id]').attr('data-id') + '"]'),
        scrapeFeedPost(post('[data-id]').attr('data-id') + '')
      ),
      map(casesSignalToPipeValue) // if pipeCase doesn't run, it returns CasesSignal with original pipeValue otherwise it returns CasesSignal with new pipeValue from resolved inner pipe
    )
  )

/**
 * Clicks the "Like" button inside the provided Post, if the Like button hasn't been pressed
 *   if LinkedIn Feed Post Like button is not pressed, its aria-label has Poster's name included in text
 *   if LinkedIn Feed Post Like button is pressed, its aria-label has only "Like" as its value, no Poster name
 * @future This function is coupled with the getFeedPosts.
 *         It would be nice to rely on ie Post.id as param to then find that "Like" button in page to click. In order to, de-couple this function
 * @param post
 */
export const likeUserPost = (post: CheerioStatic): Action<InjectBrowserPage> =>
  // Puppeteer.page.click() returned promise will reject if the selector isn't found
  //    so if button is Pressed, it will reject since the aria-label value will not match
  errors('LinkedIn like() - Could not Like Post: Either already Liked or button not found')(
    click( 'div[data-id="' + post('div[data-id]').attr('data-id') + '"] button[aria-label="Like ' + post(feedPostAuthorSelector).text() + '’s post"]')
  )

  // be cool if errors had the ability to be provided a Action to run in a simulated pipe and returned on error
  //    so here, we can return ie a value signaling we did not like it because it was already liked

/**
 * @description   Demonstration of what's currently possible, this function goes beyond the scope of its name, but to give an idea on how something more complex could be handled
 * @param peopleNames
 */
export const likeUserPostsFrom = (...peopleNames: string[]): Action =>
  pipe<InjectBrowserPage>()(
    scrapeFeedPosts,
    forAll()(
      post => pipe(post)(
        ifPostNotLoadedCauseLoadingThenScrape(post),
        switchPipe()(
          pipeCase(postIsPromotion)(
            map((promotionPost: CheerioStatic) => promotionPost('[data-id]').attr('data-id')),
            log('Promoted Content')
          ),
          abort(),
          pipeCase(postIsJobPostings)(
            map((jobPostingsPost: CheerioStatic) => jobPostingsPost('[data-id]').attr('data-id')),
            log('Job Postings')
          ),
          abort(),
          pipeCase(postIsUserInteraction)(
            map((userInteractionPost: CheerioStatic) => userInteractionPost('[data-id]').attr('data-id')),
            log(`Followed User's Interaction (ie like, comment, etc)`)
          ),
          abort(),
          pipeCase(postIsUserPost)(
            pipeCase(postIsAuthoredByAPerson(...peopleNames))(
              // scroll to post necessary to click off page link? ie use scrollTo() "navigation" Action
              // the feature, auto-scroll, was added to `page.click()` in later Puppeteer version, irc
              likeUserPost(post),
              log('User Article "liked"')
            ),
            emptyPipe,
            log('User Article')
          ),
          abort(),
          // default case to run if we got here by not aborting
          pipe()(
            map((unhandledPost: CheerioStatic) => unhandledPost('[data-id]').text()),
            log('Unhandled Post Case')
          )
        )
      )
    )
  )
