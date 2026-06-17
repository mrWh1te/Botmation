import { click } from "@botmation/puppeteer";

/**
 * Manage SoundCloud's Music Player
 */

// todo Volume control

/**
 * Click the first "Play" button on the page for the first song, as determined by the HTML order
 */
export const clickFirstSongPlayButton = click('a[role="button"].sc-button-play')
