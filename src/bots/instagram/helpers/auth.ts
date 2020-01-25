import puppeteer from 'puppeteer'

import { goTo } from '@mationbot/actions/navigation'
import { getInstagramLoginUrl } from '@bots/instagram/helpers/urls'

//
// Helpers

// Future: Go into the data, directly, and grab from the database, IndexedDB (redux). There is no data if guest
export const isLoggedIn = async(tab: puppeteer.Page): Promise<boolean> => {
  // Go to the login page
  await goTo(getInstagramLoginUrl())(tab)
  
  // if you're logged in, Instagram would have redirected you to the feed
  // if you were a guest, logged out, you would be on the Instagram Login URL
  return tab.url() !== getInstagramLoginUrl()
}

export const isGuest = async(tab: puppeteer.Page): Promise<boolean> =>
  !(await isLoggedIn(tab))
