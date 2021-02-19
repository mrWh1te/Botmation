import { parseCronExpression } from "cron-schedule";
import { sleep } from "../helpers/time";
import { BotAction } from "../interfaces";

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
 * @param schedule
 *
 * @example    errors('catching errors in case cronjob gets misparsed')(
 *                schedule('* * * * *')(
 *                  ...actions
 *                )
 *             )
 */
export const schedule =
  (schedule: string|Date) =>
    (...actions: BotAction[]): BotAction<any> =>
      async(page, ...injects) => {
        if (isDate(schedule)) {


        } else {
          // 1. check cronjob
          const cron = parseCronExpression(schedule)
          console.log(cron.getNextDate(new Date()))
        }


        // 2. timeout until scheduled run time (with actions set to run)

        // 3. after actions run, reschedule if needed
      }
