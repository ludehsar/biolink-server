import DeviceDetector from 'device-detector-js'
import geoip from 'geoip-lite'
import moment from 'moment'

import { Biolink } from '../models/entities/Biolink'
import { Link } from '../models/entities/Link'
import { TrackLink } from '../models/entities/TrackLink'
import { MyContext } from '../MyContext'
import { BooleanResponse } from '../resolvers/commonTypes'
import { User } from '../models/entities/User'
import { AnalyticsResponse } from '../resolvers/analytics.resolver'

export const trackLink = async (link: Link, context: MyContext): Promise<BooleanResponse> => {
  if (!link) {
    return {
      errors: [
        {
          message: 'Link could not be found',
        },
      ],
      executed: false,
    }
  }

  const ip = context.req.ip

  const geo = geoip.lookup(ip)

  const deviceDetector = new DeviceDetector()

  const device = deviceDetector.parse(context.req.headers['user-agent'] || '')

  await TrackLink.create({
    browserLanguage: context.req.acceptsLanguages()[0] || 'Unknown',
    browserName: device.client?.name || 'Unknown',
    cityName: geo?.city || 'Unknown',
    countryCode: geo?.country || 'Unknown',
    deviceType: device.device
      ? device.device.type.charAt(0).toUpperCase() + device.device.type.slice(1)
      : 'Unknown',
    link,
    osName: device.os?.name || 'Unknown',
    referer: context.req.headers.referer || 'Unknown',
    utmCampaign: context.req.params.utm_campaign || 'Unknown',
    utmMedium: context.req.params.utm_medium || 'Unknown',
    utmSource: context.req.params.utm_source || 'Unknown',
  }).save()

  return {
    executed: true,
  }
}

export const trackBiolink = async (
  biolink: Biolink,
  context: MyContext
): Promise<BooleanResponse> => {
  if (!biolink) {
    return {
      errors: [
        {
          message: 'Biolink could not be found',
        },
      ],
      executed: false,
    }
  }

  const ip = context.req.ip

  const geo = geoip.lookup(ip)

  const deviceDetector = new DeviceDetector()

  const device = deviceDetector.parse(context.req.headers['user-agent'] || '')

  await TrackLink.create({
    biolink,
    browserLanguage: context.req.acceptsLanguages()[0] || 'Unknown',
    browserName: device.client?.name || 'Unknown',
    cityName: geo?.city || 'Unknown',
    countryCode: geo?.country || 'Unknown',
    deviceType: device.device
      ? device.device.type.charAt(0).toUpperCase() + device.device.type.slice(1)
      : 'Unknown',
    osName: device.os?.name || 'Unknown',
    referer: context.req.headers.referer || 'Unknown',
    utmCampaign: context.req.params.utm_campaign || 'Unknown',
    utmMedium: context.req.params.utm_medium || 'Unknown',
    utmSource: context.req.params.utm_source || 'Unknown',
  }).save()

  return {
    executed: true,
  }
}

export interface UserStatisticsForAdminProps {
  newRegisteredUsers: {
    user_count: number
    user_createdat: Date
  }[]
}

export interface BiolinkStatisticsForAdminProps {
  newBiolinks: {
    biolink_count: number
    biolink_createdat: Date
  }[]
}

export interface LinkStatisticsForAdminProps {
  newLinks: {
    link_count: number
    link_createdat: Date
  }[]
}

export type StatisticsForAdminsProps =
  | UserStatisticsForAdminProps
  | BiolinkStatisticsForAdminProps
  | LinkStatisticsForAdminProps

export const getRegisteredUsersDataForAdmins = async (
  userRegistrationStartDate?: Date,
  userRegistrationEndDate?: Date
): Promise<UserStatisticsForAdminProps> => {
  const qb = User.createQueryBuilder('user').select(
    `(SELECT COUNT("u2"."id") FROM "user" "u2" WHERE "u2"."createdAt" <= "user"."createdAt" AND "u2"."deletedAt" IS NULL) AS user_count,
      "user"."createdAt" as user_createdAt`
  )

  if (userRegistrationStartDate && userRegistrationEndDate) {
    qb.where(
      `user.createdAt BETWEEN '${moment(userRegistrationStartDate).toISOString()}' AND '${moment(
        userRegistrationEndDate
      ).toISOString()}'`
    )
  }

  const newRegisteredUsers = await qb
    .groupBy('user.createdAt')
    .orderBy('user_createdAt', 'ASC')
    .execute()

  return { newRegisteredUsers }
}

