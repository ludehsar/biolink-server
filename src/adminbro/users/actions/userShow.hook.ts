import { ActionResponse } from 'admin-bro'

import { UserLogs } from '../../../models/entities/UserLogs'

export const fetchWithUserLogs = async (res: ActionResponse): Promise<ActionResponse> => {
  if (res.record && res.record.params) {
    const user = res.record.params

    const userLogs = await UserLogs.find({
      where: { user },
      order: { createdAt: 'DESC' },
      take: 20,
    })

    res.record.params.activities = userLogs
  }

  return res
}
