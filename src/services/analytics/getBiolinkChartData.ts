import { getConnection } from 'typeorm'

import { ChartResponse } from '../../object-types'
import { Biolink, User } from '../../entities'
import { ErrorCode } from '../../types'

export const getBiolinkChartData = async (id: string, user: User): Promise<ChartResponse> => {
  const biolink = await Biolink.findOne(id)

  if (!biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'Biolink not found',
        },
      ],
    }
  }

  if (!user || biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  const result = await getConnection().query(
    `
    SELECT date, coalesce(views, 0) as views
    FROM  (
      SELECT "date"::date
      FROM generate_series(current_date - interval '7 days'
                        ,  current_date
                        ,  interval  '1 day') "date"
      ) d
    LEFT JOIN (
      SELECT "tb"."createdAt"::date AS date
            , count(*) AS views
      FROM   "track_link" "tb"
      WHERE  "tb"."createdAt" >= current_date - interval '7 days'
      AND    "tb"."biolinkId" = '${biolink.id}'
      GROUP  BY 1
      ) t USING (date)
    ORDER  BY date;
  `
  )

  return {
    result,
  }
}
