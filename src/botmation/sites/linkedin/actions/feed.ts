import { 
  BotAction, 
  pipe, 
  $$, 
  forAll, 
  click,
  errors,
  map
} from '../../..'
import { switchPipe } from '../../../actions/assembly-lines'
import { pipeCase, emptyPipe } from '../../../actions/pipe'
import { abort } from '../../../actions/abort'

import { feedPostsSelector, feedPostAuthorSelector } from '../selectors'
import { log } from '../../../actions/console'
import { ConditionalCallback } from '../../../types/callbacks'
import { casesSignalToPipeValue } from '../../../helpers/cases'
import { scrollTo } from '../../../actions/navigation'
import { $ } from '../../../actions/scrapers'


/**
 * Returns an array of CheerioStatic HTML elements representing the Feed's posts
 */
export const scrapeFeedPosts: BotAction<CheerioStatic[]> = $$(feedPostsSelector)

/**
 * 
 * @param postDataId 
 */
export const scrapeFeedPost = (postDataId: string): BotAction<CheerioStatic> =>
  $('.application-outlet .feed-outlet [role="main"] [data-id="'+ postDataId + '"]')

/**
 * If the post hasn't been populated (waits loading), then scroll to it to trigger lazy loading then scrape it to return the hydrated version of it
 * @param post 
 */
export const ifPostNotLoadedTriggerLoadingThenScrape = (post: CheerioStatic): BotAction<CheerioStatic> =>
  // linkedin lazily loads off screen posts, so check beforehand, and if not loaded, scroll to it, then scrape it again
  pipe(post)(
    errors('LinkedIn triggerLazyLoadingThenScrapePost()')(
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
export const likeArticle = (post: CheerioStatic): BotAction =>
  // Puppeteer.page.click() returned promise will reject if the selector isn't found
  //    so if button is Pressed, it will reject since the aria-label value will not match
  errors('LinkedIn like() - Could not Like Post: Either already Liked or button not found')(
    click( 'div[data-id="' + post('div[data-id]').attr('data-id') + '"] button[aria-label="Like ' + post(feedPostAuthorSelector).text() + '’s post"]')
  )

  // be cool if errors had the ability to be provided a BotAction to run in a simulated pipe and returned on error
  //    so here, we can return ie a value signaling we did not like it because it was already liked
  

/**
 * User articles are posts created by users you're either connected too directly (1st) or are following
 * @param peopleNames 
 */
const postIsUserArticle: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) => {
  const sharedActorFeedSupplementaryInfo = post('.feed-shared-actor__supplementary-actor-info').text().trim().toLowerCase()

  return sharedActorFeedSupplementaryInfo.includes('1st') || sharedActorFeedSupplementaryInfo.includes('following')
}

/**
 * Returns TRUE if at least one person name closely matches the author name of the provided Post, otherwise FALSE
 * @future This function is coupled with the getFeedPosts. 
 *         It would be nice to rely on ie Post.id as param to then find that "Like" button in page to click. In order to, de-couple this function
 * @param post 
 * @param peopleNames 
 */
const postIsAuthoredByAPerson = (...peopleNames: string[]): ConditionalCallback<CheerioStatic> => (post: CheerioStatic): boolean =>
  peopleNames.some(name => name.toLowerCase() === post(feedPostAuthorSelector).text().toLowerCase())

/**
 * Is the post a Promoted piece of Content aka an ad?
 * @param post 
 */
const postIsPromotion: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) =>
  post('.feed-shared-actor__sub-description').text().trim().toLowerCase().includes('promoted')


/**
 * 
 * @param post 
 */
const postIsJobPostings: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) => {
  const dataId = post('[data-id]').attr('data-id') // check initial div attribute data-id
  // is it possible to select first element with a child/descendant selector? cheerio supported selectors https://github.com/fb55/css-select#supported-selectors

  if(!dataId) return false

  // example of what we're looking for:
  // urn:li:aggregate:(urn:li:jobPosting:1990182920,urn:li:jobPosting:2001275620,urn:li:jobPosting:2156262070,urn:li:jobPosting:1989903273,urn:li:jobPosting:1974185047)
  const dataIdParts = dataId.split(':')

  // dataIdParts.toString() ie = "urn,li,aggregate,(urn,li,jobPosting,1990182920,urn,li,jobPosting,2001275620,urn,li,jobPosting,2156262070,urn,li,jobPosting,1989903273,urn,li,jobPosting,1974185047)"
  return dataIdParts.length >= 5 && // 4 is an empty aggregate
         dataIdParts[2] === 'aggregate' && // looking for an aggregate of job posts
         dataIdParts.slice(3).some(part => part === 'jobPosting') // again, looking for job postings - (this time in the aggregate "spread params" that basically look like jobPostingId's)
  
}

/**
 * 
 * The post represents a "like" of a User the bot's account follows
 * @param post 
 */
const postIsUserInteraction: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) => {
  // post belongs to a followed user of the bot's account where they liked another post
  const feedPostSiblingText = post('h2.visually-hidden:contains("Feed post") + div span').text().trim().toLowerCase()

  // console.log('feedPostSiblingText = ' + feedPostSiblingText)

  // look for h2 that :contains('Feed post') // has css class visually-hidden
    // it's sibling div should contain "likes this" in a span
  return feedPostSiblingText.includes('likes this') || 
         feedPostSiblingText.includes('loves this') ||
         feedPostSiblingText.includes('celebrates this') ||
         feedPostSiblingText.includes('commented on this')
}

/**
 * 
 * @param post 
 */
const postHasntFullyLoadedYet: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) => {
  // linkedin cleverly loads its posts lazily, with DOM rendering in mind, which maintains a smoother scrolling UX
  // Example (some spacing trimmed):
  // <div data-id="urn:li:activity:6707355099489980416" id="ember361" class="relative ember-view">
  //   <div id="ember363" class="occludable-update occludable-update-hint ember-view"><!----></div>
  //   <!---->
  //   <!---->
  // </div>
  return post('[data-id]').text().trim() === ''
}

/**
 * @description   Demonstration of what's currently possible, this function goes beyond the scope of its name, but to give an idea on how something more complex could be handled
 * @param peopleNames 
 */
export const likeArticlesFrom = (...peopleNames: string[]): BotAction => 
  pipe()(
    scrapeFeedPosts,
    forAll()(
      post => pipe(post)(
        ifPostNotLoadedTriggerLoadingThenScrape(post),
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
          pipeCase(postIsUserArticle)(
            pipeCase(postIsAuthoredByAPerson(...peopleNames))(
              // scroll to post necessary to click off page link? ie use scrollTo() "navigation" BotAction
              // the feature, auto-scroll, was added to `page.click()` in later Puppeteer version, irc
              likeArticle(post),
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