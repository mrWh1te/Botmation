import { schedule, wait } from '@botmation/v2core'

import {
  browserPage,
  browser,
  closeBrowser
} from '@botmation/puppeteer'

import {
  goToArtist,
  clickFirstSongPlayButton
} from '@botmation/soundcloud'

// Music will play for X minutes:
const playMusicForTimeSpanInMinutes = 30;

(async () => {
  try {
    // Inject Puppeteer browser instance
    const bot = schedule('30 6 * * 1-5')( // Monday-Friday at 6:30am
      browser({headless: false})(
        // Inject Puppeteer browser page instance
        browserPage()(
          goToArtist('idealismus'),
          clickFirstSongPlayButton,
          wait(playMusicForTimeSpanInMinutes * 60 * 1000),
        ),
        closeBrowser
      ),
    )

    await bot()

  } catch (error) {
    console.error(error)
  }

})()
