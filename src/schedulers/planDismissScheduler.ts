import schedule from 'node-schedule'
import { dismissPlan } from '../services'

// Runs everyday at 12:00 AM
export const planDismissScheduler = (): void => {
  schedule.scheduleJob('0 0 0 * * *', async () => {
    const res = await dismissPlan()

    if (res.errors && res.errors.length > 0) {
      console.log(res.errors[0].message)
    } else {
      console.log('Successfully ran plan dismissal cron job')
    }
  })
}
