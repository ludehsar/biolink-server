import { FileUpload, GraphQLUpload } from 'graphql-upload'
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
  PubSub,
  Publisher,
  Subscription,
  Root,
} from 'type-graphql'

import { ChatRoomController } from '../../controllers'
import { ChatRoom, Message } from '../../entities'
import { authUser, emailVerified } from '../../middlewares'
import { PaginatedMessageResponse } from '../../object-types/common/PaginatedMessageResponse'
import { ConnectionArgs, NewMessageInput } from '../../input-types'
import { PaginatedChatRoomResponse } from '../../object-types/common/PaginatedChatRoomResponse'
import { PaginatedUserResponse } from '../../object-types/common/PaginatedUserResponse'
import { MyContext } from '../../types'
import { MessagePayload } from 'interfaces/MessagePayload'

@Resolver()
export class MessageResolver {
  constructor(private readonly chatRoomController: ChatRoomController) {}

  @Query(() => ChatRoom)
  @UseMiddleware(authUser)
  async getAssociatedChatRoomsOfUsers(
    @Arg('userIds', () => [String]) userIds: string[],
    @Ctx() context: MyContext
  ): Promise<ChatRoom> {
    return await this.chatRoomController.getAssociatedChatRoomOfUsers(userIds, context)
  }

  @Query(() => PaginatedUserResponse)
  @UseMiddleware(authUser)
  async getChatRoomUsers(
    @Arg('roomId', () => String) roomId: string,
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedUserResponse> {
    return await this.chatRoomController.getChatRoomUsersByRoomId(roomId, options, context)
  }

  @Query(() => PaginatedChatRoomResponse)
  @UseMiddleware(authUser)
  async getAllChatRoomsOfUser(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedChatRoomResponse> {
    return await this.chatRoomController.getUserChatRooms(options, context)
  }

  @Query(() => PaginatedMessageResponse)
  @UseMiddleware(authUser)
  async getAllChatMessagesByRoomId(
    @Arg('roomId', () => String) roomId: string,
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedMessageResponse> {
    return await this.chatRoomController.getAllChatMessagesByRoomId(roomId, options, context)
  }

  @Mutation(() => Message)
  @UseMiddleware(authUser, emailVerified)
  async sendMessage(
    @Arg('roomId', () => String) roomId: string,
    @Arg('options', () => NewMessageInput) options: NewMessageInput,
    @Arg('attachment', () => GraphQLUpload, { nullable: true }) attachment: FileUpload,
    @PubSub('messageReceived') publish: Publisher<MessagePayload>,
    @Ctx() context: MyContext
  ): Promise<Message> {
    const message = await this.chatRoomController.createNewMessage(
      roomId,
      options,
      context,
      attachment
    )
    const { data } = await this.chatRoomController.getChatRoomUsersByRoomId(
      roomId,
      {
        limit: 250,
        order: 'ASC',
        query: '',
      },
      context
    )

    await publish({
      message,
      userIds: data.map((user) => user.id),
    })

    return message
  }

  @Subscription({
    topics: 'messageReceived',
    filter: ({ payload, args, context }) =>
      payload.message.chatRoomId === args.roomId &&
      (payload.userIds as string[]).includes(context.connection.context.userId),
  })
  newMessage(
    @Root() messagePayload: MessagePayload,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Arg('roomId', () => String) _roomId: string
  ): Message {
    return messagePayload.message
  }

  @Mutation(() => Message)
  @UseMiddleware(authUser, emailVerified)
  async editMessage(
    @Arg('messageId', () => String) messageId: string,
    @Arg('options', () => NewMessageInput) options: NewMessageInput,
    @PubSub('messageEdited') publish: Publisher<MessagePayload>,
    @Ctx() context: MyContext
  ): Promise<Message> {
    const message = await this.chatRoomController.editMessage(messageId, options, context)
    const { data } = await this.chatRoomController.getChatRoomUsersByRoomId(
      message.chatRoomId,
      {
        limit: 250,
        order: 'ASC',
        query: '',
      },
      context
    )

    await publish({
      message,
      userIds: data.map((user) => user.id),
    })

    return message
  }

  @Subscription({
    topics: 'messageEdited',
    filter: ({ payload, args, context }) =>
      payload.message.chatRoomId === args.roomId &&
      (payload.userIds as string[]).includes(context.connection.context.userId),
  })
  editedMessage(
    @Root() messagePayload: MessagePayload,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Arg('roomId', () => String) _roomId: string
  ): Message {
    return messagePayload.message
  }

  @Mutation(() => Message)
  @UseMiddleware(authUser, emailVerified)
  async deleteMessage(
    @Arg('messageId', () => String) messageId: string,
    @PubSub('messageDeleted') publish: Publisher<MessagePayload>,
    @Ctx() context: MyContext
  ): Promise<Message> {
    const message = await this.chatRoomController.deleteMessage(messageId, context)
    const { data } = await this.chatRoomController.getChatRoomUsersByRoomId(
      message.chatRoomId,
      {
        limit: 250,
        order: 'ASC',
        query: '',
      },
      context
    )

    await publish({
      message,
      userIds: data.map((user) => user.id),
    })

    return message
  }

  @Subscription({
    topics: 'messageDeleted',
    filter: ({ payload, args, context }) =>
      payload.message.chatRoomId === args.roomId &&
      (payload.userIds as string[]).includes(context.connection.context.userId),
  })
  deletedMessage(
    @Root() messagePayload: MessagePayload,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Arg('roomId', () => String) _roomId: string
  ): Message {
    return messagePayload.message
  }
}
