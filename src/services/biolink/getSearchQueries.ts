import { getRepository } from 'typeorm'
import { ErrorCode } from '../../types'
import { Biolink, Category } from '../../entities'
import { DirectorySearchResponse } from '../../object-types'

export const getSearchQueries = async (query: string): Promise<DirectorySearchResponse> => {
  const response: DirectorySearchResponse = {}

  try {
    const categoryQueryBuilder = getRepository(Category)
      .createQueryBuilder('category')
      .where(`LOWER(category.categoryName) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('category.categoryName', 'ASC')
      .limit(Math.max(10 - (response.results || []).length, 0))

    response.results = (await categoryQueryBuilder.getMany()).map(
      (category) => category.categoryName
    )

    const biolinkUsernameQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .leftJoinAndSelect('biolink.username', 'username')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(username.username) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('username.username', 'ASC')
      .limit(Math.max(10 - (response.results || []).length, 0))

    response.results = response.results.concat(
      await Promise.all(
        (
          await biolinkUsernameQueryBuilder.getMany()
        ).map(async (biolink) => (await biolink.username)?.username || '')
      )
    )

    const biolinkDisplayNameQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.displayName) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.displayName', 'ASC')
      .limit(Math.max(10 - (response.results || []).length, 0))

    response.results = response.results.concat(
      (await biolinkDisplayNameQueryBuilder.getMany()).map((biolink) => biolink.displayName)
    )

    const biolinkDirectoryBioQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy(`biolink.settings->>'directoryBio'`, 'ASC')
      .limit(Math.max(10 - (response.results || []).length, 0))

    response.results = response.results.concat(
      (await biolinkDirectoryBioQueryBuilder.getMany()).map(
        (biolink) => biolink.settings.directoryBio
      )
    )

    const biolinkBioQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.bio) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.bio', 'ASC')
      .limit(Math.max(10 - (response.results || []).length, 0))

    response.results = response.results.concat(
      (await biolinkBioQueryBuilder.getMany()).map((biolink) => biolink.bio)
    )

    const biolinkCityQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.city) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.city', 'ASC')
      .limit(Math.max(10 - (response.results || []).length, 0))

    response.results = response.results.concat(
      (await biolinkCityQueryBuilder.getMany()).map((biolink) => biolink.city)
    )

    const biolinkStateQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.state) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.state', 'ASC')
      .limit(Math.max(10 - (response.results || []).length, 0))

    response.results = response.results.concat(
      (await biolinkStateQueryBuilder.getMany()).map((biolink) => biolink.state)
    )

    const biolinkCountryQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.country) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.country', 'ASC')
      .limit(Math.max(10 - (response.results || []).length, 0))

    response.results = response.results.concat(
      (await biolinkCountryQueryBuilder.getMany()).map((biolink) => biolink.country)
    )
  } catch (err) {
    response.errors = [
      {
        errorCode: ErrorCode.DATABASE_ERROR,
        message: 'Something went wrong!',
      },
    ]
  }

  return response
}
