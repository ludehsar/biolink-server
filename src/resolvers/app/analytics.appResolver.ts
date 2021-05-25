import { validate } from 'class-validator'
import { Arg, Query, Resolver } from 'type-graphql'

import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { getBiolinkTrackingsByBiolinkUsername } from '../../controllers/app/analytics.controller'
import { AnalyticsInput, AnalyticsResponse } from '../../typeDefs/analytics.typeDef'
import { ErrorCode } from '../../constants/errorCodes'

@Resolver()
export class AnalyticsResolver {
  @Query(() => AnalyticsResponse)
  async getBiolinkAnalyticsByUsername(
    @Arg('options') options: AnalyticsInput,
    @CurrentUser() user: User
  ): Promise<AnalyticsResponse> {
    // Validate input
    const validationErrors = await validate(options)

    if (validationErrors.length > 0) {
      return {
        errors: validationErrors.map((err) => ({
          field: err.property,
          errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
          message: 'Not correctly formatted',
        })),
      }
    }

    return await getBiolinkTrackingsByBiolinkUsername(
      options.username,
      user,
      options.startDate,
      options.endDate
    )
  }
}
