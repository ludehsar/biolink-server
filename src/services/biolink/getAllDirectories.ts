import { Category, Biolink } from 'entities'
import { ConnectionArgs } from 'input-types'
import moment from 'moment'
import { BiolinkConnection } from 'object-types'
import { getRepository, Brackets } from 'typeorm'

export const getAllDirectories = async (
  categoryId: number,
  options: ConnectionArgs
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
  const category = await Category.findOne(categoryId)

  const qb = getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(biolink.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.location) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (category) {
    qb.andWhere('biolink.categoryId = :categoryId', { categoryId })
  }

  qb.leftJoinAndSelect('biolink.user', 'user')

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
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(biolink.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.location) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('biolink.createdAt < :minDate', { minDate })
    .getMany()

  const nextBiolinks = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(biolink.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.location) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
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
