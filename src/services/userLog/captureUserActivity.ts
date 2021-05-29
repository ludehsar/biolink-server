import DeviceDetector from 'device-detector-js'
import geoip from 'geoip-lite'
import axios from 'axios'
import { User, UserLogs } from 'entities'
import { CountryInfo } from 'interfaces'
import { ErrorResponse } from 'object-types'
import { MyContext, ErrorCode } from 'types'

export const captureUserActivity = async (
  user: User,
  context: MyContext,
  description: string
): Promise<ErrorResponse[]> => {
  const errors: ErrorResponse[] = []

  if (!user) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
      message: 'User is not authenticated',
    })
  }

  const ip = context.req.ip

  const geo = geoip.lookup(ip)

  const deviceDetector = new DeviceDetector()

  const device = deviceDetector.parse(context.req.headers['user-agent'] || '')

  const userLog = UserLogs.create({
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
  })

  userLog.user = Promise.resolve(user)

  await userLog.save()

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

  return errors
}
