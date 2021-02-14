import puppeteer from 'puppeteer'

import {
  chain,
  goTo,
  screenshot
} from '@botmation/core'

export class PhotoBot {
  private page: puppeteer.Page;

  constructor(page: puppeteer.Page) {
    this.page = page;
  }

  public async closePage() {
    if (this.page) {
      await this.page.close()
      this.page = undefined
    }
  }

  public async takeAPhoto(url: string) {
    const fileName = new Date().getTime().toString();
    await chain(
      goTo(url),
      screenshot(fileName)
    )(this.page)
  }
}

