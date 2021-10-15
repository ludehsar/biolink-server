import { Service } from 'typedi'
import { ForbiddenError } from 'apollo-server-errors'
import { FileUpload } from 'graphql-upload'

import { MyContext } from '../types'
import { ChatRoomService } from '../services/chatroom.service'
import { ChatRoom, Message, User } from '../entities'
import { PaginatedUserResponse } from '../object-types/common/PaginatedUserResponse'
import { ConnectionArgs, NewMessageInput } from '../input-types'
import { PaginatedChatRoomResponse } from '../object-types/common/PaginatedChatRoomResponse'
import { MessageService } from '../services/message.service'
import { PaginatedMessageResponse } from '../object-types/common/PaginatedMessageResponse'

@Service()
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly messageService: MessageService
  ) {}

  async getAssociatedChatRoomOfUsers(userIds: string[], context: MyContext): Promise<ChatRoom> {
    if (!userIds.includes((context.user as User).id)) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.chatRoomService.findOrCreateChatRoomByUserIds(userIds)
  }

  async getChatRoomUsersByRoomId(
    roomId: string,
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedUserResponse> {
    const chatRoom = await this.chatRoomService.getChatRoomById(roomId)

    if (!(await this.chatRoomService.isMemberOfRoom(chatRoom.id, (context.user as User).id))) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.chatRoomService.getChatRoomUsers(roomId, options)
  }

  async getUserChatRooms(
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedChatRoomResponse> {
    return await this.chatRoomService.getChatRoomsByUserId((context.user as User).id, options)
  }

  async getAllChatMessagesByRoomId(
    roomId: string,
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedMessageResponse> {
    const chatRoom = await this.chatRoomService.getChatRoomById(roomId)

    if (!(await this.chatRoomService.isMemberOfRoom(chatRoom.id, (context.user as User).id))) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.messageService.getAllChatMessagesByRoomId(chatRoom.id, options)
  }

  async isMemberOfRoomByRoomId(roomId: string, context: MyContext): Promise<boolean> {
    const chatRoom = await this.chatRoomService.getChatRoomById(roomId)

    return !!(await this.chatRoomService.isMemberOfRoom(chatRoom.id, (context.user as User).id))
  }

  async createNewMessage(
    roomId: string,
    input: NewMessageInput,
    context: MyContext,
    attachment?: FileUpload
  ): Promise<Message> {
    const chatRoom = await this.chatRoomService.getChatRoomById(roomId)

    if (!(await this.chatRoomService.isMemberOfRoom(chatRoom.id, (context.user as User).id))) {
      throw new ForbiddenError('Forbidden')
    }

    const message = await this.messageService.createMessage(context.user as User, chatRoom, {
      attachment,
      message: input.message,
    })

    return message
  }

  async editMessage(
    messageId: string,
    input: NewMessageInput,
    context: MyContext
  ): Promise<Message> {
    let message = await this.messageService.getMessageById(messageId)

    if (message.senderId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    message = await this.messageService.updateMessageById(message.id, {
      message: input.message,
    })

    return message
  }

  async deleteMessage(messageId: string, context: MyContext): Promise<Message> {
    let message = await this.messageService.getMessageById(messageId)

    if (message.senderId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    message = await this.messageService.softDeleteMessageById(message.id)

    return message
  }
}
