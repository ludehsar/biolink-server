import moment from 'moment'
import { getRepository } from 'typeorm'

import { ConnectionArgs } from '../typeDefs/relaySpec.typeDef'
import { Category } from '../models/entities/Category'
import { CategoryConnection } from '../typeDefs/category.typeDef'

export const getAllCateogories = async (options: ConnectionArgs): Promise<CategoryConnection> => {
  // Getting before and after cursors from connection args
  let before = null
  if (options.before) before = Buffer.from(options.before, 'base64').toString()
  let after = null
  if (options.after)
    after = moment(Buffer.from(options.after, 'base64').toString())
      .add(1, 'second')
      .format('YYYY-MM-DD HH:mm:ss')

  // Preparing object
  const connection = new CategoryConnection()
  const qb = getRepository(Category)
    .createQueryBuilder('category')
    .where(`LOWER(category.categoryName) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })

  if (before) {
    qb.andWhere('category.createdAt < :before', { before })
  }

  if (after) {
    qb.andWhere('category.createdAt > :after', { after })
  }

  qb.orderBy('category.createdAt', 'ASC')

  if (options.first) {
    qb.limit(options.first)
  }

  const categories = await qb.getMany()

  const firstCategory = categories[0]
  const lastCategory = categories[categories.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstCategory?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastCategory?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  const previousCategories = await getRepository(Category)
    .createQueryBuilder('category')
    .where(`LOWER(category.categoryName) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })
    .andWhere('category.createdAt < :minDate', { minDate })
    .getMany()

  const nextCategories = await getRepository(Category)
    .createQueryBuilder('category')
    .where(`LOWER(category.categoryName) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })
    .andWhere('category.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.edges = categories.map((category) => ({
    node: category,
    cursor: Buffer.from(moment(category.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString(
      'base64'
    ),
  }))

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstCategory?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastCategory?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextCategories.length,
    hasPreviousPage: !!previousCategories.length,
  }

  return connection
}
