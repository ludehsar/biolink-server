import { Field, ObjectType, Query, Resolver } from 'type-graphql'

import { Settings } from '../../models/entities/Settings'
import { MainSystemSettings } from '../../models/jsonTypes/MainSystemSettings'

@ObjectType()
export class SettingsResponse {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  defaultLanguage?: string

  @Field(() => String, { nullable: true })
  websiteLogo?: string

  @Field(() => String, { nullable: true })
  favicon?: string

  @Field(() => String, { nullable: true })
  defaultTimezone?: string

  @Field(() => String, { nullable: true })
  termsAndConditionsUrl?: string

  @Field(() => String, { nullable: true })
  privacyPolicyUrl?: string
}

@Resolver()
export class SettingsResolver {
  @Query(() => SettingsResponse)
  async getSettings(): Promise<SettingsResponse> {
    const settings = await Settings.findOne({ where: { key: 'main' } })

    if (!settings) return {}

    const mainSettings = settings.value as unknown as MainSystemSettings

    return mainSettings
  }
}
