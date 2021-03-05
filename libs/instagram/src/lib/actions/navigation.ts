import { BotAction, goTo } from "@botmation/core"


export const goToHome: BotAction = goTo('https://www.instagram.com/')

export const goToMessaging: BotAction = goTo('https://www.instagram.com/direct/inbox/')

export const goToExplore: BotAction = goTo('https://www.instagram.com/explore/')

export const goToSettings: BotAction = goTo('https://www.instagram.com/accounts/edit/')
