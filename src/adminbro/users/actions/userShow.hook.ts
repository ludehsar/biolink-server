import { ActionResponse } from 'admin-bro'

import { UserLogs } from '../../../entities/UserLogs'
import { Biolink } from '../../../entities/Biolink'
import { Link } from '../../../entities/Link'
import { Domain } from '../../../entities/Domain'
import { Payment } from '../../../entities/Payment'

export const fetchWithUserLogs = async (res: ActionResponse): Promise<ActionResponse> => {
  if (res.record && res.record.params) {
    const user = res.record.params

    const userLogs = await UserLogs.find({
      where: { user },
      order: { createdAt: 'DESC' },
      take: 20,
    })

    const biolinkCount = await Biolink.count({
      where: { user },
    })

    const linkCount = await Link.count({
      where: { user },
    })

    const domainCount = await Domain.count({
      where: { user },
    })

    const paymentCount = await Payment.count({
      where: { user },
    })

    res.record.params.activities = userLogs
    res.record.params.biolinkCount = biolinkCount
    res.record.params.linkCount = linkCount
    res.record.params.domainCount = domainCount
    res.record.params.paymentCount = paymentCount
  }

  return res
}
