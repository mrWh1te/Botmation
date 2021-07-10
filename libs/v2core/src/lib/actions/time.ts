import { parseCronExpression } from "cron-schedule";
import { processAbortLineSignal } from "../helpers/abort";
import { sleep } from "../helpers/time";
import { Action } from "../interfaces";
import { isAbortLineSignal } from "../types";
import { isDate } from "../types/time";
import { assemblyLine } from "./assembly-lines";

/**
 * @description   Pauses the runner (chain or pipe) for the provided milliseconds before continuing to the next Action
 * @param milliseconds
 */
export const wait = (milliseconds: number): Action => async() => {
  await sleep(milliseconds)
}

/**
 *
 * @param schedule string|Date
 *          string sets a schedule on a repeating interval
 *             - needs to a be a cron schedule expression, see https://crontab.guru/
 *             - suggestion: actions scheduled have some kind of abort() logic (ie after X date, abort the infinite sequence)
 *          Date sets a one time scheduled event
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
    (...actions: Action[]): Action =>
      async(injects) => {
        let timeUntilScheduleInMilliSeconds
        if (isDate(schedule)) {
          timeUntilScheduleInMilliSeconds = schedule.getTime() - Date.now()
          if (timeUntilScheduleInMilliSeconds > 0) {
            await sleep(timeUntilScheduleInMilliSeconds)

            return assemblyLine()(...actions)(injects)
          }
        } else {
          const cron = parseCronExpression(schedule) // throws an error if it doesnt parse

          while(true) {
            timeUntilScheduleInMilliSeconds = cron.getNextDate(new Date(Date.now())).getTime() - Date.now()
            await sleep(timeUntilScheduleInMilliSeconds)

            const returnValue = await assemblyLine()(...actions)(injects)

            if (isAbortLineSignal(returnValue)) {
              return processAbortLineSignal(returnValue)
            }
          }
        }
      }
