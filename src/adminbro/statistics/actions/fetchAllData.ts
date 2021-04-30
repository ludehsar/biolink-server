import { ApiClient } from 'admin-bro'
import { AxiosResponse } from 'axios'
import { StatisticsForAdminsProps } from '../../../services/analytics.service'

const api = new ApiClient()

export const getStatisticsData = async (
  userRegistrationStartDate?: Date,
  userRegistrationEndDate?: Date,
  biolinkCreationStartDate?: Date,
  biolinkCreationEndDate?: Date,
  linkCreationStartDate?: Date,
  linkCreationEndDate?: Date
): Promise<void | AxiosResponse<StatisticsForAdminsProps>> => {
  const data = await api
    .getPage({
      pageName: 'Statistics',
      params: {
        userRegistrationStartDate,
        userRegistrationEndDate,
        biolinkCreationStartDate,
        biolinkCreationEndDate,
        linkCreationStartDate,
        linkCreationEndDate,
      },
      method: 'POST',
    })
    .catch((err) => {
      console.log(err)
    })

  return data
}
