import { Request } from 'express'

import {
  getStatisticsForAdmins,
  StatisticsForAdminsProps,
} from '../../../controllers/app/analytics.controller'

const statisticsHandler = async (req: Request): Promise<StatisticsForAdminsProps> => {
  const {
    userRegistrationStartDate,
    userRegistrationEndDate,
    biolinkCreationStartDate,
    biolinkCreationEndDate,
    linkCreationStartDate,
    linkCreationEndDate,
  } = req.query
  const data = await getStatisticsForAdmins(
    userRegistrationStartDate as unknown as Date,
    userRegistrationEndDate as unknown as Date,
    biolinkCreationStartDate as unknown as Date,
    biolinkCreationEndDate as unknown as Date,
    linkCreationStartDate as unknown as Date,
    linkCreationEndDate as unknown as Date
  )
  return data
}

export default statisticsHandler
