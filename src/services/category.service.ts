import moment from 'moment'
import { getRepository, LessThan, MoreThan } from 'typeorm'

import { ConnectionArgs } from '../resolvers/relaySpec'
import { Category } from '../models/entities/Category'
import { CategoryConnection } from '../resolvers/category.resolver'

export const getAllCateogories = async (options: ConnectionArgs): Promise<CategoryConnection> => {
  // Getting pageinfo
  const firstCategory = await getRepository(Category)
    .createQueryBuilder('category')
    .orderBy('category.createdAt', 'ASC')
    .getOne()

  const lastCategory = await getRepository(Category)
    .createQueryBuilder('category')
    .orderBy('category.createdAt', 'DESC')
    .getOne()

  // Getting before and after cursors from connection args
  let before = null
  if (options.before) before = atob(options.before)
  let after = null
  if (options.after) after = atob(options.after)

  // Preparing object
  const connection = new CategoryConnection()
  const qb = getRepository(Category)
    .createQueryBuilder('category')
    .where(`LOWER(category.categoryName) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })

  if (before) {
    qb.andWhere('category.createdAt <= :before', { before })
  }

  if (after) {
    qb.andWhere('category.createdAt >= :after', { after })
  }

  qb.orderBy('category.categoryName', 'ASC')

  if (options.first) {
    qb.limit(options.first)
  }

  const categories = await qb.getMany()

  // Checking if previous page and next page is present
  const dates = categories.map((c) => moment(c.createdAt))
  const maxDate = moment.max(dates)
  const minDate = moment.min(dates)

  const previousCategories = await Category.find({
    where: {
      createdAt: LessThan(minDate.format('YYYY-MM-DD HH:mm:ss')),
    },
  })

  const nextCategories = await Category.find({
    where: {
      createdAt: MoreThan(maxDate.format('YYYY-MM-DD HH:mm:ss')),
    },
  })

  connection.edges = categories.map((category) => ({
    node: category,
    cursor: btoa(moment(category.createdAt).format('YYYY-MM-DD HH:mm:ss')),
  }))

  connection.pageInfo = {
    startCursor: btoa(moment(firstCategory?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''),
    endCursor: btoa(moment(lastCategory?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''),
    hasNextPage: !!nextCategories.length,
    hasPreviousPage: !!previousCategories.length,
  }

  return connection
}
