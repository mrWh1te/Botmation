import { 
  ConditionalBotAction, 
  BotAction, 
  pipe, 
  $$, 
  forAll, 
  givenThat, 
} from '../../..'

/**
 * Returns a NodeListOf Element like an array of HTML elements representing the Feed's posts
 */
export const getFeedPosts: BotAction<Element[]> = 
  $$('.application-outlet .feed-outlet [role="main"] [data-id]')

/**
 * Returns TRUE if at least one person name closely matches the author name of the provided Post, otherwise FALSE
 * @param post 
 * @param peopleNames 
 */
export const postIsAuthoredByAPerson = (post: Element, ...peopleNames: string[]): ConditionalBotAction => 
  async(page) => {
    // if the element post has close matching in author text box a name from peopleNames list, then TRUE else FALSE
    return true
  }

/**
 * Clicks the "Like" button inside the provided Post 
 * @param post 
 */
export const like = (post: Element): BotAction =>
  async(page) => {
    // click the like button, located inside this `post` Element
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