export const getBiolinksDataForAdmins = async (
  biolinkCreationStartDate?: Date,
  biolinkCreationEndDate?: Date
): Promise<BiolinkStatisticsForAdminProps> => {
  const qb = Biolink.createQueryBuilder('biolink').select(
    `(SELECT COUNT("b2"."id") FROM "biolink" "b2" WHERE "b2"."createdAt" <= "biolink"."createdAt" AND "b2"."deletedAt" IS NULL) AS biolink_count,
      "biolink"."createdAt" as biolink_createdAt`
  )

  if (biolinkCreationStartDate && biolinkCreationEndDate) {
    qb.where(
      `biolink.createdAt BETWEEN '${moment(biolinkCreationStartDate).toISOString()}' AND '${moment(
        biolinkCreationEndDate
      ).toISOString()}'`
    )
  }

  const newBiolinks = await qb
    .groupBy('biolink.createdAt')
    .orderBy('biolink_createdAt', 'ASC')
    .execute()

  return { newBiolinks }
}

export const getLinksDataForAdmins = async (
  linkCreationStartDate?: Date,
  linkCreationEndDate?: Date
): Promise<LinkStatisticsForAdminProps> => {
  const qb = Link.createQueryBuilder('link').select(
    `(SELECT COUNT("l2"."id") FROM "link" "l2" WHERE "l2"."createdAt" <= "link"."createdAt" AND "l2"."deletedAt" IS NULL) AS link_count,
      "link"."createdAt" as link_createdAt`
  )

  if (linkCreationStartDate && linkCreationEndDate) {
    qb.where(
      `link.createdAt BETWEEN '${moment(linkCreationStartDate).toISOString()}' AND '${moment(
        linkCreationEndDate
      ).toISOString()}'`
    )
  }

  const newLinks = await qb.groupBy('link.createdAt').orderBy('link_createdAt', 'ASC').execute()

  return { newLinks }
}

export const getStatisticsForAdmins = async (
  userRegistrationStartDate?: Date,
  userRegistrationEndDate?: Date,
  biolinkCreationStartDate?: Date,
  biolinkCreationEndDate?: Date,
  linkCreationStartDate?: Date,
  linkCreationEndDate?: Date
): Promise<StatisticsForAdminsProps> => {
  const user = await getRegisteredUsersDataForAdmins(
    userRegistrationStartDate,
    userRegistrationEndDate
  )

  const biolink = await getBiolinksDataForAdmins(biolinkCreationStartDate, biolinkCreationEndDate)

  const link = await getLinksDataForAdmins(linkCreationStartDate, linkCreationEndDate)

  return {
    newRegisteredUsers: user.newRegisteredUsers,
    newBiolinks: biolink.newBiolinks,
    newLinks: link.newLinks,
  }
}

export const getBiolinkTrackingsByBiolinkUsername = async (
  username: string,
  user: User,
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsResponse> => {
  if (!user) {
    return {
      errors: [
        {
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const biolink = await Biolink.findOne({ where: { username, userId: user.id } })

  if (!biolink) {
    return {
      errors: [
        {
          message: 'Biolink with this username does not exist or the user is not authorized',
        },
      ],
    }
  }

  const qb = TrackLink.createQueryBuilder('track').select(
    `(SELECT COUNT("t2"."id") FROM "track_link" "t2" WHERE "t2"."createdAt" <= "track"."createdAt" AND "t2"."deletedAt" IS NULL) AS click_count,
      "track"."createdAt" as date`
  )

  if (startDate && endDate) {
    qb.where(
      `track.createdAt BETWEEN '${moment(startDate).toISOString()}' AND '${moment(
        endDate
      ).toISOString()}'`
    )
  }

  const tracks = await qb.groupBy('track.createdAt').orderBy('date', 'ASC').execute()

  return {
    result: tracks,
  }
}
