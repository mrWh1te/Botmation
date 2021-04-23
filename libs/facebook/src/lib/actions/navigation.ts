import { goTo } from "@botmation/core";

import {
  FACEBOOK_URL_HOME,
  FACEBOOK_URL_LOGIN,
  FACEBOOK_URL_MESSAGES,
} from "../constants/urls";

export const goToHome = goTo(FACEBOOK_URL_HOME, {waitUntil: 'load'})

export const goToMessages = goTo(FACEBOOK_URL_MESSAGES, {waitUntil: 'load'})

export const goToLogin = goTo(FACEBOOK_URL_LOGIN)
