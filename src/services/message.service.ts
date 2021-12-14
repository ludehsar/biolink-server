import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { ApolloError } from 'apollo-server-errors'

import { ChatRoom, Message, User } from '../entities'
import { PaginatedMessageResponse } from '../object-types/common/PaginatedMessageResponse'
import { ConnectionArgs } from '../input-types'
import { MessageUpdateBody } from '../interfaces/MessageUpdateBody'
import { ErrorCode } from '../types'

@Service()
export class MessageService {
  constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

  /**
   * Get all chat messages by room id
   * @param {string} roomId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedMessageResponse>}
   */
  async getAllChatMessagesByRoomId(
    roomId: string,
    options: ConnectionArgs
  ): Promise<PaginatedMessageResponse> {
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .where('message.chatRoomId = :roomId', { roomId })

    const paginator = buildPaginator({
      entity: Message,
      alias: 'message',
      paginationKeys: ['id'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }

  /**
   * Get message by id
   * @param {string} messageId
   * @returns {Promise<Message>}
   */
  async getMessageById(messageId: string): Promise<Message> {
    const message = await this.messageRepository.findOne(messageId)

    if (!message) {
      throw new ApolloError('Invalid message id', ErrorCode.INVALID_MESSAGE_ID)
    }

    return message
  }

  /**
   * Create a chat message
   * @param {User} sender
   * @param {ChatRoom} room
   * @param {MessageUpdateBody} updateBody
   * @returns {Promise<Message>}
   */
  async createMessage(
    sender: User,
    room: ChatRoom,
    updateBody: MessageUpdateBody
  ): Promise<Message> {
    let message = this.messageRepository.create()
    message.sender = Promise.resolve(sender)
    message.chatRoom = Promise.resolve(room)

    await message.save()

    message = await this.updateMessageById(message.id, updateBody)

    return message
  }

  /**
   * Updates message by message id
   * @param {MessageUpdateBody} updateBody
   * @returns {Promise<Message>}
   */
  async updateMessageById(messageId: string, updateBody: MessageUpdateBody): Promise<Message> {
    const message = await this.getMessageById(messageId)

    if (updateBody.attachment !== undefined) {
      // TODO: Upload file to aws s3
    }
    if (updateBody.message !== undefined) message.message = updateBody.message

    await message.save()

    return message
  }

  /**
   * Soft removes message by id
   * @param {string} messageId
   * @returns {Promise<Message>}
   */
  async softDeleteMessageById(messageId: string): Promise<Message> {
    const message = await this.getMessageById(messageId)

    await message.softRemove()

    return message
  }
}
