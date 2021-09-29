import moment from 'moment'
import { Brackets, getRepository } from 'typeorm'

import { User, Message } from '../../entities'
import { ConnectionArgsOld } from '../../input-types'
import { MessageConnection } from '../../object-types'
import { MyContext, ErrorCode } from '../../types'
import { captureUserActivity } from '../../services'

export const getMessagesPaginated = async (
  otherUserId: string,
  options: ConnectionArgsOld,
  user: User,
  context: MyContext
): Promise<MessageConnection> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'Not authenticated',
        },
      ],
    }
  }

  const otherUser = await User.findOne(otherUserId)

  if (!otherUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USERNAME_NOT_FOUND,
          message: 'Receiver not found',
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
  const connection = new MessageConnection()

  const qb = getRepository(Message)
    .createQueryBuilder('message')
    .leftJoinAndSelect('message.sender', 'sender')
    .leftJoinAndSelect('message.receiver', 'receiver')
    .where(
      new Brackets((qb) => {
        qb.where(`sender.id = :userId AND receiver.id = :otherUserId`, {
          userId: user.id,
          otherUserId: otherUser.id,
        }).orWhere(`sender.id = :otherUserId AND receiver.id = :userId`, {
          userId: user.id,
          otherUserId: otherUser.id,
        })
      })
    )
    .andWhere(`LOWER(message.message) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })

  if (before) {
    qb.andWhere('message.createdAt < :before', { before })
      .orderBy('message.createdAt', 'DESC')
      .limit(options.last)
  } else if (after) {
    qb.andWhere('message.createdAt > :after', { after })
      .orderBy('message.createdAt', 'DESC')
      .limit(options.last)
  } else {
    qb.orderBy('message.createdAt', 'DESC').limit(options.last)
  }

  const messages = await qb.getMany()

  messages.reverse()

  const firstMessage = messages[0]
  const lastMessage = messages[messages.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstMessage?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastMessage?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = messages.map((message) => ({
    node: message,
    cursor: Buffer.from(moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousMessages = await getRepository(Message)
    .createQueryBuilder('message')
    .leftJoinAndSelect('message.sender', 'sender')
    .leftJoinAndSelect('message.receiver', 'receiver')
    .where(
      new Brackets((qb) => {
        qb.where(`sender.id = :userId AND receiver.id = :otherUserId`, {
          userId: user.id,
          otherUserId: otherUser.id,
        }).orWhere(`sender.id = :otherUserId AND receiver.id = :userId`, {
          userId: user.id,
          otherUserId: otherUser.id,
        })
      })
    )
    .andWhere(`LOWER(message.message) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })
    .andWhere('message.createdAt < :minDate', { minDate })
    .getMany()

  const nextMessages = await getRepository(Message)
    .createQueryBuilder('message')
    .leftJoinAndSelect('message.sender', 'sender')
    .leftJoinAndSelect('message.receiver', 'receiver')
    .where(
      new Brackets((qb) => {
        qb.where(`sender.id = :userId AND receiver.id = :otherUserId`, {
          userId: user.id,
          otherUserId: otherUser.id,
        }).orWhere(`sender.id = :otherUserId AND receiver.id = :userId`, {
          userId: user.id,
          otherUserId: otherUser.id,
        })
      })
    )
    .andWhere(`LOWER(message.message) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })
    .andWhere('message.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstMessage?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastMessage?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextMessages.length,
    hasPreviousPage: !!previousMessages.length,
  }

  await captureUserActivity(user, context, `Read messages with user ${otherUserId}`, false)

  return connection
}
