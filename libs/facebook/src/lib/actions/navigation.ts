import { goTo } from "@botmation/core";

import {
  FACEBOOK_URL_BLOODDONATIONS,
  FACEBOOK_URL_CAMPUS,
  FACEBOOK_URL_CLIMATESCIENCEINFORMATIONCENTER,
  FACEBOOK_URL_CORONAVIRUS,
  FACEBOOK_URL_CRISISRESPONSE,
  FACEBOOK_URL_EVENTS,
  FACEBOOK_URL_FACEBOOKPAY,
  FACEBOOK_URL_FRIENDLISTS,
  FACEBOOK_URL_FRIENDS,
  FACEBOOK_URL_FUNDRAISERS,
  FACEBOOK_URL_GAMING,
  FACEBOOK_URL_GROUPS,
  FACEBOOK_URL_HOME,
  FACEBOOK_URL_JOBS,
  FACEBOOK_URL_LIFTBLACKVOICES,
  FACEBOOK_URL_LIVEVIDEOS,
  FACEBOOK_URL_LOGIN,
  FACEBOOK_URL_MARKETPLACE,
  FACEBOOK_URL_MEMORIES,
  FACEBOOK_URL_MESSAGES,
  FACEBOOK_URL_MOVIES,
  FACEBOOK_URL_NEWS,
  FACEBOOK_URL_OCULUS,
  FACEBOOK_URL_OFFERS,
  FACEBOOK_URL_PAGES,
  FACEBOOK_URL_RECENTADACTIVITY,
  FACEBOOK_URL_SAVED,
  FACEBOOK_URL_TOWNHALL,
  FACEBOOK_URL_VOTINGINFORMATIONCENTER,
  FACEBOOK_URL_WATCH,
  FACEBOOK_URL_WEATHER,
} from "../constants/urls";

export const goToHome = goTo(FACEBOOK_URL_HOME, {waitUntil: 'load'})

export const goToFriends = goTo(FACEBOOK_URL_FRIENDS, {waitUntil: 'load'})
export const goToGroups = goTo(FACEBOOK_URL_GROUPS, {waitUntil: 'load'})
export const goToMarketPlace = goTo(FACEBOOK_URL_MARKETPLACE, {waitUntil: 'load'})
export const goToWatch = goTo(FACEBOOK_URL_WATCH, {waitUntil: 'load'})
export const goToEvents = goTo(FACEBOOK_URL_EVENTS, {waitUntil: 'load'})
export const goToMemories = goTo(FACEBOOK_URL_MEMORIES, {waitUntil: 'load'})
export const goToFriendLists = goTo(FACEBOOK_URL_FRIENDLISTS, {waitUntil: 'load'})
export const goToSaved = goTo(FACEBOOK_URL_SAVED, {waitUntil: 'load'})
export const goToPages = goTo(FACEBOOK_URL_PAGES, {waitUntil: 'load'})
export const goToJobs = goTo(FACEBOOK_URL_JOBS, {waitUntil: 'load'})
export const goToMessages = goTo(FACEBOOK_URL_MESSAGES, {waitUntil: 'load'})
export const goToLogin = goTo(FACEBOOK_URL_LOGIN)

export const goToBloodDonations = goTo(FACEBOOK_URL_BLOODDONATIONS, {waitUntil: 'load'})
export const goToCampus = goTo(FACEBOOK_URL_CAMPUS, {waitUntil: 'load'})
export const goToClimateScienceInformationCenter = goTo(FACEBOOK_URL_CLIMATESCIENCEINFORMATIONCENTER, {waitUntil: 'load'})
export const goToCoronaVirus = goTo(FACEBOOK_URL_CORONAVIRUS, {waitUntil: 'load'})
export const goToCrisisResponse = goTo(FACEBOOK_URL_CRISISRESPONSE, {waitUntil: 'load'})
export const goToFacebookPay = goTo(FACEBOOK_URL_FACEBOOKPAY, {waitUntil: 'load'})
export const goToFundraisers = goTo(FACEBOOK_URL_FUNDRAISERS, {waitUntil: 'load'})
export const goToGaming = goTo(FACEBOOK_URL_GAMING, {waitUntil: 'load'})
export const goToLiftBlackVoices = goTo(FACEBOOK_URL_LIFTBLACKVOICES, {waitUntil: 'load'})
export const goToLiveVideos = goTo(FACEBOOK_URL_LIVEVIDEOS, {waitUntil: 'load'})
export const goToMovies = goTo(FACEBOOK_URL_MOVIES, {waitUntil: 'load'})
export const goToNews = goTo(FACEBOOK_URL_NEWS, {waitUntil: 'load'})
export const goToOculus = goTo(FACEBOOK_URL_OCULUS, {waitUntil: 'load'})
export const goToOffers = goTo(FACEBOOK_URL_OFFERS, {waitUntil: 'load'})
export const goToRecentAdActivity = goTo(FACEBOOK_URL_RECENTADACTIVITY, {waitUntil: 'load'})
export const goToTownHall = goTo(FACEBOOK_URL_TOWNHALL, {waitUntil: 'load'})
export const goToVotingInformationCenter = goTo(FACEBOOK_URL_VOTINGINFORMATIONCENTER, {waitUntil: 'load'})
export const goToWeather = goTo(FACEBOOK_URL_WEATHER, {waitUntil: 'load'})
