import { parseCronExpression } from "cron-schedule";
import { processAbortLineSignal } from "../helpers/abort";
import { sleep } from "../helpers/time";
import { BotAction } from "../interfaces";
import { isAbortLineSignal } from "../types";
import { pipe } from "./assembly-lines";

/**
 * @description   Pauses the runner (chain or pipe) for the provided milliseconds before continuing to the next BotAction
 * @param milliseconds
 */
export const wait = (milliseconds: number): BotAction => async() => {
  await sleep(milliseconds)
}

/**
 *
 * @param schedule
 */
// type wildcard = '*'
// type anyValue = wildcard | number | string

// type rangeOfValues = `${number}-${number}`
// type stepValues = `${rangeOfValues}/${number}` | `${anyValue}/${number}`

// type minute = anyValue
// type hour = anyValue
// type dayOfMonth = anyValue
// type month = anyValue
// type weekDay = anyValue

// type minute = anyValue // 0-59
// type hour = anyValue | stepValues // 0-23
// type dayOfMonth = anyValue | stepValues // 1-31
// type month = anyValue | stepValues | 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec' | 'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC'
// type weekDay = anyValue | stepValues | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

// much simpler typing, with much faster loading
// type cronjob = `${minute} ${hour} ${dayOfMonth} ${month} ${weekDay}`
const isDate = (data: any): data is Date =>
  toString.call(data) === '[object Date]'

/**
 *
 * @param schedule string|Date
 *          string needs to a be a cronjob string, see https://crontab.guru/ which sets an interval
 *          Date sets a one time event therefore NOT an interval
 *
 * @example    errors('catching errors in case cronjob gets misparsed')(
 *                schedule('* * * * *')(
 *                  ...actions
 *                )
 *             )
 *
 * @note    Date is a one time schedule
 *          string is a cronjob that is an interval schedule that will not end on its own
 *              therefore consider including some "abort" logic in the actions with a high enough assembledLines count
 */
export const schedule =
  (schedule: string|Date) =>
    (...actions: BotAction[]): BotAction<any> =>
      async(page, ...injects) => {
        let returnValue, timeUntilScheduleInMilliSeconds;
        if (isDate(schedule)) {
          timeUntilScheduleInMilliSeconds = schedule.getTime() - new Date().getTime()
          if (timeUntilScheduleInMilliSeconds > 0) {
            await sleep(timeUntilScheduleInMilliSeconds)

            returnValue = await pipe()(...actions)(page, ...injects)

            if (isAbortLineSignal(returnValue)) {
              return processAbortLineSignal(returnValue)
            }
          }
        } else {
          const cron = parseCronExpression(schedule)

          while(true) {
            timeUntilScheduleInMilliSeconds = cron.getNextDate(new Date()).getTime() - new Date().getTime()
            await sleep(timeUntilScheduleInMilliSeconds)

            returnValue = await pipe()(...actions)(page, ...injects)

            if (isAbortLineSignal(returnValue)) {
              return processAbortLineSignal(returnValue)
            }
          }
        }
      }
