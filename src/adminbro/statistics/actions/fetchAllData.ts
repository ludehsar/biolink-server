import { ApiClient } from 'admin-bro'

const api = new ApiClient()

export const getStatisticsData = async (
  userRegistrationStartDate: Date,
  userRegistrationEndDate: Date,
  biolinkCreationStartDate: Date,
  biolinkCreationEndDate: Date,
  linkCreationStartDate: Date,
  linkCreationEndDate: Date
): Promise<any> => {
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
