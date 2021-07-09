import { WebRiskServiceClient } from '@google-cloud/web-risk'

export const checkGoogleWebRiskApi = async (urls: string[]): Promise<boolean> => {
  try {
    const client = new WebRiskServiceClient()

    for (let i = 0; i < urls.length; ++i) {
      const url = urls[i]

      const request = {
        uri: url,
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
          'THREAT_TYPE_UNSPECIFIED',
        ],
      }

      const { threat } = (await client.searchUris(request as any))[0]

      if (threat) return true
    }

    return false
  } catch (err) {
    return false
  }
}
