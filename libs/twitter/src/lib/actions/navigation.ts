import { goTo } from "@botmation/core";
import { TWITTER_URL_HOME, TWITTER_URL_LOGOUT } from "../constants/urls";

export const goToHome = goTo(TWITTER_URL_HOME, {waitUntil: 'load'})
export const goToLogout = goTo(TWITTER_URL_LOGOUT)
