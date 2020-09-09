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
import { pipeCases, pipeCase } from '../../../actions/pipe'
import { abort } from '../../../actions/abort'

import { goToFeed } from './navigation'
import { feedPostsSelector, feedPostAuthorSelector } from '../selectors'
import { log } from 'botmation/actions/console'
import { ConditionalCallback } from 'botmation/types/callbacks'


/**
 * Returns an array of CheerioStatic HTML elements representing the Feed's posts
 */
export const getFeedPosts: BotAction<Cheerio[]> =
  pipe()(
    goToFeed,
    $$(feedPostsSelector),
    map((posts: CheerioStatic[]) => posts.map(post => post('[data-id]'))) // select 1st element with data-id attribute
  )  

/**
 * Clicks the "Like" button inside the provided Post, if the Like button hasn't been pressed
 *   if LinkedIn Feed Post Like button is not pressed, its aria-label has Poster's name included in text
 *   if LinkedIn Feed Post Like button is pressed, its aria-label has only "Like" as its value, no Poster name
 * @future This function is coupled with the getFeedPosts. 
 *         It would be nice to rely on ie Post.id as param to then find that "Like" button in page to click. In order to, de-couple this function
 * @param post 
 */
export const like = (post: Cheerio): BotAction =>
  // Puppeteer.page.click() returned promise will reject if the selector isn't found
  //    so if button is Pressed, it will reject since the aria-label value will not match
  errors('LinkedIn like() - Could not Like Post: Either already Liked or button not found')(
    click( 'div[data-id="' + post.attr('data-id') + '"] button[aria-label="Like ' + post.next(feedPostAuthorSelector).text() + '’s post"]')
  )

  // be cool if errors had the ability to be provided a BotAction to run in a simulated pipe and returned on error
  //    so here, we can return ie a value signaling we did not like it because it was already liked
  

/**
 * User articles are posts created by users you're either connected too directly (1st) or are following
 * @param peopleNames 
 */
const postIsUserArticle: ConditionalCallback<Cheerio> = (post: Cheerio) => {
  const sharedActorFeedSupplementaryInfo = post.next('.feed-shared-actor .feed-shared-actor__supplementary-actor-info').text()

  return sharedActorFeedSupplementaryInfo.includes('1st') || sharedActorFeedSupplementaryInfo.includes('Following')
}

/**
 * Returns TRUE if at least one person name closely matches the author name of the provided Post, otherwise FALSE
 * @future This function is coupled with the getFeedPosts. 
 *         It would be nice to rely on ie Post.id as param to then find that "Like" button in page to click. In order to, de-couple this function
 * @param post 
 * @param peopleNames 
 */
const postIsAuthoredByAPerson = (...peopleNames: string[]): ConditionalCallback<Cheerio> => (post: Cheerio): boolean =>
  peopleNames.some(name => name.toLowerCase() === post.next(feedPostAuthorSelector).text().toLowerCase())

/**
 * Is the post a Promoted piece of Content aka an ad?
 * @param post 
 */
const postIsPromotion: ConditionalCallback<Cheerio> = (post: Cheerio) => 
  post.next('.feed-shared-actor__sub-description').text().toLowerCase() === 'promoted'

/**
 * 
 * @param post 
 */
const postIsJobPostings: ConditionalCallback<Cheerio> = (post: Cheerio) => {
  const dataId = post.attr('data-id') // check initial div attribute data-id
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
const postIsUserInteraction: ConditionalCallback<Cheerio> = (post: Cheerio) => {
  // post belongs to a followed user of the bot's account where they liked another post
  const feedPostSiblingText = post.next('h2.visually-hidden:contains("Feed post") + div').text()

  // look for h2 that :contains('Feed post') // has css class visually-hidden
    // it's sibling div should contain "likes this" in a span
  return feedPostSiblingText.includes('like this') || 
         feedPostSiblingText.includes('loves this') ||
         feedPostSiblingText.includes('celebrates this')
}

/**
 * @description   Demonstration of what's currently possible, this function goes beyond the scope of its name, but to give an idea on how something more complex could be handled
 * @param peopleNames 
 */
export const likeArticlesFrom = (...peopleNames: string[]): BotAction => 
  pipe()(
    getFeedPosts,
    forAll()(
      post => switchPipe(post)(
        pipeCase(postIsPromotion)(
          map((promotionPost: Cheerio) => promotionPost.attr('data-id')),
          log('Promoted Content')
        ),
        abort(),
        pipeCase(postIsJobPostings)(
          map((jobPostingsPost: Cheerio) => jobPostingsPost.attr('data-id')),
          log('Job Postings')
        ),
        abort(),
        pipeCase(postIsUserInteraction)(
          map((userInteractionPost: Cheerio) => userInteractionPost.attr('data-id')),
          log(`A followed User's Like`)
        ),
        abort(),
        pipeCases(postIsUserArticle, postIsAuthoredByAPerson(...peopleNames))(
          // scroll to post necessary to click off page link? ie click anchor link (new scrollTo() "navigation" BotAction?)
          // the feature, auto-scroll, was added to `page.click()` but in a later Puppeteer version, irc
          map((userArticlePost: Cheerio) => userArticlePost.attr('data-id')),
          log('post article found -> pseudo like()')
          // like(post)
        ),
        abort(),
        // pipeCases(postIsUserComment, commentIsAuthoredByAPerson(...peopleNames))(
        //   likeComment(post)
        // ),
        // abort()

        // default case to run if we got here by not aborting
        pipe()(
          map((unknownPost: Cheerio) => unknownPost.attr('data-id')),
          log('unmatched case')
        )
      )
    )
  )