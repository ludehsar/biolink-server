import { checkGoogleSafeBrowsing } from './checkGoogleSafeBrowsing'
import { checkGoogleWebRiskApi } from './checkGoogleWebRiskApi'

export const isMalicious = async (urls: string[]): Promise<boolean> => {
  const resFromWebRiskAPI = await checkGoogleWebRiskApi(urls)
  const resFromSafeBrowseAPI = await checkGoogleSafeBrowsing(urls)

  if (resFromWebRiskAPI || resFromSafeBrowseAPI) return true
  return false
}
