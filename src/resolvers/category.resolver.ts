import moment from 'moment'
import { Arg, ObjectType, Query, Resolver } from 'type-graphql'
import { getRepository, LessThan, MoreThan } from 'typeorm'

import { Category } from '../models/entities/Category'
import { ConnectionArgs, ConnectionType, EdgeType } from './relaySpec'

@ObjectType()
export class CategoryEdge extends EdgeType('category', Category) {}

@ObjectType()
export class CategoryConnection extends ConnectionType<CategoryEdge>('category', CategoryEdge) {}

@Resolver()
export class CategoryResolver {
  @Query(() => CategoryConnection, { nullable: true })
  async fetchAllCategories(@Arg('options') options: ConnectionArgs): Promise<CategoryConnection> {
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
    if (options.after) {
      after = moment(atob(options.after)).add(1, 'second').format('YYYY-MM-DD HH:mm:ss')
    }

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

    qb.orderBy('category.categoryName', 'ASC')

    if (options.first) {
      qb.limit(options.first)
    }

    const categories = await qb.getMany()

    // Checking if previous page and next page is present
    const dates = categories.map((c) => moment(c.createdAt))
    const maxDate = moment.max(dates).add(1, 'second')
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
}
