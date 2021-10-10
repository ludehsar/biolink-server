import { ApolloError, ForbiddenError } from 'apollo-server-errors'
import { Service } from 'typedi'

import { ErrorCode, MyContext } from '../types'
import { Link, User } from '../entities'
import { LinkService } from '../services/link.service'
import { BiolinkService } from '../services/biolink.service'
import { ConnectionArgs, NewLinkInput } from '../input-types'
import { PaginatedLinkResponse } from '../object-types/common/PaginatedLinkResponse'
import { UsernameService } from '../services/username.service'
import { appConfig } from '../config'
import { LinkType } from '../enums'
import { NewEmbedInput } from '../input-types/links/NewEmbedInput'
import { NewLineInput } from '../input-types/links/NewLineInput'
import { NewSocialLinkInput } from '../input-types/links/NewSocialLinkInput'
import { PlanService } from '../services/plan.service'
import { isMalicious } from '../utilities'
import { TrackingService } from '../services/tracking.service'

@Service()
export class LinkController {
  constructor(
    private readonly linkService: LinkService,
    private readonly biolinkService: BiolinkService,
    private readonly planService: PlanService,
    private readonly trackingService: TrackingService,
    private readonly usernameService: UsernameService
  ) {}

  async getAllUserLinks(
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedLinkResponse> {
    return await this.linkService.getAllLinksByUserId((context.user as User).id, options)
  }

  async getAllLinksByBiolinkId(
    options: ConnectionArgs,
    biolinkId: string,
    context: MyContext
  ): Promise<PaginatedLinkResponse> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.linkService.getAllLinksByBiolinkId(biolinkId, options)
  }

