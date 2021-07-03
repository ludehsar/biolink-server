import { checkGoogleSafeBrowsing } from './checkGoogleSafeBrowsing'

export const isMalicious = async (urls: string[]): Promise<boolean> => {
  const resFromSafeBrowseAPI = await checkGoogleSafeBrowsing(urls)

  if (resFromSafeBrowseAPI) return true
  return false
}
