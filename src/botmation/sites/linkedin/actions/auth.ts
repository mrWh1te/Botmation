import { BotAction } from '../../../interfaces/bot-actions'
import { chain, goTo, click, type, waitForNavigation, log } from '../../..'

export const login = (emailOrPhone: string, password: string): BotAction =>
  chain(
    goTo('https://www.linkedin.com/login'),
    click('form input[id="username"]'),
    type(emailOrPhone),
    click('form input[id="password"]'),
    type(password),
    click('form button[type="submit"]'),
    waitForNavigation,
    log('LinkedIn Login Complete')
  )