  async getAllSocialLinksByBiolinkId(
    options: ConnectionArgs,
    biolinkId: string,
    context: MyContext
  ): Promise<PaginatedLinkResponse> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.linkService.getAllSocialLinksByBiolinkId(biolinkId, options)
  }

  async getAllLinksByBiolinkUsername(
    options: ConnectionArgs,
    biolinkUsername: string
  ): Promise<PaginatedLinkResponse> {
    const usernameDoc = await this.usernameService.getUsernameDocByUsername(biolinkUsername)
    const biolink = await usernameDoc.biolink

    if (!biolink) {
      throw new ApolloError(
        'Biolink with that username not found',
        ErrorCode.BIOLINK_COULD_NOT_BE_FOUND
      )
    }

    return await this.linkService.getAllLinksByBiolinkId(biolink.id, options, true)
  }

  async getAllSocialLinksByBiolinkUsername(
    options: ConnectionArgs,
    biolinkUsername: string
  ): Promise<PaginatedLinkResponse> {
    const usernameDoc = await this.usernameService.getUsernameDocByUsername(biolinkUsername)
    const biolink = await usernameDoc.biolink

    if (!biolink) {
      throw new ApolloError(
        'Biolink with that username not found',
        ErrorCode.BIOLINK_COULD_NOT_BE_FOUND
      )
    }

    return await this.linkService.getAllSocialLinksByBiolinkId(biolink.id, options, true)
  }

  async getLinkByShortUrl(shortUrl: string, context: MyContext, password?: string): Promise<Link> {
    const link = await this.linkService.getLinkByShortenedUrl(shortUrl)

    if (
      link.enablePasswordProtection &&
      !(await this.linkService.isPasswordMatched(link, password || ''))
    ) {
      throw new ApolloError(
        'Enter correct password to go to the link',
        ErrorCode.PASSWORD_DID_NOT_MATCH
      )
    }

    const biolink = await link.biolink

    if (biolink && (biolink.settings || {}).enableUtmParameters) {
      const biolinkSettings = biolink.settings || {}

      if (link.url.includes('?'))
        link.url += `&utm_medium=${biolinkSettings.utmMedium}&utm_source=${biolinkSettings.utmSource}&utm_campaign=${biolinkSettings.utmCampaign}`
      else
        link.url += `?utm_medium=${biolinkSettings.utmMedium}&utm_source=${biolinkSettings.utmSource}&utm_campaign=${biolinkSettings.utmCampaign}`
    }

    await this.trackingService.trackVisitors(link, context)

    return link
  }

  async createNewLink(newLinkInput: NewLinkInput, context: MyContext): Promise<Link> {
    let biolink = undefined
    const user = context.user as User

    const totalCurrentlyAvailableLinks = await this.linkService.countLinksByUserId(user.id)
    const totalAllowedLinks = (await this.planService.getValuesFromPlanSettingsByPlanId(
      user.planId,
      'totalLinksLimit'
    )) as number

    if (totalCurrentlyAvailableLinks >= totalAllowedLinks) {
      throw new ApolloError(
        'Maximum links limit reached',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'passwordProtectionEnabled'
      )) &&
      (newLinkInput.enablePasswordProtection || (newLinkInput.password || '').trim().length > 0)
    ) {
      throw new ApolloError(
        'Enabling password protection is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'linksSchedulingEnabled'
      )) &&
      (newLinkInput.endDate || newLinkInput.startDate)
    ) {
      throw new ApolloError(
        'Link scheduling is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      (newLinkInput.linkColor || '').trim().length > 0
    ) {
      throw new ApolloError(
        'Link color option is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (newLinkInput.url) {
      const malicious = await isMalicious([newLinkInput.url])

      if (malicious) {
        throw new ApolloError('Malicious link detected', ErrorCode.LINK_IS_MALICIOUS)
      }
    }

    if (newLinkInput.biolinkId) {
      biolink = await this.biolinkService.getBiolinkById(newLinkInput.biolinkId)

      if (biolink.userId !== user.id) {
        throw new ForbiddenError('Forbidden')
      }

      this.linkService.increaseBiolinkLinksOrderBy1(biolink.id)
    }

    const link = await this.linkService.createLink({
      biolink,
      enablePasswordProtection: newLinkInput.enablePasswordProtection,
      endDate: newLinkInput.endDate,
      featured: newLinkInput.featured,
      linkColor: newLinkInput.linkColor,
      linkImage: newLinkInput.linkImage,
      linkTitle: newLinkInput.linkTitle,
      linkType: LinkType.Link,
      note: newLinkInput.note,
      order: 0,
      password: newLinkInput.password,
      shortenedUrl: await this.linkService.generateNewShortUrl(),
      startDate: newLinkInput.startDate,
      url: newLinkInput.url,
      user,
    })

    return link
  }

  async createNewEmbed(newLinkInput: NewEmbedInput, context: MyContext): Promise<Link> {
    let biolink = undefined
    const user = context.user as User

    const totalCurrentlyAvailableLinks = await this.linkService.countLinksByUserId(user.id)
    const totalAllowedLinks = (await this.planService.getValuesFromPlanSettingsByPlanId(
      user.planId,
      'totalLinksLimit'
    )) as number

    if (totalCurrentlyAvailableLinks >= totalAllowedLinks) {
      throw new ApolloError(
        'Maximum links limit reached',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'passwordProtectionEnabled'
      )) &&
      (newLinkInput.enablePasswordProtection || (newLinkInput.password || '').trim().length > 0)
    ) {
      throw new ApolloError(
        'Enabling password protection is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'linksSchedulingEnabled'
      )) &&
      (newLinkInput.endDate || newLinkInput.startDate)
    ) {
      throw new ApolloError(
        'Link scheduling is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      (newLinkInput.linkColor || '').trim().length > 0
    ) {
      throw new ApolloError(
        'Link color option is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (newLinkInput.url) {
      const malicious = await isMalicious([newLinkInput.url])

      if (malicious) {
        throw new ApolloError('Malicious link detected', ErrorCode.LINK_IS_MALICIOUS)
      }
    }

    if (newLinkInput.biolinkId) {
      biolink = await this.biolinkService.getBiolinkById(newLinkInput.biolinkId)

      if (biolink.userId !== user.id) {
        throw new ForbiddenError('Forbidden')
      }

      this.linkService.increaseBiolinkLinksOrderBy1(biolink.id)
    }

    const link = await this.linkService.createLink({
      biolink,
      enablePasswordProtection: newLinkInput.enablePasswordProtection,
      endDate: newLinkInput.endDate,
      featured: newLinkInput.featured,
      linkColor: newLinkInput.linkColor,
      linkImage: newLinkInput.linkImage,
      linkTitle: newLinkInput.linkTitle,
      linkType: LinkType.Embed,
      note: newLinkInput.note,
      order: 0,
      password: newLinkInput.password,
      shortenedUrl: await this.linkService.generateNewShortUrl(),
      startDate: newLinkInput.startDate,
      url: newLinkInput.url,
      user,
    })

    return link
  }

  async createNewLine(newLinkInput: NewLineInput, context: MyContext): Promise<Link> {
    const user = context.user as User
    let biolink = undefined

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      (newLinkInput.linkColor || '').trim().length > 0
    ) {
      throw new ApolloError(
        'Link color option is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (newLinkInput.biolinkId) {
      biolink = await this.biolinkService.getBiolinkById(newLinkInput.biolinkId)

      if (biolink.userId !== user.id) {
        throw new ForbiddenError('Forbidden')
      }

      this.linkService.increaseBiolinkLinksOrderBy1(biolink.id)
    }

    const link = await this.linkService.createLink({
      biolink,
      linkColor: newLinkInput.linkColor,
      linkType: LinkType.Line,
      order: 0,
      user: context.user,
    })

    return link
  }

  async createNewSocialLink(newLinkInput: NewSocialLinkInput, context: MyContext): Promise<Link> {
    let biolink = undefined
    const user = context.user as User

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'socialEnabled'
      )) as boolean
    ) {
      throw new ApolloError(
        'Cannot attach social links in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'passwordProtectionEnabled'
      )) &&
      (newLinkInput.enablePasswordProtection || (newLinkInput.password || '').trim().length > 0)
    ) {
      throw new ApolloError(
        'Enabling password protection is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'linksSchedulingEnabled'
      )) &&
      (newLinkInput.endDate || newLinkInput.startDate)
    ) {
      throw new ApolloError(
        'Link scheduling is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      (newLinkInput.linkColor || '').trim().length > 0
    ) {
      throw new ApolloError(
        'Link color option is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (newLinkInput.url) {
      const malicious = await isMalicious([newLinkInput.url])

      if (malicious) {
        throw new ApolloError('Malicious link detected', ErrorCode.LINK_IS_MALICIOUS)
      }
    }

    if (newLinkInput.biolinkId) {
      biolink = await this.biolinkService.getBiolinkById(newLinkInput.biolinkId)

      if (biolink.userId !== user.id) {
        throw new ForbiddenError('Forbidden')
      }

      this.linkService.increaseBiolinkSocialLinksOrderBy1(biolink.id)
    }

    const link = await this.linkService.createLink({
      biolink,
      enablePasswordProtection: newLinkInput.enablePasswordProtection,
      endDate: newLinkInput.endDate,
      featured: newLinkInput.featured,
      iconColorful: appConfig.BACKEND_URL + `/static/socialIcons/${newLinkInput.platform}.png`,
      iconMinimal:
        appConfig.BACKEND_URL + `/static/socialIcons/minimals/${newLinkInput.platform}.png`,
      linkColor: newLinkInput.linkColor,
      linkTitle: newLinkInput.linkTitle,
      linkType: LinkType.Social,
      note: newLinkInput.note,
      order: 0,
      password: newLinkInput.password,
      platform: newLinkInput.platform,
      shortenedUrl: await this.linkService.generateNewShortUrl(),
      startDate: newLinkInput.startDate,
      url: newLinkInput.url,
      user,
    })

    return link
  }

  async updateLinkById(
    linkId: string,
    newLinkInput: NewLinkInput,
    context: MyContext
  ): Promise<Link> {
    const user = context.user as User

    let link = await this.linkService.getLinkById(linkId)

    if (link.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    let biolink = undefined
    if (newLinkInput.biolinkId) {
      biolink = await this.biolinkService.getBiolinkById(newLinkInput.biolinkId)

      if (biolink.userId !== user.id) {
        throw new ForbiddenError('Forbidden')
      }
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'passwordProtectionEnabled'
      )) &&
      (newLinkInput.enablePasswordProtection || (newLinkInput.password || '').trim().length > 0)
    ) {
      throw new ApolloError(
        'Enabling password protection is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'linksSchedulingEnabled'
      )) &&
      (newLinkInput.endDate || newLinkInput.startDate)
    ) {
      throw new ApolloError(
        'Link scheduling is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      (newLinkInput.linkColor || '').trim().length > 0
    ) {
      throw new ApolloError(
        'Link color option is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (newLinkInput.url) {
      const malicious = await isMalicious([newLinkInput.url])

      if (malicious) {
        throw new ApolloError('Malicious link detected', ErrorCode.LINK_IS_MALICIOUS)
      }
    }

    link = await this.linkService.updateLinkById(link.id, {
      biolink,
      enablePasswordProtection: newLinkInput.enablePasswordProtection,
      endDate: newLinkInput.endDate,
      featured: newLinkInput.featured,
      linkColor: newLinkInput.linkColor,
      linkImage: newLinkInput.linkImage,
      linkTitle: newLinkInput.linkTitle,
      linkType: LinkType.Link,
      note: newLinkInput.note,
      order: 0,
      password: newLinkInput.password,
      shortenedUrl: await this.linkService.generateNewShortUrl(),
      startDate: newLinkInput.startDate,
      url: newLinkInput.url,
      user,
    })

    return link
  }

  async updateEmbedById(
    linkId: string,
    newLinkInput: NewEmbedInput,
    context: MyContext
  ): Promise<Link> {
    const user = context.user as User

    let link = await this.linkService.getLinkById(linkId)

    if (link.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    let biolink = undefined
    if (newLinkInput.biolinkId) {
      biolink = await this.biolinkService.getBiolinkById(newLinkInput.biolinkId)

      if (biolink.userId !== user.id) {
        throw new ForbiddenError('Forbidden')
      }
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'passwordProtectionEnabled'
      )) &&
      (newLinkInput.enablePasswordProtection || (newLinkInput.password || '').trim().length > 0)
    ) {
      throw new ApolloError(
        'Enabling password protection is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'linksSchedulingEnabled'
      )) &&
      (newLinkInput.endDate || newLinkInput.startDate)
    ) {
      throw new ApolloError(
        'Link scheduling is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      (newLinkInput.linkColor || '').trim().length > 0
    ) {
      throw new ApolloError(
        'Link color option is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (newLinkInput.url) {
      const malicious = await isMalicious([newLinkInput.url])

      if (malicious) {
        throw new ApolloError('Malicious link detected', ErrorCode.LINK_IS_MALICIOUS)
      }
    }

    link = await this.linkService.updateLinkById(link.id, {
      biolink,
      enablePasswordProtection: newLinkInput.enablePasswordProtection,
      endDate: newLinkInput.endDate,
      featured: newLinkInput.featured,
      linkColor: newLinkInput.linkColor,
      linkImage: newLinkInput.linkImage,
      linkTitle: newLinkInput.linkTitle,
      linkType: LinkType.Embed,
      note: newLinkInput.note,
      order: 0,
      password: newLinkInput.password,
      shortenedUrl: await this.linkService.generateNewShortUrl(),
      startDate: newLinkInput.startDate,
      url: newLinkInput.url,
      user,
    })

    return link
  }

  async updateLineById(
    linkId: string,
    newLinkInput: NewLineInput,
    context: MyContext
  ): Promise<Link> {
    const user = context.user as User

    let link = await this.linkService.getLinkById(linkId)

    if (link.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    let biolink = undefined
    if (newLinkInput.biolinkId) {
      biolink = await this.biolinkService.getBiolinkById(newLinkInput.biolinkId)

      if (biolink.userId !== user.id) {
        throw new ForbiddenError('Forbidden')
      }
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      (newLinkInput.linkColor || '').trim().length > 0
    ) {
      throw new ApolloError(
        'Link color option is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    link = await this.linkService.updateLinkById(link.id, {
      biolink,
      linkColor: newLinkInput.linkColor,
      linkType: LinkType.Line,
      order: 0,
      user: context.user,
    })

    return link
  }

  async updateSocialLinkByLinkId(
    linkId: string,
    newLinkInput: NewSocialLinkInput,
    context: MyContext
  ): Promise<Link> {
    const user = context.user as User

    let link = await this.linkService.getLinkById(linkId)

    if (link.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    let biolink = undefined
    if (newLinkInput.biolinkId) {
      biolink = await this.biolinkService.getBiolinkById(newLinkInput.biolinkId)

      if (biolink.userId !== user.id) {
        throw new ForbiddenError('Forbidden')
      }
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'socialEnabled'
      )) as boolean
    ) {
      throw new ApolloError(
        'Cannot attach social links in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'passwordProtectionEnabled'
      )) &&
      (newLinkInput.enablePasswordProtection || (newLinkInput.password || '').trim().length > 0)
    ) {
      throw new ApolloError(
        'Enabling password protection is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'linksSchedulingEnabled'
      )) &&
      (newLinkInput.endDate || newLinkInput.startDate)
    ) {
      throw new ApolloError(
        'Link scheduling is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      (newLinkInput.linkColor || '').trim().length > 0
    ) {
      throw new ApolloError(
        'Link color option is disabled in the current plan',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (newLinkInput.url) {
      const malicious = await isMalicious([newLinkInput.url])

      if (malicious) {
        throw new ApolloError('Malicious link detected', ErrorCode.LINK_IS_MALICIOUS)
      }
    }

    link = await this.linkService.updateLinkById(link.id, {
      biolink,
      enablePasswordProtection: newLinkInput.enablePasswordProtection,
      endDate: newLinkInput.endDate,
      featured: newLinkInput.featured,
      iconColorful: appConfig.BACKEND_URL + `/static/socialIcons/${newLinkInput.platform}.png`,
      iconMinimal:
        appConfig.BACKEND_URL + `/static/socialIcons/minimals/${newLinkInput.platform}.png`,
      linkColor: newLinkInput.linkColor,
      linkTitle: newLinkInput.linkTitle,
      linkType: LinkType.Social,
      note: newLinkInput.note,
      order: 0,
      password: newLinkInput.password,
      platform: newLinkInput.platform,
      shortenedUrl: await this.linkService.generateNewShortUrl(),
      startDate: newLinkInput.startDate,
      url: newLinkInput.url,
      user,
    })

    return link
  }

  async removeLink(linkId: string, context: MyContext): Promise<Link> {
    const user = context.user as User

    let link = await this.linkService.getLinkById(linkId)

    if (link.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    link = await this.linkService.softDeleteLinkById(linkId)

    return link
  }
}
