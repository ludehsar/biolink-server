import { validate } from 'class-validator'
import randToken from 'rand-token'
import { createWriteStream } from 'fs'
import path from 'path'

import { User, Message } from '../../entities'
import { NewMessageInput } from '../../input-types'
import { ErrorResponse, MessageResponse } from '../../object-types'
import { MyContext, ErrorCode } from '../../types'
import { BACKEND_URL } from '../../config'
import { captureUserActivity } from '../../services'

export const createNewMessage = async (
  receiverId: string,
  options: NewMessageInput,
  sender: User,
  context: MyContext
): Promise<MessageResponse> => {
  const validationErrors = await validate(options)
  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
    }
  }

  if (!sender) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'Not authenticated',
        },
      ],
    }
  }

  const receiver = await User.findOne(receiverId)

  if (!receiver) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USERNAME_NOT_FOUND,
          message: 'Receiver not found',
        },
      ],
    }
  }

  const message = Message.create()

  message.sender = Promise.resolve(sender)
  message.receiver = Promise.resolve(receiver)

  if (options.message) {
    message.message = options.message
  }

  if (options.attachment) {
    const { createReadStream, filename } = options.attachment

    const attachmentExt = filename?.split('.').pop() || ''

    const errors: ErrorResponse[] = []

    const attachmentName = `${randToken.generate(20)}-${Date.now().toString()}.${attachmentExt}`

    const directory = path.join(__dirname, `../../../assets/attachments/${attachmentName}`)

    createReadStream()
      .pipe(createWriteStream(directory))
      .on('error', () => {
        errors.push({
          errorCode: ErrorCode.UPLOAD_ERROR,
          message: 'Unable to upload profile photo',
        })
      })

    if (errors.length > 0) {
      return {
        errors,
      }
    }

    message.attachmentUrl = BACKEND_URL + '/static/attachments/' + attachmentName
  }

  await message.save()

  // Push to pusher

  await captureUserActivity(sender, context, `Sent message to user ${receiverId}`, false)

  return {
    message,
  }
}
