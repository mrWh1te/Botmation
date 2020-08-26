import { 
  ConditionalBotAction, 
  BotAction, 
  pipe, 
  $$, 
  forAll, 
  givenThat, 
} from '../../..'

/**
 * Returns an array of CheerioStatic HTML elements representing the Feed's posts
 */
export const getFeedPosts: BotAction<CheerioStatic[]> = 
  $$('.application-outlet .feed-outlet [role="main"] [data-id]')

/**
 * Returns TRUE if at least one person name closely matches the author name of the provided Post, otherwise FALSE
 * @future This function is coupled with the getFeedPosts. 
 *         It would be nice to rely on ie Post.id as param to then find that "Like" button in page to click. In order to, de-couple this function
 * @param post 
 * @param peopleNames 
 */
export const postIsAuthoredByAPerson = (post: CheerioStatic, ...peopleNames: string[]): ConditionalBotAction => 
  async() => {
    // if the CheerioStatic post has close matching in author text box a name from peopleNames list, then TRUE else FALSE
    return peopleNames.some(name => name.toLowerCase() === post('.feed-shared-actor__title').text().toLowerCase())
    // TODO add helpers for fuzzy text matching using nGrams(3) -> trigrams with like 80% threshold and higher-order params override (ie for 100%)
    //    that way, adding/removing nicknames, middle initials, etc will not break script
    // use https://www.npmjs.com/package/trigram-utils asDictionary(), build unique list of key's, and see how much overlaps
    // don't forget to buffer the strings with spaces (1 before and 1 after to increase matching potential slightly, since this is a few words instead of a sentence(s))
  }

/**
 * Clicks the "Like" button inside the provided Post 
 * @future This function is coupled with the getFeedPosts. 
 *         It would be nice to rely on ie Post.id as param to then find that "Like" button in page to click. In order to, de-couple this function
 * @param post 
 */
export const like = (post: CheerioStatic): BotAction =>
  async(page) => {
    // click the like button, located inside this `post` CheerioStatic
  }

/**
 * Clicks the "Like" button for every Post in your feed
 * @param peopleNames 
 */
export const likeAllFrom = (...peopleNames: string[]): BotAction => 
  pipe()(
    getFeedPosts,
    forAll()(
      post => ([
        givenThat(postIsAuthoredByAPerson(post, ...peopleNames))(
          // scroll to post necessary to click off page link? ie click anchor link (new scrollTo() "navigation" BotAction?)
          // the feature, auto-scroll, was added to `page.click()` but in a later Puppeteer version, irc
          like(post)
        )
      ])
    )
  )