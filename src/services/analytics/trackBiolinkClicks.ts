import geoip from 'geoip-lite'
import DeviceDetector from 'device-detector-js'
import { Biolink, TrackLink } from 'entities'
import { ErrorResponse } from 'object-types'
import { MyContext, ErrorCode } from 'types'

export const trackBiolinkClicks = async (
  biolink: Biolink,
  context: MyContext
): Promise<ErrorResponse[]> => {
  const errors: ErrorResponse[] = []

  if (!biolink) {
    errors.push({
      errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
      message: 'Biolink could not be found',
    })

    return errors
  }

  // Collecting information
  const ip = context.req.ip
  const geo = geoip.lookup(ip)
  const deviceDetector = new DeviceDetector()
  const device = deviceDetector.parse(context.req.headers['user-agent'] || '')

  // Saving to the database
  const trackBiolink = TrackLink.create({
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
  })

  trackBiolink.biolink = Promise.resolve(biolink)

  await trackBiolink.save()

  return errors
}
