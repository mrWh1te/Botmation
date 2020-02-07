import { Page } from 'puppeteer'

import { goTo } from 'botmation/actions/navigation'
import { getInstagramLoginUrl } from 'botmation/bots/instagram/helpers/urls'

//
// Helpers

// Future: Go into the data, directly, and grab from the database, IndexedDB (redux). There is no data if guest
export const isLoggedIn = async(page: Page): Promise<boolean> => {
  // Go to the login page
  await goTo(getInstagramLoginUrl())(page)
  
  // if you're logged in, Instagram would have redirected you to the feed
  // if you were a guest, logged out, you would be on the Instagram Login URL
  return page.url() !== getInstagramLoginUrl()
}

export const isGuest = async(page: Page): Promise<boolean> =>
  !(await isLoggedIn(page))
