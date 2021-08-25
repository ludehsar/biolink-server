import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { Payment, User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { PaymentConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getUserPaymentsPaginated = async (
  options: ConnectionArgs,
  user: User,
  context: MyContext
): Promise<PaymentConnection> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  // Getting before and after cursors from connection args
  let before = null
  if (options.before) before = Buffer.from(options.before, 'base64').toString()

  let after = null
  if (options.after)
    after = moment(Buffer.from(options.after, 'base64').toString())
      .add(1, 'second')
      .format('YYYY-MM-DD HH:mm:ss')

  // Gettings the directories and preparing objects
  const connection = new PaymentConnection()

  const qb = getRepository(Payment)
    .createQueryBuilder('payment')
    .where('payment.userId = :userId', { userId: user.id })
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER("payment"."stripeAmountDue"::text) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER("payment"."stripeAmountPaid"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("payment"."stripeAmountRemaining"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeChargeId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("payment"."stripeInvoiceCreated"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeCustomerId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeCustomerEmail) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeCustomerName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeDiscount) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripePriceId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeSubscriptionId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeInvoiceNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (before) {
    qb.andWhere('payment.createdAt < :before', { before })
      .orderBy('payment.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('payment.createdAt > :after', { after })
      .orderBy('payment.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('payment.createdAt', 'ASC').limit(options.first)
  }

  const payments = await qb.getMany()

  if (before) {
    payments.reverse()
  }

  const firstPayment = payments[0]
  const lastPayment = payments[payments.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstPayment?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastPayment?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = payments.map((payment) => ({
    node: payment,
    cursor: Buffer.from(moment(payment.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousPayments = await getRepository(Payment)
    .createQueryBuilder('payment')
    .where('payment.userId = :userId', { userId: user.id })
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER("payment"."stripeAmountDue"::text) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER("payment"."stripeAmountPaid"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("payment"."stripeAmountRemaining"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeChargeId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("payment"."stripeInvoiceCreated"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeCustomerId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeCustomerEmail) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeCustomerName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeDiscount) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripePriceId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeSubscriptionId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeInvoiceNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('payment.createdAt < :minDate', { minDate })
    .getMany()

  const nextPayments = await getRepository(Payment)
    .createQueryBuilder('payment')
    .where('payment.userId = :userId', { userId: user.id })
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER("payment"."stripeAmountDue"::text) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER("payment"."stripeAmountPaid"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("payment"."stripeAmountRemaining"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeChargeId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("payment"."stripeInvoiceCreated"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeCustomerId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeCustomerEmail) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeCustomerName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeDiscount) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripePriceId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeSubscriptionId) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(payment.stripeInvoiceNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('payment.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstPayment?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastPayment?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextPayments.length,
    hasPreviousPage: !!previousPayments.length,
  }

  await captureUserActivity(user, context, `Requested stripe payments`, false)

  return connection
}
