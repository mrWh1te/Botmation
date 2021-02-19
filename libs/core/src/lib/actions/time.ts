import { parseCronExpression } from "cron-schedule";
import { BotAction } from "../interfaces";

/**
 *
 * @param schedule
 */
type wildcard = '*'
type anyValue = wildcard | number | string

// type rangeOfValues = `${number}-${number}`
// type stepValues = `${rangeOfValues}/${number}` | `${anyValue}/${number}`

type minute = anyValue
type hour = anyValue
type dayOfMonth = anyValue
type month = anyValue
type weekDay = anyValue

// type minute = anyValue // 0-59
// type hour = anyValue | stepValues // 0-23
// type dayOfMonth = anyValue | stepValues // 1-31
// type month = anyValue | stepValues | 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec' | 'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC'
// type weekDay = anyValue | stepValues | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

// much simpler typing, with much faster loading
type crontab = `${minute} ${hour} ${dayOfMonth} ${month} ${weekDay}`

export const schedule =
  (schedule: crontab) =>
    (...actions: BotAction[]): BotAction<any> =>
      async(page, ...injects) => {
        // 1. check schedule
        const cron = parseCronExpression(schedule) // todo this can throw an error so this BotAction needs to be wrapped by errors()()
        console.log(cron.getNextDate(new Date())) // get next date based on now

        // 2. timeout until scheduled run time (with actions set to run)

        // 3. after actions run, reschedule if needed
      }
