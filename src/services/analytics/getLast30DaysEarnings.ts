import { getConnection } from 'typeorm'
import { ErrorCode } from '../../types'
import { User } from '../../entities'
import { EarningChartResponse } from '../../object-types'

export const getLast30DaysEarnings = async (adminUser: User): Promise<EarningChartResponse> => {
  if (!adminUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const adminRole = await adminUser.adminRole

  if (!adminRole) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  const result = await getConnection().query(
    `
    SELECT date, coalesce(earned, 0) as earned
    FROM  (
      SELECT "date"::date
      FROM generate_series(current_date - interval '30 days'
                        ,  current_date
                        ,  interval  '1 day') "date"
      ) d
    LEFT JOIN (
      SELECT "payment"."createdAt"::date AS date
            , sum("payment"."stripeAmountPaid") AS earned
      FROM   "payment" "payment"
      WHERE  "payment"."createdAt" >= current_date - interval '30 days'
      GROUP  BY 1
      ) t USING (date)
    ORDER  BY date;
  `
  )

  return {
    result,
  }
}
