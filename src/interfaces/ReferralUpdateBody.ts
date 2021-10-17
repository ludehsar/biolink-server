export interface ReferralUpdateBody {
  userInfo: {
    referredToEmail: string
    referredToName?: string
  }[]
  referredByEmail: string
  referredByName?: string
}
