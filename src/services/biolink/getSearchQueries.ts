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
      .limit(10)

    response.categories = (await categoryQueryBuilder.getMany()).map(
      (category) => category.categoryName
    )

    const biolinkUsernameQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.username) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.username', 'ASC')
      .limit(10)

    response.directories = (await biolinkUsernameQueryBuilder.getMany()).map(
      (biolink) => biolink.username
    )

    const biolinkDisplayNameQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.displayName) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.displayName', 'ASC')
      .limit(Math.min(10 - response.directories.length, 10))

    response.directories = response.directories.concat(
      (await biolinkDisplayNameQueryBuilder.getMany()).map((biolink) => biolink.displayName)
    )

    const biolinkDirectoryBioQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy(`biolink.settings->>'directoryBio'`, 'ASC')
      .limit(Math.min(10 - response.directories.length, 10))

    response.directories = response.directories.concat(
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
      .limit(Math.min(10 - response.directories.length, 10))

    response.directories = response.directories.concat(
      (await biolinkBioQueryBuilder.getMany()).map((biolink) => biolink.bio)
    )

    const biolinkCityQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.city) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.city', 'ASC')
      .limit(Math.min(10 - response.directories.length, 10))

    response.directories = response.directories.concat(
      (await biolinkCityQueryBuilder.getMany()).map((biolink) => biolink.city)
    )

    const biolinkStateQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.state) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.state', 'ASC')
      .limit(Math.min(10 - response.directories.length, 10))

    response.directories = response.directories.concat(
      (await biolinkStateQueryBuilder.getMany()).map((biolink) => biolink.state)
    )

    const biolinkCountryQueryBuilder = getRepository(Biolink)
      .createQueryBuilder('biolink')
      .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
      .andWhere(`LOWER(biolink.country) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
      .orderBy('biolink.country', 'ASC')
      .limit(Math.min(10 - response.directories.length, 10))

    response.directories = response.directories.concat(
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
