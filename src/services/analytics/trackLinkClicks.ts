import geoip from 'geoip-lite'
import DeviceDetector from 'device-detector-js'
import { Link, TrackLink } from '../../entities'
import { MyContext, ErrorCode } from '../../types'
import { DefaultResponse } from '../../object-types'

export const trackLinkClicks = async (link: Link, context: MyContext): Promise<DefaultResponse> => {
  if (!link) {
    return {
      errors: [
        {
          errorCode: ErrorCode.LINK_COULD_NOT_BE_FOUND,
          message: 'Link could not be found',
        },
      ],
    }
  }

  // Collecting information
  const ip = context.req.ip
  const geo = geoip.lookup(ip)
  const deviceDetector = new DeviceDetector()
  const device = deviceDetector.parse(context.req.headers['user-agent'] || '')

  // Saving to database
  const trackLink = TrackLink.create({
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

  trackLink.link = Promise.resolve(link)

  await trackLink.save()

  return {}
}
