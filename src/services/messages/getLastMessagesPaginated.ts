import moment from 'moment'
import { getConnection } from 'typeorm'

import { User, Message } from '../../entities'
import { ConnectionArgsOld } from '../../input-types'
import { MessageConnection } from '../../object-types'
import { ErrorCode } from '../../types'

export const getLastMessagesPaginated = async (
  options: ConnectionArgsOld,
  user: User
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

  let messages = null

  if (before) {
    messages = (await getConnection().query(
      `
        SELECT "message".* from "message"
        LEFT JOIN "user" "sender"
        ON "message"."senderId" = "sender"."id"
        LEFT JOIN "user" "receiver"
        ON "message"."receiverId" = "receiver"."id"
        INNER JOIN
        (SELECT MAX("m2"."createdAt") "maxtime", "m2"."receiverId" "receiverId" FROM "message" "m2" WHERE ("m2"."senderId" = '${user.id}') GROUP BY "m2"."receiverId") "latestSent"
        ON "message"."createdAt" = "latestSent"."maxtime" and "message"."receiverId"="latestSent"."receiverId"
        FULL OUTER JOIN
        (SELECT MAX("m2"."createdAt") "maxtime", "m2"."senderId" "senderId" FROM "message" "m2" WHERE ("m2"."receiverId" = '${user.id}') GROUP BY "m2"."senderId") "latestReceived"
        ON "message"."createdAt" = "latestSent"."maxtime" and "message"."senderId"="latestReceived"."senderId"
        WHERE ("message"."createdAt" < '${before}')
        ORDER BY "message"."createdAt" DESC LIMIT '${options.last}'
      `
    )) as Message[]
  } else if (after) {
    messages = (await getConnection().query(
      `
        SELECT "message".* from "message"
        LEFT JOIN "user" "sender"
        ON "message"."senderId" = "sender"."id"
        LEFT JOIN "user" "receiver"
        ON "message"."receiverId" = "receiver"."id"
        INNER JOIN
        (SELECT MAX("m2"."createdAt") "maxtime", "m2"."receiverId" "receiverId" FROM "message" "m2" WHERE ("m2"."senderId" = '${user.id}') GROUP BY "m2"."receiverId") "latestSent"
        ON "message"."createdAt" = "latestSent"."maxtime" and "message"."receiverId"="latestSent"."receiverId"
        FULL OUTER JOIN
        (SELECT MAX("m2"."createdAt") "maxtime", "m2"."senderId" "senderId" FROM "message" "m2" WHERE ("m2"."receiverId" = '${user.id}') GROUP BY "m2"."senderId") "latestReceived"
        ON "message"."createdAt" = "latestSent"."maxtime" and "message"."senderId"="latestReceived"."senderId"
        WHERE ("message"."createdAt" > '${after}')
        ORDER BY "message"."createdAt" DESC LIMIT '${options.last}'
      `
    )) as Message[]
  } else {
    messages = (await getConnection().query(
      `
        SELECT "message".* from "message"
        LEFT JOIN "user" "sender"
        ON "message"."senderId" = "sender"."id"
        LEFT JOIN "user" "receiver"
        ON "message"."receiverId" = "receiver"."id"
        INNER JOIN
        (SELECT MAX("m2"."createdAt") "maxtime", "m2"."receiverId" "receiverId" FROM "message" "m2" WHERE ("m2"."senderId" = '${user.id}') GROUP BY "m2"."receiverId") "latestSent"
        ON "message"."createdAt" = "latestSent"."maxtime" and "message"."receiverId"="latestSent"."receiverId"
        FULL OUTER JOIN
        (SELECT MAX("m2"."createdAt") "maxtime", "m2"."senderId" "senderId" FROM "message" "m2" WHERE ("m2"."receiverId" = '${user.id}') GROUP BY "m2"."senderId") "latestReceived"
        ON "message"."createdAt" = "latestSent"."maxtime" and "message"."senderId"="latestReceived"."senderId"
        ORDER BY "message"."createdAt" DESC LIMIT '${options.last}'
      `
    )) as Message[]
  }

  for (let i = 0; i < (messages as Message[]).length; ++i) {
    const sender = await User.findOne(messages[i].senderId)

    if (!sender) {
      return {
        errors: [
          {
            errorCode: ErrorCode.DATABASE_ERROR,
            message: 'Something went wrong',
          },
        ],
      }
    }
    messages[i].sender = Promise.resolve(sender)

    const receiver = await User.findOne(messages[i].receiverId)

    if (!receiver) {
      return {
        errors: [
          {
            errorCode: ErrorCode.DATABASE_ERROR,
            message: 'Something went wrong',
          },
        ],
      }
    }
    messages[i].receiver = Promise.resolve(receiver)
  }
  const firstMessage = messages[messages.length - 1]
  const lastMessage = messages[0]

  // Checking if previous page and next page is present
  const minDate = moment(firstMessage?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastMessage?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = messages.map((message: Message) => ({
    node: message,
    cursor: Buffer.from(moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousMessages = (await getConnection().query(
    `
      SELECT "message".* from "message"
        LEFT JOIN "user" "sender"
        ON "message"."senderId" = "sender"."id"
        LEFT JOIN "user" "receiver"
        ON "message"."receiverId" = "receiver"."id"
      INNER JOIN
      (SELECT MAX("m2"."createdAt") "maxtime", "m2"."receiverId" "receiverId" FROM "message" "m2" WHERE ("m2"."senderId" = '${user.id}') GROUP BY "m2"."receiverId") "latestSent"
      ON "message"."createdAt" = "latestSent"."maxtime" and "message"."receiverId"="latestSent"."receiverId"
      FULL OUTER JOIN
      (SELECT MAX("m2"."createdAt") "maxtime", "m2"."senderId" "senderId" FROM "message" "m2" WHERE ("m2"."receiverId" = '${user.id}') GROUP BY "m2"."senderId") "latestReceived"
      ON "message"."createdAt" = "latestSent"."maxtime" and "message"."senderId"="latestReceived"."senderId"
      WHERE ("message"."createdAt" < '${minDate}')
    `
  )) as Message[]

  const nextMessages = (await getConnection().query(
    `
      SELECT "message".* from "message"
        LEFT JOIN "user" "sender"
        ON "message"."senderId" = "sender"."id"
        LEFT JOIN "user" "receiver"
        ON "message"."receiverId" = "receiver"."id"
      INNER JOIN
      (SELECT MAX("m2"."createdAt") "maxtime", "m2"."receiverId" "receiverId" FROM "message" "m2" WHERE ("m2"."senderId" = '${user.id}') GROUP BY "m2"."receiverId") "latestSent"
      ON "message"."createdAt" = "latestSent"."maxtime" and "message"."receiverId"="latestSent"."receiverId"
      FULL OUTER JOIN
      (SELECT MAX("m2"."createdAt") "maxtime", "m2"."senderId" "senderId" FROM "message" "m2" WHERE ("m2"."receiverId" = '${user.id}') GROUP BY "m2"."senderId") "latestReceived"
      ON "message"."createdAt" = "latestSent"."maxtime" and "message"."senderId"="latestReceived"."senderId"
      WHERE ("message"."createdAt" > '${maxDate}')
    `
  )) as Message[]

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

  return connection
}
