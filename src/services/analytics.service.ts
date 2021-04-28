import useragent from 'useragent'
import geoip from 'geoip-lite'

import { Biolink } from '../models/entities/Biolink'
import { Link } from '../models/entities/Link'
import { TrackLink } from '../models/entities/TrackLink'
import { MyContext } from '../MyContext'
import { BooleanResponse } from '../resolvers/commonTypes'

export const trackLink = async (link: Link, context: MyContext): Promise<BooleanResponse> => {
  if (!link) {
    return {
      errors: [
        {
          message: 'Link could not be found',
        },
      ],
      passed: false,
    }
  }

  const biolink = await Biolink.findOne(link.biolinkId)

  if (!biolink) {
    return {
      errors: [
        {
          message: 'Invalid biolink',
        },
      ],
      passed: false,
    }
  }

  const geo = geoip.lookup(context.req.ip)

  const agent = useragent.lookup(context.req.headers['user-agent'])

  await TrackLink.create({
    biolink,
    browserLanguage: context.req.acceptsLanguages()[0] || 'Unknown',
    browserName: agent.family || 'Unknown',
    cityName: geo?.city || 'Unknown',
    countryCode: geo?.country || 'Unknown',
    deviceType: agent.device.family || 'Unknown',
    link,
    osName: agent.os.family || 'Unknown',
    referer: context.req.headers.referer || 'Unknown',
    utmCampaign: context.req.params.utm_campaign || 'Unknown',
    utmMedium: context.req.params.utm_medium || 'Unknown',
    utmSource: context.req.params.utm_source || 'Unknown',
  }).save()

  return {
    passed: true,
  }
}
