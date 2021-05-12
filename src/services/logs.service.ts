import useragent from 'useragent'
import geoip from 'geoip-lite'

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

  let ip = context.req.ip

  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7)
  }

  const geo = geoip.lookup(ip)
  const agent = useragent.lookup(context.req.headers['user-agent'])

  await UserLogs.create({
    user,
    description,
    ipAddress: ip,
    browserLanguage: context.req.acceptsLanguages()[0] || 'Unknown',
    browserName: agent.family || 'Unknown',
    cityName: geo?.city || 'Unknown',
    countryCode: geo?.country || 'Unknown',
    deviceType: agent.device.family || 'Unknown',
    osName: agent.os.family || 'Unknown',
  }).save()

  return {
    executed: true,
  }
}
