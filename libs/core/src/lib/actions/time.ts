import { parseCronExpression } from "cron-schedule";
import { processAbortLineSignal } from "../helpers/abort";
import { sleep } from "../helpers/time";
import { BotAction } from "../interfaces";
import { isAbortLineSignal } from "../types";
import { isDate } from "../types/time";
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
 * @param schedule string|Date
 *          string sets a schedule on a repeating interval
 *             - needs to a be a cronjob string, ie https://crontab.guru/
 *             - actions scheduled should have some kind of abort() logic (ie after X date, abort the sequence)
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
    (...actions: BotAction<any>[]): BotAction<any> =>
      async(page, ...injects) => {
        let timeUntilScheduleInMilliSeconds
        if (isDate(schedule)) {
          timeUntilScheduleInMilliSeconds = schedule.getTime() - Date.now()
          if (timeUntilScheduleInMilliSeconds > 0) {
            await sleep(timeUntilScheduleInMilliSeconds)

            return await pipe()(...actions)(page, ...injects)
          }
        } else {
          const cron = parseCronExpression(schedule) // throws an error if it doesnt parse

          while(true) {
            timeUntilScheduleInMilliSeconds = cron.getNextDate(new Date(Date.now())).getTime() - Date.now()
            await sleep(timeUntilScheduleInMilliSeconds)

            const returnValue = await pipe()(...actions)(page, ...injects)

            if (isAbortLineSignal(returnValue)) {
              return processAbortLineSignal(returnValue)
            }
          }
        }
      }
