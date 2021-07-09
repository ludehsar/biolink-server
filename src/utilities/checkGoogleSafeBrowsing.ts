import axios from 'axios'
import { GOOGLE_API_KEY } from '../config'

export const checkGoogleSafeBrowsing = async (urls: string[]): Promise<boolean> => {
  try {
    const BASE_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`
    const data = {
      client: {
        clientId: 'stashee-safe-browser',
        clientVersion: '1.0.0',
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
          'THREAT_TYPE_UNSPECIFIED',
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: urls.map((u) => ({ url: u })),
      },
    }

    const result = await axios.post(BASE_URL, data)
    const retData = await result.data

    if (retData.matches) return true

    return false
  } catch (err) {
    // TODO: fix the issue
    return false
  }
}
