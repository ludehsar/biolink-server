import { Query, Resolver } from 'type-graphql'

import { Settings } from '../../models/entities/Settings'
import { MainSystemSettings } from '../../models/jsonTypes/MainSystemSettings'
import { SettingsResponse } from '../../typeDefs/settings.typeDef'

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
