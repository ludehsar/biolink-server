import { User, Biolink, Plan } from '../../entities'
import { BiolinkResponse } from '../../object-types'
import { createNewLink, captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'
import { linktreeImportHandler } from '../../utilities'

export const importFromLinktree = async (
  id: string,
  linktreeUsername: string,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const biolink = await Biolink.findOne(id)

  if (!biolink || biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  const plan = (await user.plan) || Plan.findOne({ where: { name: 'Free' } })

  if (!plan) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
          message: 'Plan not defined',
        },
      ],
    }
  }

  const planSettings = plan.settings || {}

  const url = `https://linktr.ee/${linktreeUsername}`

  try {
    const res = await linktreeImportHandler(url)

    if (res.bio) biolink.bio = res.bio

    if (res.links) {
      res.links.forEach(async (link) => {
        await createNewLink(
          { url: link.url, linkTitle: link.linkTitle, enablePasswordProtection: false },
          context,
          user,
          id
        )
      })
    }

    if (res.profilePhotoUrl) biolink.profilePhotoUrl = res.profilePhotoUrl

    if (planSettings.socialEnabled && res.socials) {
      const biolinkSettings = biolink.settings || {}

      biolinkSettings.socialAccounts = res.socials

      biolink.settings = biolinkSettings
    }

    await biolink.save()

    await captureUserActivity(
      user,
      context,
      `Imported biolink from ${linktreeUsername} Linktree profile to ${biolink.username}`
    )

    return { biolink }
  } catch (err) {
    return {
      errors: [
        {
          errorCode: ErrorCode.INVALID_TOKEN,
          message: err.message,
        },
      ],
    }
  }
}
