import { ConditionalCallback } from '@botmation/core'
import * as cheerio from 'cheerio' // necessary for `CheerioStatic` in build
import { feedPostAuthorSelector } from '../selectors'

/**
 * User articles are posts created by users you're either connected too directly (1st) or are following
 * @param peopleNames
 */
export const postIsUserPost: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) => {
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
export const postIsAuthoredByAPerson = (...peopleNames: string[]): ConditionalCallback<CheerioStatic> => (post: CheerioStatic) =>
  peopleNames.some(name => name.toLowerCase() === post(feedPostAuthorSelector).text().toLowerCase())

/**
 * Is the post a Promoted piece of Content aka an ad?
 * @param post
 */
export const postIsPromotion: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) =>
  post('.feed-shared-actor__sub-description').text().trim().toLowerCase().includes('promoted')


/**
 *
 * @param post
 */
export const postIsJobPostings: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) => {
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
export const postIsUserInteraction: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) => {
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
export const postHasntFullyLoadedYet: ConditionalCallback<CheerioStatic> = (post: CheerioStatic) => {
  // linkedin cleverly loads its posts lazily, with DOM rendering in mind, which maintains a smoother scrolling UX
  // Example (some spacing trimmed):
  // <div data-id="urn:li:activity:6707355099489980416" id="ember361" class="relative ember-view">
  //   <div id="ember363" class="occludable-update occludable-update-hint ember-view"><!----></div>
  //   <!---->
  //   <!---->
  // </div>
  return post('[data-id]').text().trim() === ''
}
