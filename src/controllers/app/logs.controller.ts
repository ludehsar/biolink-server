import DeviceDetector from 'device-detector-js'
import geoip from 'geoip-lite'
import axios from 'axios'

import { BooleanResponse } from '../../typeDefs/common.typeDef'
import { UserLogs } from '../../models/entities/UserLogs'
import { User } from '../../models/entities/User'
import { MyContext } from '../../MyContext'
import { CountryInfo } from '../../interfaces/CountryInfo'
import { ErrorCode } from '../../constants/errorCodes'

export const captureUserActivity = async (
  user: User,
  context: MyContext,
  description: string
): Promise<BooleanResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
      executed: false,
    }
  }

  const ip = context.req.ip

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

  user.language = context.req.acceptsLanguages()[0] || 'Unknown'
  user.lastIPAddress = ip
  user.lastUserAgent = context.req.headers['user-agent'] || ''
  user.timezone = new Date().getTimezoneOffset().toString()
  if (geo) {
    const countryInfo = await axios.get('https://restcountries.eu/rest/v2/alpha/' + geo.country)

    user.country = (countryInfo.data as CountryInfo).name
    console.log(countryInfo)
  }

  await user.save()

  return {
    executed: true,
  }
}
