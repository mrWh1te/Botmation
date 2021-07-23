import { schedule, wait } from '@botmation/v2core'

import {
  browserPage,
  browser,
  closeBrowser,
  screenshot
} from '@botmation/puppeteer'

import {
  goToArtist,
  clickFirstSongPlayButton
} from '@botmation/soundcloud'

// Music will play for X minutes:
const playMusicForTimeInMinutes = 180; // 3h

(async () => {
  try {
    const bot = schedule('15 6 * * 1-5')( // Monday-Friday at 6:15am
      browser({headless: false, defaultViewport: {width: 1200, height: 800}})(
        browserPage()(
          goToArtist('idealismus'),
          clickFirstSongPlayButton,
          screenshot('soundcloud'),
          wait(playMusicForTimeInMinutes * 60 * 1000),
          closeBrowser
        ),
      ),
    )

    await bot()

  } catch (error) {
    console.error(error)
  }

})()
