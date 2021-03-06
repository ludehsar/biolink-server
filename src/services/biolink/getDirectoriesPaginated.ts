import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { Biolink } from '../../entities'
import { ConnectionArgsOld } from '../../input-types'
import { BiolinkConnection } from '../../object-types'

export const getDirectoriesPaginated = async (
  categoryIds: number[],
  options: ConnectionArgsOld
): Promise<BiolinkConnection> => {
  // Getting before and after cursors from connection args
  let before = null
  if (options.before) before = Buffer.from(options.before, 'base64').toString()

  let after = null
  if (options.after)
    after = moment(Buffer.from(options.after, 'base64').toString())
      .add(1, 'second')
      .format('YYYY-MM-DD HH:mm:ss')

  // Gettings the directories and preparing objects
  const connection = new BiolinkConnection()

  const qb = getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .leftJoinAndSelect('biolink.user', 'user')
    .leftJoinAndSelect('biolink.username', 'username')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(username.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.city) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.state) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.country) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.bio) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (categoryIds) {
    qb.andWhere('biolink.categoryId in (:...categoryIds)', { categoryIds })
  }

  if (before) {
    qb.andWhere('biolink.createdAt < :before', { before })
      .orderBy('biolink.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('biolink.createdAt > :after', { after })
      .orderBy('biolink.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('biolink.createdAt', 'ASC').limit(options.first)
  }

  const biolinks = await qb.getMany()

  if (before) {
    biolinks.reverse()
  }

  const firstBiolink = biolinks[0]
  const lastBiolink = biolinks[biolinks.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstBiolink?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastBiolink?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = biolinks.map((biolink) => ({
    node: biolink,
    cursor: Buffer.from(moment(biolink.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousBiolinks = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .leftJoinAndSelect('biolink.user', 'user')
    .leftJoinAndSelect('biolink.username', 'username')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(username.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.city) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.state) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.country) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.bio) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('biolink.createdAt < :minDate', { minDate })
    .getMany()

  const nextBiolinks = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .leftJoinAndSelect('biolink.user', 'user')
    .leftJoinAndSelect('biolink.username', 'username')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(username.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.city) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.state) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.country) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.bio) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('biolink.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstBiolink?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastBiolink?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextBiolinks.length,
    hasPreviousPage: !!previousBiolinks.length,
  }

  return connection
}
