import DeviceDetector from 'device-detector-js'
import geoip from 'geoip-lite'
import publicIp from 'public-ip'

import { BooleanResponse } from '../resolvers/commonTypes'
import { UserLogs } from '../models/entities/UserLogs'
import { User } from '../models/entities/User'
import { MyContext } from '../MyContext'

export const captureUserActivity = async (
  user: User,
  context: MyContext,
  description: string
): Promise<BooleanResponse> => {
  if (!user) {
    return {
      errors: [
        {
          message: 'User is not authenticated',
        },
      ],
      executed: false,
    }
  }

  const ip = await publicIp.v4()

  const geo = geoip.lookup(ip)

  const deviceDetector = new DeviceDetector()

  const device = deviceDetector.parse(context.req.headers['user-agent'] || '')

  await UserLogs.create({
    user,
    description,
    ipAddress: ip,
    browserLanguage: context.req.acceptsLanguages()[0] || 'Unknown',
    browserName: device.client?.name || 'Unknown',
    cityName: geo?.city || 'Unknown',
    countryCode: geo?.country || 'Unknown',
    deviceType: device.device
      ? device.device.type.charAt(0).toUpperCase() + device.device.type.slice(1)
      : 'Unknown',
    osName: device.os?.name || 'Unknown',
  }).save()

  return {
    executed: true,
  }
}
