import { Settings } from 'entities'
import { MainSystemSettings } from 'json-types'
import { SettingsResponse } from 'object-types'
import { Query, Resolver } from 'type-graphql'

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
